import { useGoogleLogin } from "@react-oauth/google";
import type { TokenResponse } from "@react-oauth/google";
import axios from "@/services/axios";
import { Button } from "@mui/material";
import { GoogleIcon } from "./CustomIcons";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";

const SIGN_IN_WITH_GOOGLE_API = import.meta.env
  .VITE_SIGN_IN_WITH_GOOGLE_API as string;

interface GoogleButtonProps {
  buttonText?: string;
}

export interface SignInResponse {
  accessToken: string;
  role: string;
  status: number;
  avatar: string;
  fullName: string;
  userId: string;
  email?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  buttonText = "Sign in with Google",
}) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    ux_mode: "redirect",
    onSuccess: async (response: TokenResponse) => {
      try {
        const res = await axios.post<SignInResponse>(SIGN_IN_WITH_GOOGLE_API, {
          token: response.access_token,
        });

        const { accessToken, role, status, avatar, fullName, userId, email } =
          res.data;

        localStorage.setItem("isSignedIn", "true");

        setAuth({
          email,
          role,
          status,
          accessToken,
          avatar,
          fullName,
          userId,
        });

        navigate(paths.main);
      } catch (error) {
        console.error(error);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
    >
      {buttonText}
    </Button>
  );
};

export default GoogleButton;
