import type { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface PrivateRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.role) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  if (auth?.status !== 1) {
    return <Navigate to="/banned" state={{ from: location }} replace />;
  }

  if (allowedRoles.includes(auth.role)) {
    return <>{children}</>;
  }

  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default PrivateRoute;
