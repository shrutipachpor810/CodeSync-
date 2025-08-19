// client/src/App.tsx
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

function App() {
  const [code, setCode] = useState("");

  useEffect(() => {
    socket = io("http://localhost:4000");

    // Listen for updates from server
    socket.on("code-update", (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit("code-change", newCode); // send to server
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">⚡ Realtime Code Editor</h1>
      <textarea
        value={code}
        onChange={handleChange}
        className="w-3/4 h-3/4 p-4 rounded-lg text-black font-mono"
        placeholder="Start typing code..."
      />
    </div>
  );
}

export default App;
// Note: Make sure to run the server on http://localhost:4000
// and have the socket.io server set up to handle 'code-change' and 'code-update' events.
// You can use the provided server code in the previous response to set up the backend.
// Also, ensure you have the necessary dependencies installed:
// npm install socket.io-client
// and run the client with `npm start` or your preferred method.