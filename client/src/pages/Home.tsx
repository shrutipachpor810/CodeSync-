import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { googleLogin, googleLogout } from "../auth"; // optional

export default function Home() {
  const nav = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  function createRoom() {
    const id = Math.random().toString(36).slice(2, 8);
    setRoomId(id);
  }

  function join() {
    if (!roomId || !username) return alert("Room ID & Username required");
    nav(`/room/${roomId}`, { state: { username } });
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden font-mono">
      {/* Matrix-style background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-green-900/5"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Floating code symbols */}
      <div className="absolute top-20 left-20 text-green-500/20 text-2xl animate-pulse delay-100">{`{}`}</div>
      <div className="absolute top-40 right-32 text-green-400/30 text-xl animate-pulse delay-300">{`</>`}</div>
      <div className="absolute bottom-32 left-32 text-green-300/20 text-lg animate-pulse delay-500">{`()`}</div>
      <div className="absolute bottom-40 right-20 text-green-400/25 text-2xl animate-pulse delay-700">{`[]`}</div>
      <div className="absolute top-1/3 right-1/4 text-green-500/15 text-sm animate-pulse delay-900">const</div>
      <div className="absolute bottom-1/3 left-1/4 text-green-400/20 text-sm animate-pulse delay-1100">function</div>

      {/* Terminal-style scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          {/* Terminal window */}
          <div className="relative group">
            {/* Terminal glow */}
            <div className="absolute -inset-1 bg-green-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
            
            {/* Terminal window */}
            <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-6 py-4 bg-gray-800/80 border-b border-green-500/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-green-400 text-sm font-bold">~/codesync-terminal</span>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                {/* ASCII Art Logo */}
                <div className="text-center space-y-4">
                  <div className="text-green-400 text-lg font-bold leading-tight">
                    <div className="animate-pulse delay-100">╔═══════════════════════╗</div>
                    <div className="animate-pulse delay-200">║    &lt;/&gt; CodeSync &lt;/&gt;    ║</div>
                    <div className="animate-pulse delay-300">╚═══════════════════════╝</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black text-green-400 tracking-wider">
                      <span className="animate-pulse delay-400">./codesync</span>
                    </h1>
                    <p className="text-green-300/80 text-lg">
                      <span className="text-green-500">&gt;</span> Real-time collaborative Editor
                    </p>
                  </div>
                </div>

                {/* Terminal-style inputs */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-green-400 text-sm font-bold">
                      <span className="text-green-500">$</span> room_id:
                    </label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 font-bold">&gt;</span>
                      <input
                        placeholder="enter_room_id"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-black/50 border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-green-600/60 text-green-300 text-lg font-mono caret-green-400"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-5 bg-green-400 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-green-400 text-sm font-bold">
                      <span className="text-green-500">$</span> username:
                    </label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 font-bold">&gt;</span>
                      <input
                        placeholder="enter_username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-black/50 border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-green-600/60 text-green-300 text-lg font-mono caret-green-400"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-5 bg-green-400 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Terminal-style buttons */}
                <div className="space-y-4">
                  <button
                    onClick={join}
                    disabled={!roomId || !username}
                    className="w-full relative group/btn p-5 bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 border border-green-500/50 hover:border-green-400 disabled:border-gray-600/50 text-green-400 disabled:text-gray-500 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:cursor-not-allowed text-lg"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-green-500">$</span> 
                      ./join --room={roomId || "ROOM_ID"} --user={username || "USERNAME"}
                      <span className="animate-pulse">|</span>
                    </span>
                  </button>
                  
                  <button
                    onClick={createRoom}
                    className="w-full relative group/btn p-4 border-2 border-green-500/30 hover:border-green-400/60 hover:bg-green-500/10 text-green-400 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-green-500">$</span>
                      ./create-room --generate-id
                      <span className="animate-pulse">|</span>
                    </span>
                  </button>
                </div>

                {/* System status */}
                <div className="flex items-center justify-between pt-6 border-t border-green-500/20 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-500">ONLINE</span>
                  </div>
                  
                  <div className="text-green-600/70">
                    v2.1.4-stable
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-green-600/70">sync:</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* optional auth buttons */}
          {/* <div className="mt-6 space-y-3">
            <button onClick={async () => {
              const u = await googleLogin();
              setUsername(u.displayName);
            }} className="w-full p-4 border border-green-500/30 hover:border-green-400/50 hover:bg-green-500/10 rounded-xl transition-all duration-300 font-mono text-green-400">
              $ auth --provider=google
            </button>
            <button onClick={googleLogout} className="w-full p-4 border border-green-500/30 hover:border-green-400/50 hover:bg-green-500/10 rounded-xl transition-all duration-300 font-mono text-green-400">
              $ logout --clear-session
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}