"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Email,
  Lock,
  ArrowForward,
  Visibility,
  VisibilityOff,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import type { AuthData } from "@/types/all_types";
import { useToast } from "@/contexts/ToastProvider";
import useAuth from "@/hooks/useAuth";
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

const SIGN_IN_ENDPOINT = "/api/v1/users/sign-in/";

export default function SignInPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    invalidEmailFormat: false,
    passwordMissing: false,
  });
  const { setAuth, persist } = useAuth();

  const validateInputs = () => {
    const newErrors = {
      invalidEmailFormat: !/\S+@\S+\.\S+/.test(formData.email),
      passwordMissing: !formData.password,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ invalidEmailFormat: false, passwordMissing: false });

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(e.currentTarget);
    let email, password;
    email = data.get("email");
    password = data.get("password");

    try {
      setLoading(true);
      const { data } = await axios.post<AuthData>(
        SIGN_IN_ENDPOINT,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuth(data);
      localStorage.setItem("isSignedIn", "true");

      navigate(paths.main);
    } catch (error: any) {
      const status = error?.response?.status;
      let message = "Sign in failed!";

      if (!error?.response) {
        message = "No response from server!";
      }

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
            bottom: "10%",
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
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSignIn}>
            <Box sx={{ width: "100%" }}>
              <Card
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 40px rgba(147, 51, 234, 0.1)",
                }}
              >
                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(147, 51, 234, 0.15)",
                        border: "1px solid rgba(147, 51, 234, 0.3)",
                        mb: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 900,
                          background:
                            "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        DevPlanner
                      </Typography>
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        mb: 2,
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Welcome Back
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "1.1rem",
                        mb: 3,
                      }}
                    >
                      Sign in to your account to continue
                    </Typography>
                  </Box>
                  {/* Email Input */}
                  <TextField
                    fullWidth
                    label="Email"
                    type="text"
                    name="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    helperText={
                      errors.invalidEmailFormat ? "Invalid email format." : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "primary.main", mr: 1 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        color: "text.primary",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(147, 51, 234, 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.1)",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      },
                    }}
                  />

                  {/* Password Input */}
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    helperText={errors.password ? "Invalid email format." : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "primary.main", mr: 1 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ minWidth: 0, p: 0.5, color: "primary.main" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        color: "text.primary",
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(147, 51, 234, 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.1)",
                        },
                      },
                    }}
                  />

                  {/* Remember Me & Forgot Password */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: "rgba(255, 255, 255, 0.4)",
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          }}
                        />
                      }
                      label="Remember me"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.95rem",
                        },
                      }}
                    />
                    <Button
                      onClick={() => navigate(paths.forgot_password)}
                      sx={{
                        color: "primary.main",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "rgba(147, 51, 234, 0.1)",
                        },
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  {/* Sign In Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    type="submit"
                    disabled={loading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                      color: "white",
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                      boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)",
                      mb: 2,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 50px rgba(147, 51, 234, 0.5)",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    Sign In
                  </Button>

                  {/* Sign Up Link */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}
                    >
                      Don't have an account?
                    </Typography>
                    <Button
                      onClick={() => navigate(paths.sign_up)}
                      sx={{
                        color: "primary.main",
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "rgba(147, 51, 234, 0.1)",
                        },
                      }}
                    >
                      Create one here
                    </Button>
                  </Box>

                  {/* Divider */}
                  <Box
                    sx={{
                      height: "1px",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      my: 3,
                    }}
                  />

                  {/* Back to Home */}
                  <Button
                    fullWidth
                    startIcon={<Home />}
                    onClick={() => navigate(paths.landing_page)}
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </form>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
