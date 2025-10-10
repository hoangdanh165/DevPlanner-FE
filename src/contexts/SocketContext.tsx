import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST as string;

export interface OnlineUser {
  userId: string;
  [key: string]: any;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!auth?.userId) return;

    const newSocket = io(NODE_JS_HOST, {
      query: {
        userId: auth.userId,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [auth?.userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
