import { Box, Container, Typography, IconButton, Button } from "@mui/material";
import { Description, Brightness4, Brightness7 } from "@mui/icons-material";
import UserMenu from "@/components/common/UserMenu";

interface HeaderProps {
  isLight: boolean;
  toggleTheme: () => void;
  auth?: any;
}

export default function Header({ isLight, toggleTheme, auth }: HeaderProps) {
  return (
    <Box
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        background: "rgba(0, 0, 0, 0.5)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
              }}
            >
              <Description sx={{ color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Developer Planner
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "#a855f7",
                "&:hover": {
                  background: "rgba(168, 85, 247, 0.1)",
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                },
              }}
            >
              {isLight ? <Brightness4 /> : <Brightness7 />}
            </IconButton>

            {auth ? (
              <UserMenu user={auth} />
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "rgba(168, 85, 247, 0.5)",
                  color: "white",
                  px: 3,
                  "&:hover": {
                    borderColor: "#a855f7",
                    background: "rgba(168, 85, 247, 0.1)",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                  },
                }}
              >
                SIGN IN
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
