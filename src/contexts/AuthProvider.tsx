import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

type AuthType = Record<string, unknown> | null;

interface AuthContextType {
  auth: AuthType;
  setAuth: (value: AuthType) => void;
  persist: boolean;
  setPersist: (value: boolean) => void;
}

const defaultContext: AuthContextType = {
  auth: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuth: () => {},
  persist: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPersist: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

interface Props {
  children: ReactNode;
}

function safeParseBoolean(value: string | null, fallback = true): boolean {
  if (value === null) return fallback;
  try {
    // handle stored booleans or JSON-encoded values
    const parsed = JSON.parse(value);
    return typeof parsed === "boolean" ? parsed : Boolean(parsed);
  } catch {
    return value === "true";
  }
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>(null);
  const [persist, setPersist] = useState<boolean>(() =>
    safeParseBoolean(localStorage.getItem("persist"), true)
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
