import type { Socket } from "socket.io-client";
import type { ProgressPayload } from "@/libs/socket";

export type SocketContextValue = {
  socket: Socket | null;
  joinRoom: (uploadId: string) => void;
  leaveRoom: (uploadId: string) => void;
  onProgress: (handler: (p: ProgressPayload) => void) => () => void;
  // subscribe to arbitrary socket events. Returns an unsubscribe function.
  on: (event: string, handler: (payload: any) => void) => () => void;
};
