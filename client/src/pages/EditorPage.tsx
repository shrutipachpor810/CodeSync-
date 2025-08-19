import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { initSocket } from "../socket";
import { ACTIONS } from "../types";
import type { Files, ClientInfo } from "../types";

import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";

export default function EditorPage() {
  const { roomId } = useParams();
  const location = useLocation() as { state?: { username?: string } };
  const username = location.state?.username ?? "Guest";

  const socketRef = useRef<ReturnType<typeof initSocket>>();
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [files, setFiles] = useState<Files>({ html: "", css: "", js: "" });
  const [active, setActive] = useState<keyof Files>("html");

  // load initial from REST (persistence)
  useEffect(() => {
    (async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/rooms/${roomId}`);
      const data = await res.json();
      if (data?.files) setFiles(data.files);
    })();
  }, [roomId]);

  // sockets
  useEffect(() => {
    const s = initSocket();
    socketRef.current = s;

    function onError() {
      alert("Socket connection failed. Try again.");
    }
    s.on("connect_error", onError);
    s.on("connect_failed", onError);

    s.emit(ACTIONS.JOIN, { roomId, username });

    s.on(ACTIONS.JOINED, ({ clients }) => {
      setClients(clients);
      // server will also SYNC_CODE to us if needed
    });

    s.on(ACTIONS.SYNC_CODE, (incoming: Files) => {
      setFiles(incoming);
    });

    s.on(ACTIONS.CODE_CHANGE, ({ files: incoming }: { files: Files }) => {
      setFiles(incoming);
    });

    s.on(ACTIONS.DISCONNECTED, ({ socketId }) => {
      setClients(prev => prev.filter(c => c.socketId !== socketId));
    });

    return () => {
      s.disconnect();
      s.off(ACTIONS.JOINED);
      s.off(ACTIONS.SYNC_CODE);
      s.off(ACTIONS.CODE_CHANGE);
      s.off(ACTIONS.DISCONNECTED);
    };
  }, [roomId, username]);

  // emit & save (debounced)
  const saveTimer = useRef<number | null>(null);
  function updateFiles(next: Files) {
    setFiles(next);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, files: next });

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/rooms/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: next })
      });
    }, 500); // debounce 500ms
  }

  const extensions = useMemo(() => {
    if (active === "html") return [htmlLang()];
    if (active === "css") return [cssLang()];
    return [javascript({ jsx: true })];
  }, [active]);

  if (!roomId) return <Navigate to="/" />;

  return (
    <div className="h-screen grid grid-rows-[auto,1fr,1fr] bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white">
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow">
        <div className="flex gap-2">
          {(["html", "css", "js"] as (keyof Files)[]).map(tab => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all duration-150
                ${active === tab
                  ? "bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                }`}
              onClick={() => setActive(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {clients.map((c, i) => (
              <div
                key={c.socketId}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center border-2 border-neutral-900 text-xs font-bold shadow"
                title={c.username}
                style={{ zIndex: clients.length - i }}
              >
                {c.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            ))}
          </div>
          <div className="text-xs opacity-80 text-right">
            <div>Room: <span className="font-mono">{roomId}</span></div>
            <div>Users: {clients.length}</div>
          </div>
        </div>
      </div>

      {/* editor */}
      <div className="border-b border-neutral-800 overflow-hidden bg-neutral-900/80">
        <CodeMirror
          value={files[active]}
          onChange={(val) => updateFiles({ ...files, [active]: val })}
          theme={oneDark}
          height="100%"
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
            autocompletion: true,
          }}
        />
      </div>

      {/* live preview */}
      <div className="overflow-hidden bg-neutral-950/90 border-t border-neutral-800">
        <iframe
          title="preview"
          sandbox="allow-scripts"
          style={{
            width: "100%",
            height: "100%",
            background: "#1a1a1a",
            border: "0",
            borderRadius: "0 0 1rem 1rem",
          }}
          srcDoc={`<!doctype html>
<html>
  <head>
    <style>${files.css}</style>
  </head>
  <body>
    ${files.html}
    <script>
      try { ${files.js} } catch(e){ console.error(e) }
    </script>
  </body>
</html>
          `}
        />
      </div>
    </div>
  );
}