import { useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Box,
} from "@mui/material";
import { ThemeProvider, useThemeContext } from "@/themes/theme";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Header } from "@/pages/common/Header";
import { InputSection } from "@/pages/common/InputSection";
import { TabsSection } from "@/pages/common/TabsSection";

// Remove local darkTheme, use context theme

function HomePage() {
  const [projectInput, setProjectInput] = useState(
    "AI-powered fitness tracker"
  );
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerate = () => {
    console.log("Generating project plan for:", projectInput);
  };

  // Use theme context
  const { theme, toggleTheme, isLight } = useThemeContext();
  const muiTheme = createTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Header
          themeToggleButton={
            <Button
              variant="contained"
              color="primary"
              onClick={toggleTheme}
              sx={{ minWidth: 0, padding: 1, borderRadius: "50%", mr: 2 }}
            >
              {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
            </Button>
          }
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 1, sm: 2, md: 0 },
            py: { xs: 2, sm: 3, md: 4 },
            gap: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "100vw",
          }}
        >
          <InputSection
            value={projectInput}
            onChange={setProjectInput}
            onGenerate={handleGenerate}
          />
          <TabsSection activeTab={activeTab} onTabChange={setActiveTab} />
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}

// Wrap HomePage with ThemeProvider
const HomePageWithTheme = () => (
  <ThemeProvider>
    <HomePage />
  </ThemeProvider>
);

export default HomePageWithTheme;
