import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const URL = import.meta.env.VITE_WS_URL || "http://localhost:8001";
  const PATH = import.meta.env.VITE_WS_PATH || "/socket.io";

  socket = io(URL, {
    path: PATH,
    transports: ["websocket"],
    autoConnect: false, // chủ động connect khi provider mount
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
  });
  return socket;
}
