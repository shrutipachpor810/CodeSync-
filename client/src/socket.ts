import { io, Socket } from "socket.io-client";

export function initSocket(): Socket {
  return io(import.meta.env.VITE_SERVER_URL as string, {
    transports: ["websocket"],
    timeout: 10000
  });
}
