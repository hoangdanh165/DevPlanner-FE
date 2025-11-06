import type React from "react";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Mail, ArrowBack, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { useToast } from "@/contexts/ToastProvider";
import axios from "@/services/axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9333ea",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#0a0a0a",
      paper: "#141414",
    },
    text: {
      primary: "#fafafa",
      secondary: "#a6a6a6",
    },
    divider: "#262626",
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  shape: {
    borderRadius: 16,
  },
});

const FORGOT_PASSWORD_ENDPOINT = "api/v1/users/forgot-password/";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const emailRegex =
    /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const validateEmail = (email: string) => emailRegex.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = email.trim();

    if (!value || !validateEmail(value)) {
      showToast(
        "Please enter a valid email to receive the password reset link",
        "error"
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        FORGOT_PASSWORD_ENDPOINT,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Animated Gradient Orbs */}
        <Box
          sx={{
            position: "fixed",
            top: "10%",
            left: `${20 + mousePosition.x * 0.02}%`,
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            transition: "all 0.3s ease-out",
            animation: "float 8s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-30px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "fixed",
            bottom: "20%",
            right: `${10 + mousePosition.x * 0.015}%`,
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            transition: "all 0.3s ease-out",
            animation: "float 10s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />

        {/* Grid Pattern Overlay */}
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="sm"
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {!isSubmitted ? (
              <>
                {/* Mail Icon */}
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(147, 51, 234, 0.15)",
                    border: "1px solid rgba(147, 51, 234, 0.3)",
                    mb: 4,
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: "0 0 0 0 rgba(147, 51, 234, 0.4)",
                      },
                      "50%": { boxShadow: "0 0 0 12px rgba(147, 51, 234, 0)" },
                    },
                  }}
                >
                  <Mail sx={{ fontSize: 48, color: "primary.main" }} />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.8rem" },
                    fontWeight: 900,
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  Reset Your Password
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    color: "rgba(255, 255, 255, 0.7)",
                    mb: 6,
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Typography>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // required
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        color: "text.primary",
                        fontSize: "1.1rem",
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                        "&.Mui-focused": {
                          bgcolor: "rgba(147, 51, 234, 0.08)",
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
                        },
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                      color: "white",
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 50px rgba(147, 51, 234, 0.5)",
                      },
                      "&:disabled": {
                        background:
                          "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                        opacity: 0.6,
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Box>

                {/* Back to sign in */}
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(paths.sign_in)}
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      color: "white",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Back to sign in
                </Button>
              </>
            ) : (
              <>
                {/* Success State */}
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    mb: 4,
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      },
                      "50%": { boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
                    },
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: "#22c55e" }} />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.8rem" },
                    fontWeight: 900,
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  Check Your Email
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    color: "rgba(255, 255, 255, 0.7)",
                    mb: 3,
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  We've sent a password reset link to <strong>{email}</strong>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1rem",
                    color: "rgba(255, 255, 255, 0.5)",
                    mb: 6,
                    lineHeight: 1.6,
                  }}
                >
                  Click the link in the email to reset your password. If you
                  don't see the email, check your spam folder.
                </Typography>

                {/* Back to sign in */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(paths.sign_in)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                    color: "white",
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 15px 50px rgba(147, 51, 234, 0.5)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Back to sign in
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
