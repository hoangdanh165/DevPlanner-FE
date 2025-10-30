import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import Cookies from "js-cookie";

interface PersistSigninProps {
  children: ReactNode;
}

const PersistSignin: React.FC<PersistSigninProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);

        const alertShown = Cookies.get("alertShown");
        if (alertShown == "false") {
          alert("Your session has expired. Please log in again!");
          // `Cookies.set()` type-safe vì @types/js-cookie đã định nghĩa:
          // (name: string, value: string, options?: CookieAttributes) => void
          Cookies.set("alertShown", "true", { path: "/", expires: 1 });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!auth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth, persist, refresh]);

  useEffect(() => {
    if (auth?.accessToken) {
      Cookies.remove("alertShown");
    }
  }, [auth]);

  if (!persist) {
    return <>{children}</>;
  }

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <>{children}</>
  );
};

export default PersistSignin;
