import { LinearProgress, Box, ThemeProvider, createTheme } from "@mui/material";

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
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
});

export default function LoadingProgressBar() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: "3px",
        }}
      >
        <LinearProgress
          sx={{
            height: "100%",
            background: "rgba(255, 255, 255, 0.05)",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #9333ea 100%)",
              backgroundSize: "200% 100%",
              animation: "gradientShift 2s ease-in-out infinite",
              boxShadow:
                "0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)",
              "@keyframes gradientShift": {
                "0%": {
                  backgroundPosition: "200% 0",
                },
                "100%": {
                  backgroundPosition: "-200% 0",
                },
              },
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
