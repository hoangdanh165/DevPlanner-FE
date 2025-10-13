import type React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import paths from "@/routes/paths";
import { useThemeContext } from "@/themes/theme";

const SIGN_UP_ENDPOINT = "/api/v1/users/sign-up";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [errors, setErrors] = useState({ passwordMismatch: false });

  const { toggleTheme, isLight } = useThemeContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ passwordMismatch: true });
      return;
    }

    console.log("Sign up with:", formData.email, formData.password);
  };

  const handleCleanForm = () => {
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({ passwordMismatch: false });
    setErrMsg("");
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>

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
        {/* 🔹 Header */}
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
            Create a new account
          </Typography>
        </Box>

        <form onSubmit={handleSignUp}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Email */}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.secondary" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
            </Box>

            {/* Password */}
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
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.secondary" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 0.75, fontWeight: 500, color: "text.primary" }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                helperText={
                  errors.passwordMismatch ? "Passwords do not match." : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.secondary" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
            </Box>

            {/* Nút Sign Up */}
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
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Sign Up
            </Button>

            {/* Separator */}
            <Divider sx={{ my: 1.5 }}>or</Divider>

            {/* Nút social login */}
            <GoogleButton
              buttonText="Sign up with Google"
              setErrMsg={setErrMsg}
              setSnackbarOpen={setSnackbarOpen}
            />

            <GithubButton
              buttonText="Sign up with GitHub"
              setErrMsg={setErrMsg}
              setSnackbarOpen={setSnackbarOpen}
            />
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Already have an account?{" "}
            <Link
              href={paths.sign_in}
              underline="hover"
              sx={{
                color: "primary.main",
                fontWeight: 500,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignUp;
