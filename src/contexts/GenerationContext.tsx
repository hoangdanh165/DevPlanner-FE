import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { SectionKey } from "@/types/all_types";

type GenerationState = {
  global: boolean;
  bySection: Partial<Record<SectionKey, boolean>>;
};

type GenerationContextType = {
  state: GenerationState;
  setGlobalGenerating: (value: boolean) => void;
  setSectionGenerating: (section: SectionKey, value: boolean) => void;
  resetAll: () => void;
};

const GenerationContext = createContext<GenerationContextType | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GenerationState>({
    global: false,
    bySection: {},
  });

  const setGlobalGenerating = (value: boolean) =>
    setState((prev) => ({ ...prev, global: value }));

  const setSectionGenerating = (section: SectionKey, value: boolean) =>
    setState((prev) => ({
      ...prev,
      bySection: { ...prev.bySection, [section]: value },
    }));

  const resetAll = () => setState({ global: false, bySection: {} });

  return (
    <GenerationContext.Provider
      value={{ state, setGlobalGenerating, setSectionGenerating, resetAll }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const ctx = useContext(GenerationContext);
  if (!ctx) {
    throw new Error("useGeneration must be used within GenerationProvider");
  }
  return ctx;
}
