import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/services/axios";
import useAuth, { type AuthData } from "@/hooks/useAuth";
import paths from "@/routes/paths";

const SIGN_IN_WITH_GITHUB_API = import.meta.env
  .VITE_SIGN_IN_WITH_GITHUB_API as string;

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
        const { data } = await axios.post<AuthData>(SIGN_IN_WITH_GITHUB_API, {
          code,
        });

        setAuth(data);
        localStorage.setItem("isSignedIn", "true");

        navigate(paths.main);
      } catch (err: any) {
        console.error("GitHub login failed:", err);
        navigate(paths.sign_in);
      }
    };

    fetchGithubToken();
  }, [navigate, setAuth]);

  return <p style={{ color: "white" }}>Signing in with GitHub...</p>;
}
