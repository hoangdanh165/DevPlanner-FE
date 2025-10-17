import type { Socket } from "socket.io-client";

export type ProgressEvent =
  | "pipeline_started"
  | "overview_start"
  | "overview_end"
  | "techstack_start"
  | "techstack_end"
  | "features_start"
  | "features_end"
  | "tasks_start"
  | "tasks_end"
  | "docs_start"
  | "docs_end"
  | "pipeline_complete"
  | "pipeline_progress"
  | "stream_chunk"
  | "pipeline_failed";

export type AIGenerationStep =
  | "overview"
  | "features"
  | "techstack"
  | "tasks"
  | "docs";

export interface ProgressData {
  step: AIGenerationStep;
  text: string;
  [key: string]: any;
}

export type ProgressPayload = {
  v: number;
  project_id: string;
  event: ProgressEvent;
  data: ProgressData;
  ts: number;
};

export type SocketContextValue = {
  socket: Socket | null;
  joinRoom: (uploadId: string) => void;
  leaveRoom: (uploadId: string) => void;
  onProgress: (handler: (p: ProgressPayload) => void) => () => void;
};
