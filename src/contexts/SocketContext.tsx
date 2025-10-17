import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "../libs/socket";
import type { SocketContextValue } from "@/types/all_types";

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const joined = useRef<Set<string>>(new Set());

  useEffect(() => {
    const s = getSocket();
    socketRef.current = s;
    const onConnect = () => {
      joined.current.forEach((id) => s.emit("join", { projectId: id }));
    };
    s.on("connect", onConnect);
    s.connect();

    return () => {
      s.off("connect", onConnect);
      joined.current.forEach((id) => s.emit("leave", { projectId: id }));
      joined.current.clear();
      if (import.meta.env.PROD || false) s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const value = useMemo<SocketContextValue>(
    () => ({
      socket: socketRef.current,
      joinRoom: (projectId: string) => {
        const s = socketRef.current;
        if (!s) return;
        if (joined.current.has(projectId)) return;
        s.emit("join", { projectId });
        joined.current.add(projectId);
      },
      leaveRoom: (projectId: string) => {
        const s = socketRef.current;
        if (!s) return;
        if (!joined.current.has(projectId)) return;
        s.emit("leave", { projectId });
        joined.current.delete(projectId);
      },
      onProgress: (handler) => {
        const s = socketRef.current;
        if (!s) return () => {};
        s.on("progress", handler);
        return () => s.off("progress", handler);
      },
    }),
    []
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export function useSocketCtx(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocketCtx must be used within <SocketProvider>");
  return ctx;
}
