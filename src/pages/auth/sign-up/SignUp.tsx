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
  Divider,
} from "@mui/material";
import {
  Email,
  Lock,
  ArrowForward,
  Visibility,
  VisibilityOff,
  Home,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import GithubButton from "@/components/auth/GithubButton";
import { useToast } from "@/contexts/ToastProvider";
import { MuiTelInput } from "mui-tel-input";
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

const SIGN_UP_ENDPOINT = "/api/v1/users/sign-up/";

export default function SignUp() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [phone, setPhone] = useState("");
  const handlePhoneChange = (newValue: string) => {
    setPhone(newValue);
  };

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    invalidEmailFormat: false,
    passwordNotLongEnough: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const newErrors = {
      invalidEmailFormat: !/\S+@\S+\.\S+/.test(formData.email),
      passwordNotLongEnough: formData.password.length < 8,
      passwordMismatch: formData.password !== formData.confirmPassword,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("name") || "").trim(),
      phone,
      address: String(form.get("address") || "").trim(),
      email: String(form.get("email") || "").trim(),
      password: form.get("password"),
    };

    try {
      const response = await axios.post(SIGN_UP_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });

      showToast(
        response.data.message ||
          "Sign up successfully, please check your email",
        "success"
      );
      handleCleanForm();
      navigate(paths.sign_in);
    } catch (error: any) {
      let message = "Sign up failed!";

      if (!error?.response) {
        message = "No response from server!";
      } else {
        const backendError = error.response.data?.error;
        const status = backendError?.code ?? error.response.status;

        if (backendError?.message) {
          message = backendError.message;
        }

        const details = backendError?.details?.data;
        if (details && typeof details === "object") {
          if (
            details.email &&
            Array.isArray(details.email) &&
            details.email.length
          ) {
            message = details.email[0];
          } else {
            const firstKey = Object.keys(details)[0];
            const firstValue = details[firstKey];
            if (Array.isArray(firstValue) && firstValue.length) {
              message = String(firstValue[0]);
            }
          }
        }

        if (status === 400 && details?.email) {
          message = Array.isArray(details.email)
            ? details.email[0]
            : String(details.email);
        }

        message = message.charAt(0).toUpperCase() + message.slice(1);
      }

      showToast(message, "error");
    }
  };

  const handleCleanForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({
      passwordMismatch: false,
      invalidEmailFormat: false,
      passwordNotLongEnough: false,
    });
    setPhone("");
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
            py: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            {/* Sign Up Card */}
            <Card
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 40px rgba(147, 51, 234, 0.1)",
              }}
            >
              <CardContent sx={{ p: 5 }}>
                {/* DevPlanner Logo */}
                <form onSubmit={handleSignUp}>
                  <Box>
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
                        Get Started
                      </Typography>

                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "1.1rem",
                          mb: 3,
                        }}
                      >
                        Create your account to start planning
                      </Typography>
                    </Box>
                    {/* Full Name Input */}
                    <TextField
                      fullWidth
                      label="Full Name"
                      type="text"
                      variant="outlined"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "primary.main", mr: 1 }} />
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
                      }}
                    />

                    <MuiTelInput
                      fullWidth
                      name="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
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
                      }}
                    />

                    {/* Email Input */}
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                      }}
                    />

                    {/* Password Input */}
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      helperText={
                        errors.passwordNotLongEnough
                          ? "Password must have at least 8 characters."
                          : ""
                      }
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
                              sx={{
                                minWidth: 0,
                                p: 0.5,
                                color: "primary.main",
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </Button>
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
                      }}
                    />

                    {/* Confirm Password Input */}
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      helperText={
                        errors.passwordMismatch ? "Passwords do not match." : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "primary.main", mr: 1 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              sx={{
                                minWidth: 0,
                                p: 0.5,
                                color: "primary.main",
                              }}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </Button>
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
                      }}
                    />

                    {/* Sign Up Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      type="submit"
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
                      Create Account
                    </Button>
                  </Box>
                </form>
                {/* Sign In Link */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography
                    sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}
                  >
                    Already have an account?
                  </Typography>
                  <Button
                    onClick={() => navigate(paths.sign_in)}
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
                    Sign in here
                  </Button>
                  <Divider sx={{ my: 1.5 }}>or</Divider>
                  <GithubButton buttonText="Sign up with Github" />
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
        </Container>
      </Box>
    </ThemeProvider>
  );
}
