import axios from "@/services/axios";
import { Button } from "@mui/material";
import { GithubIcon } from "./CustomIcons";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SIGN_IN_WITH_GITHUB_API = import.meta.env
  .VITE_SIGN_IN_WITH_GITHUB_API as string;

interface GithubButtonProps {
  buttonText?: string;
}

const GithubButton: React.FC<GithubButtonProps> = ({
  buttonText = "Sign in with GitHub",
}) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleGithubLogin = () => {
    const authUrl = import.meta.env.VITE_GITHUB_AUTH_URL as string;
    window.location.href = authUrl;
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleGithubLogin}
      startIcon={<GithubIcon />}
    >
      {buttonText}
    </Button>
  );
};

export default GithubButton;
