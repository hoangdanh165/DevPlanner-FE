import { useContext, useDebugValue } from "react";
import AuthContext from "@/contexts/AuthProvider";

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
