import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";

interface HeaderProps {
  themeToggleButton?: React.ReactNode;
}

export function Header({ themeToggleButton }: HeaderProps) {
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
              src="/logo-test.png"
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
