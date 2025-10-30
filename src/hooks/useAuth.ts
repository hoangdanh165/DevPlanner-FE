import { useContext, useDebugValue } from "react";
import AuthContext from "@/contexts/AuthProvider";
import type { AuthData } from "@/types/all_types";

export interface AuthContextType {
  auth: AuthData | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthData | null>>;
  persist?: boolean;
  setPersist?: React.Dispatch<React.SetStateAction<boolean>>;
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext) as AuthContextType;

  useDebugValue(context.auth, (auth) =>
    auth?.email ? "Logged In" : "Logged Out"
  );

  return context;
};

export default useAuth;
