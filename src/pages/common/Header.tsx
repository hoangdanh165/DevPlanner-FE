import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            DevPlanner
          </Typography>
          {themeToggleButton}
          <Button variant="outlined" color="inherit">
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
