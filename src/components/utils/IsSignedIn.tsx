import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import paths from "@/routes/paths";

interface IsSignedInProps {
  children: ReactNode;
}

const IsSignedIn: React.FC<IsSignedInProps> = ({ children }) => {
  const isSignedIn = localStorage.getItem("isSignedIn") === "true";

  if (isSignedIn) {
    return <Navigate to={paths.main} replace />;
  }

  return <>{children}</>;
};

export default IsSignedIn;
