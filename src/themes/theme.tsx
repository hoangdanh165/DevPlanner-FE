import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ThemeOptions } from "@mui/material/styles";

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
    text: {
      primary: "#222",
      secondary: "#555",
    },
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
};

interface ThemeContextType {
  theme: typeof lightTheme;
  toggleTheme: () => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = (): boolean => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("themeMode");
      if (stored === "dark") return false;
      if (stored === "light") return true;
    }
    return true;
  };

  const [isLight, setIsLight] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("themeMode", isLight ? "light" : "dark");
  }, [isLight]);

  const theme = isLight ? lightTheme : darkTheme;
  const toggleTheme = () => setIsLight((prev) => !prev);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
};
