import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/services/axios";
import { type AuthData } from "@/types/all_types";

import paths from "@/routes/paths";
import useAuth from "@/hooks/useAuth";
import CallbackPage from "@/pages/auth/github/CallbackPage";

const SIGN_IN_WITH_GITHUB_ENDPOINT =
  (import.meta.env.VITE_SIGN_IN_WITH_GITHUB_ENDPOINT as string) ||
  "http://localhost:8000/api/v1/users/sign-in-with-github/";

export default function GithubCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const fetchGithubToken = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        console.error("Missing code in callback URL");
        navigate(paths.sign_in);
        return;
      }

      try {
        const { data } = await axios.post<AuthData>(
          SIGN_IN_WITH_GITHUB_ENDPOINT,
          {
            code,
          }
        );

        setAuth(data);
        localStorage.setItem("isSignedIn", "true");

        navigate(paths.main);
      } catch (err: any) {
        console.error("GitHub login failed:", err);
        // navigate(paths.sign_in);
      }
    };

    fetchGithubToken();
  }, [navigate, setAuth]);

  return <CallbackPage />;
}
