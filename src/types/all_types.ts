import type { Socket } from "socket.io-client";

// ==== Step Types ====
export type DiagramStep = "gantt" | "er" | "architecture" | "sequence";
export type DiagramItem = { type: DiagramStep; code: string };

export type AIGenerationStep =
  | "overview"
  | "features"
  | "techstack"
  | "tasks"
  | `diagrams_${DiagramStep}`
  | "docs";

// ==== Event Types ====
export type ProgressEvent =
  | "pipeline_started"
  | "pipeline_complete"
  | "pipeline_progress"
  | "pipeline_failed"
  | `${AIGenerationStep}_start`
  | `${AIGenerationStep}_end`
  | "stream_chunk";

// ==== Sections ====
export interface Sections {
  overview: string;
  features: string;
  techstack: string;
  tasks: string;
  docs: string;
  diagrams: DiagramItem[];
}

// ==== Data Payload ====
export interface ProgressData<T extends AIGenerationStep = AIGenerationStep> {
  step: T;
  text: string;
  [key: string]: unknown;
}

// ==== Message Payload ====
export interface ProgressPayload<
  T extends AIGenerationStep = AIGenerationStep
> {
  v: number;
  project_id: string;
  event: ProgressEvent;
  data: ProgressData<T>;
  ts: number;
}

// ==== Socket Context ====
export interface SocketContextValue {
  socket: Socket | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  onProgress: (handler: (payload: ProgressPayload) => void) => () => void;
}
