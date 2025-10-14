import type React from "react";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";
import paths from "@/routes/paths";
import axios from "@/services/axios";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastProvider";

const SIGN_IN_API = "/api/v1/users/sign-in/";

function SignIn() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    invalidEmailFormat: false,
  });
  const { setAuth, persist } = useAuth();

  const validateInputs = () => {
    const newErrors = {
      invalidEmailFormat: !/\S+@\S+\.\S+/.test(formData.email),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }
    setLoading(true);
    const data = new FormData(e.currentTarget);
    let email, password;
    email = data.get("email");
    password = data.get("password");

    try {
      const response = await axios.post(
        SIGN_IN_API,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("isSignedIn", "true");
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      const status = response?.data?.status;
      const avatar = response?.data?.avatar;
      const fullName = response?.data?.fullName;
      const address = response?.data?.address;
      const phone = response?.data?.phone;
      const userId = response?.data?.userId;

      setAuth({
        userId,
        email,
        role,
        status,
        accessToken,
        avatar,
        fullName,
        address,
        phone,
      });

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: "text.primary",
            }}
          >
            DevPlanner
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Sign in to your account
          </Typography>
        </Box>

        <form onSubmit={handleSignIn}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 0.75, fontWeight: 500, color: "text.primary" }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                helperText={
                  errors.invalidEmailFormat ? "Invalid email format." : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "text.secondary",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 0.75, fontWeight: 500, color: "text.primary" }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "text.secondary",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                href={paths.forgot_password}
                underline="hover"
                sx={{
                  fontSize: "0.875rem",
                  color: "primary.main",
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.25,
                textTransform: "none",
                fontSize: "0.9375rem",
                fontWeight: 500,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Sign in
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link
              href={paths.sign_up}
              underline="hover"
              sx={{
                color: "primary.main",
                fontWeight: 500,
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignIn;
