import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface HeaderProps {
  themeToggleButton?: React.ReactNode;
}

export function Header({ themeToggleButton }: HeaderProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={isDarkMode ? "/logo-darkmode.png" : "/logo-lightmode.png"}
              alt="DevPlanner Logo"
              sx={{
                height: { xs: 88, sm: 96, md: 104 },
                maxWidth: { xs: 200, sm: 240, md: 280 },
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          {themeToggleButton}
          <Button variant="outlined" color="inherit">
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
