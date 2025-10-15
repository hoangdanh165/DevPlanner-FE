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
import { MuiTelInput } from "mui-tel-input";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import paths from "@/routes/paths";
import { useThemeContext } from "@/themes/theme";
import { useNavigate } from "react-router-dom";
import axios from "@/services/axios";
import { useToast } from "@/contexts/ToastProvider";

const SIGN_UP_ENDPOINT = "/api/v1/users/sign-up/";

function SignUp() {
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  const { toggleTheme, isLight } = useThemeContext();

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

      showToast(response.data.message || "Sign up successful!", "success");
      handleCleanForm();
      navigate(paths.sign_in);
    } catch (error: any) {
      const status = error?.response?.status;
      let message = "Sign up failed!";

      if (!error?.response) {
        message = "No response from server!";
      } else if (status === 400) {
        message = "User with this email already exists!";
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
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 0.75, fontWeight: 500, color: "text.primary" }}
              >
                Full Name
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="name"
                placeholder="How can we call you?"
                value={formData.name}
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
                Phone
              </Typography>
              <MuiTelInput
                fullWidth
                name="phone"
                placeholder="A way to recover your password"
                value={phone}
                onChange={handlePhoneChange}
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
                helperText={
                  errors.invalidEmailFormat ? "Invalid email format." : ""
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
                placeholder="Make it secret!"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                helperText={
                  errors.passwordNotLongEnough
                    ? "Password must have at least 8 characters."
                    : ""
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
                placeholder="Make sure it matches!"
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

            <GithubButton buttonText="Sign up with GitHub" />
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
