import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { SectionKey } from "@/types/all_types";

type GenerationState = {
  global: boolean;
  bySection: Partial<Record<SectionKey, boolean>>;
  currentVersion: number;
  availableVersions: number[];
};

type GenerationContextType = {
  state: GenerationState;
  setGlobalGenerating: (value: boolean) => void;
  setCurrentVersion: (value: number) => void;
  setAvailableVersions: (values: number[]) => void;
  appendAvailableVersion: (value: number) => void;
  setSectionGenerating: (section: SectionKey, value: boolean) => void;
  resetAll: () => void;
};

const GenerationContext = createContext<GenerationContextType | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GenerationState>({
    global: false,
    bySection: {},
    currentVersion: 0,
    availableVersions: [],
  });

  const setGlobalGenerating = (value: boolean) =>
    setState((prev) => ({ ...prev, global: value }));

  const setCurrentVersion = (value: number) =>
    setState((prev) => ({ ...prev, currentVersion: value }));

  const setAvailableVersions = (values: number[]) =>
    setState((prev) => ({ ...prev, availableVersions: values }));

  const appendAvailableVersion = (value: number) =>
    setState((prev) => {
      if (prev.availableVersions.includes(value)) return prev;
      return {
        ...prev,
        availableVersions: [...prev.availableVersions, value],
      };
    });

  const setSectionGenerating = (section: SectionKey, value: boolean) =>
    setState((prev) => ({
      ...prev,
      bySection: { ...prev.bySection, [section]: value },
    }));

  const resetAll = () =>
    setState({
      global: false,
      bySection: {},
      currentVersion: 0,
      availableVersions: [],
    });

  return (
    <GenerationContext.Provider
      value={{
        state,
        setGlobalGenerating,
        setSectionGenerating,
        setCurrentVersion,
        setAvailableVersions,
        appendAvailableVersion,
        resetAll,
      }}
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
