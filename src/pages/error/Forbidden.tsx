"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  Grid,
} from "@mui/material";
import { Shield, ArrowForward, Home, Mail } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f59e0b",
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

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const reasons = [
    {
      title: "Permission Denied",
      description:
        "You don't have the required permissions to access this resource.",
      icon: "🔒",
    },
    {
      title: "Upgrade Your Plan",
      description:
        "This feature may be available in a higher tier plan. Check your account settings.",
      icon: "⬆️",
    },
    {
      title: "Contact Support",
      description:
        "If you believe this is an error, our support team is here to help.",
      icon: "📞",
    },
  ];

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
        <Box
          sx={{
            position: "fixed",
            top: "10%",
            left: `${20 + mousePosition.x * 0.02}%`,
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
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
            top: "30%",
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
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    mb: 4,
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.4)",
                      },
                      "50%": { boxShadow: "0 0 0 12px rgba(245, 158, 11, 0)" },
                    },
                  }}
                >
                  <Shield sx={{ fontSize: 48, color: "primary.main" }} />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 900,
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  Access Forbidden
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    color: "rgba(255, 255, 255, 0.7)",
                    mb: 6,
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  You don't have permission to access this resource. This may be
                  due to your account type or role restrictions.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2.5,
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 8,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<Mail />}
                    onClick={() => navigate(paths.not_found)}
                    sx={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
                      color: "white",
                      px: 5,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                      boxShadow: "0 10px 40px rgba(245, 158, 11, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #d97706 0%, #db2777 100%)",
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 50px rgba(245, 158, 11, 0.5)",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(paths.user_profile)}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      px: 5,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        transform: "translateY(-3px)",
                        borderWidth: 2,
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    View Account
                  </Button>
                </Box>

                <Button
                  startIcon={<Home />}
                  onClick={() => navigate(paths.main)}
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
                  Back to Home
                </Button>
              </Box>
            </Grid>

            {/* <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {reasons.map((reason, index) => (
                  <Card
                    key={index}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.4s",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(245, 158, 11, 0.5)",
                        transform: "translateX(8px)",
                        boxShadow: "0 10px 40px rgba(245, 158, 11, 0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography sx={{ fontSize: "2rem" }}>
                          {reason.icon}
                        </Typography>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              color: "text.primary",
                              fontSize: "1.1rem",
                            }}
                          >
                            {reason.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              lineHeight: 1.6,
                            }}
                          >
                            {reason.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
