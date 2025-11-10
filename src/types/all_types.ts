import type { Socket } from "socket.io-client";

/** ========================
 *  Section keys (UI-level)
 *  ======================== */
// export const SECTIONS = [
//   "overview",
//   "features",
//   "techstack",
//   "tasks",
//   "docs",
//   "diagrams",
// ] as const;

// export type SectionKey = (typeof SECTIONS)[number];

export const SECTIONS = [
  "overview",
  "features",
  "techstack",
  "tasks",
  "docs",
  "diagrams",
] as const;

export const DIAGRAM_VARIANTS = [
  "er",
  "sequence",
  "context",
  "deployment",
] as const;
// tuỳ bạn muốn: er/sequence/flowchart/whatever

export type BaseSectionKey = (typeof SECTIONS)[number];
export type DiagramVariant = (typeof DIAGRAM_VARIANTS)[number];

export type DiagramSectionKey = `diagrams_${DiagramVariant}`;

// Key mà engine generate dùng:
export type SectionKey =
  | Exclude<BaseSectionKey, "diagrams"> // các section thường
  | DiagramSectionKey; // các diagrams_* cụ thể

export interface PlanSections {
  overview?: string;
  features?: string;
  techstack?: string;
  tasks?: string;
  diagrams?: string;
  docs?: string;
}
export interface ProjectPlan {
  id: string;
  name: string;
  sections: PlanSections;
  updatedAt: string; // ISO string
}
export interface PlanViewerProps {
  plan: ProjectPlan;
  activeTab: number;
  onTabChange: (index: number) => void;
  onRegenerate?: (key: SectionKey) => void;
  readOnly?: boolean; // flag UI
}
/** ========================
 *  Diagram sub-steps
 *  ======================== */
export type DiagramStep = "gantt" | "er" | "architecture" | "sequence";
export type DiagramItem = { type: DiagramStep; code: string };

/** =========================================
 *  AI Generation Step = SectionKey OR a diagram step token
 *  ========================================= */
export type DiagramStepToken = `diagrams_${DiagramStep}`;
export type AIGenerationStep = SectionKey | DiagramStepToken;

/** =========
 *  Sections
 *  ========= */
export interface Sections {
  overview: string;
  features: string;
  techstack: string;
  tasks: string;
  docs: string;
  diagrams: DiagramItem[];
}

/** =================
 *  Progress events
 *  ================= */
type ProgressEventBase =
  | "pipeline_started"
  | "pipeline_complete"
  | "pipeline_progress"
  | "pipeline_failed"
  | "stream_chunk";

// start/end events are tied to each AIGenerationStep
export type ProgressEvent =
  | ProgressEventBase
  | `${AIGenerationStep}_${"start" | "end"}`;

/** =================
 *  Payload shapes
 *  ================= */
export interface ProgressData<T extends AIGenerationStep = AIGenerationStep> {
  step: T;
  text: string;
  [key: string]: unknown;
}

export interface ProgressPayload<
  T extends AIGenerationStep = AIGenerationStep
> {
  v: number;
  project_id: string;
  event: ProgressEvent;
  data: ProgressData<T>;
  ts: number;
}

/** ======================
 *  Socket context
 *  ====================== */
export interface SocketContextValue {
  socket: Socket | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  onProgress: (handler: (payload: ProgressPayload) => void) => () => void;
}

/** ======================
 *  Auth
 *  ====================== */
export interface AuthData {
  role: string;
  accessToken: string;
  avatar: string | null;
  status: number;
  fullName: string | null;
  email: string;
  address?: string;
  phone: string | null;
  userId: string;
}
