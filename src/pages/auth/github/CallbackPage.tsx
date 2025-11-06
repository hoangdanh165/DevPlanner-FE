import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";

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

export default function CallbackPage() {
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
            left: "20%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
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
            right: "10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
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
          <Box sx={{ textAlign: "center" }}>
            {/* GitHub Icon with Loading Spinner */}
            <Box
              sx={{
                position: "relative",
                width: 120,
                height: 120,
                mx: "auto",
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <CircularProgress
                variant="indeterminate"
                size={120}
                sx={{
                  position: "absolute",
                  color: "primary.main",
                  "& circle": {
                    strokeLinecap: "round",
                  },
                }}
                thickness={2}
              /> */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  bgcolor: "rgba(147, 51, 234, 0.15)",
                  border: "2px solid rgba(147, 51, 234, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}
              >
                🔐
              </Box>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                fontWeight: 900,
                mb: 2,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Signing in with GitHub
            </Typography>

            {/* Subheading */}
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.05rem", md: "1.2rem" },
                color: "rgba(255, 255, 255, 0.7)",
                mb: 2,
                fontWeight: 400,
              }}
            >
              Waiting for GitHub authorization...
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: 6,
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Please wait while we redirect you to complete the authentication
              process. This usually takes a few seconds.
            </Typography>

            {/* Loading Steps */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 6,
                bgcolor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                p: 4,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  ✓
                </Box>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
                >
                  GitHub authorization granted
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CircularProgress
                  size={32}
                  thickness={4}
                  sx={{
                    color: "primary.main",
                  }}
                />
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
                >
                  Processing your credentials & redirect
                </Typography>
              </Box>
            </Box>

            {/* Hint Text */}
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                display: "block",
                fontSize: "0.9rem",
              }}
            >
              If you are not redirected automatically, please wait a moment.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
