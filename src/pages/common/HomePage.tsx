"use client";

import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import {
  // Settings,
  Description,
  Refresh,
  AutoAwesome,
} from "@mui/icons-material";
import { useThemeContext } from "@/themes/theme";
import SaveIcon from "@mui/icons-material/Save";
import GetAppIcon from "@mui/icons-material/GetApp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import UserMenu from "@/components/common/UserMenu";
import useAuth from "@/hooks/useAuth";

export default function HomePage() {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [projectInput, setProjectInput] = useState(
    "AI-powered fitness tracker"
  );

  const { toggleTheme, isLight } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000, #0a0a0a)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(-100px, 100px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 15s ease-in-out infinite reverse",
        }}
      />

      {/* Header */}
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
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
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
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
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
                {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={toggleTheme}
                sx={{ minWidth: 0, padding: 1, borderRadius: "50%", mr: 2 }}
              >
                {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
              </Button> */}
              {/* <IconButton
                sx={{
                  color: "#a855f7",
                  "&:hover": {
                    background: "rgba(168, 85, 247, 0.1)",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                  },
                }}
              >
                <Settings />
              </IconButton> */}
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

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        {/* Input Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 2,
              fontWeight: 500,
            }}
          >
            What project are you planning?
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
              placeholder="Describe your project idea..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "white",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(168, 85, 247, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a855f7",
                  },
                },
                "& input": {
                  color: "white",
                  // truncate placeholder and entered text with ellipsis
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  "&::placeholder": {
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  "&::placeholder": {
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="medium"
              endIcon={<AutoAwesome />}
              sx={{
                background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                color: "white",
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                },
              }}
            >
              Generate
            </Button>
          </Box>
        </Paper>

        {/* Tabs Section */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              px: 2,
              "& .MuiTab-root": {
                color: "rgba(255, 255, 255, 0.6)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&.Mui-selected": {
                  color: "#a855f7",
                },
              },
              "& .MuiTabs-indicator": {
                background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                height: 3,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Features" />
            <Tab label="Tech Stack" />
            <Tab label="Tasks" />
            <Tab label="Docs" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        background:
                          "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Description sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      Overview
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<Refresh />}
                    sx={{
                      color: "#a855f7",
                      borderColor: "rgba(168, 85, 247, 0.3)",
                      border: "1px solid",
                      "&:hover": {
                        borderColor: "#a855f7",
                        background: "rgba(168, 85, 247, 0.1)",
                      },
                    }}
                  >
                    Regenerate
                  </Button>
                </Box>

                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  This project aims to help users track their fitness goals with
                  AI-powered insights and personalized recommendations. The
                  application will provide workout tracking, nutrition
                  monitoring, and progress analytics to help users achieve their
                  health objectives.
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    startIcon={<GetAppIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        background: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                      "&:hover": {
                        boxShadow: "0 6px 30px rgba(59, 130, 246, 0.6)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Save Project
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
