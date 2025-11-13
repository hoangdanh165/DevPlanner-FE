import { Button } from "@mui/material";
import { GithubIcon } from "./CustomIcons";

const AUTH_URL = import.meta.env.VITE_GITHUB_AUTH_URL as string;

interface GithubButtonProps {
  buttonText?: string;
}

const GithubButton: React.FC<GithubButtonProps> = ({
  buttonText = "Sign in with GitHub",
}) => {
  const handleGithubLogin = () => {
    window.location.href = AUTH_URL;
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleGithubLogin}
      startIcon={<GithubIcon />}
      sx={{ fontWeight: "bold" }}
    >
      {buttonText}
    </Button>
  );
};

export default GithubButton;
