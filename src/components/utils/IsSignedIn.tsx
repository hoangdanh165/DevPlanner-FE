import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface IsSignedInProps {
  children: ReactNode;
}

const IsSignedIn: React.FC<IsSignedInProps> = ({ children }) => {
  const isSignedIn = localStorage.getItem("isSignedIn") === "true";

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default IsSignedIn;
