import axios from "@/services/axios";
import { Button } from "@mui/material";
import { GithubIcon } from "./CustomIcons";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// 🔹 Endpoint (backend API)
const SIGN_IN_WITH_GITHUB_API = import.meta.env
  .VITE_SIGN_IN_WITH_GITHUB_API as string;

// ==========================
// 🔹 Types
// ==========================
interface GithubButtonProps {
  buttonText?: string;
  setErrMsg: (msg: string) => void;
  setSnackbarOpen: (open: boolean) => void;
}

interface SignInResponse {
  accessToken: string;
  role: string;
  status: number;
  avatar: string;
  fullName: string;
  userId: string;
  email?: string;
}

const GithubButton: React.FC<GithubButtonProps> = ({
  buttonText = "Sign in with GitHub",
  setErrMsg,
  setSnackbarOpen,
}) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    try {
      // 🔹 Step 1: Redirect user to GitHub OAuth authorization page
      window.location.href = import.meta.env.VITE_GITHUB_AUTH_URL as string;
    } catch (error) {
      console.error(error);
      setErrMsg(`${buttonText} failed!`);
      setSnackbarOpen(true);
    }
  };

  // 🔹 Step 2 (server callback handler)
  // Khi GitHub redirect về với code, backend của bạn sẽ xử lý đổi code → accessToken,
  // sau đó frontend chỉ cần gọi endpoint SIGN_IN_WITH_GITHUB_API
  // (giống như Google flow sau khi user cho phép).
  //
  // Ví dụ:
  // const res = await axios.post<SignInResponse>(SIGN_IN_WITH_GITHUB_API, {
  //   code,  // lấy từ query param callback
  // });

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
