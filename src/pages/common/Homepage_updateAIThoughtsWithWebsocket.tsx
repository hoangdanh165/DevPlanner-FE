"use client";

import { useState, useEffect } from "react";
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
  Collapse,
} from "@mui/material";
import {
  Settings,
  Description,
  Refresh,
  Psychology,
} from "@mui/icons-material";
import UserMenu from "./user-menu";

export default function DeveloperPlanner() {
  const [activeTab, setActiveTab] = useState(0);
  const [projectInput, setProjectInput] = useState(
    "AI-powered fitness tracker"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(-1);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentThought, setCurrentThought] = useState("");
  const [wsConnected, setWsConnected] = useState(false);

  const thoughts = [
    "Analyzing project requirements...",
    "Identifying key features and functionalities...",
    "Evaluating technology stack options...",
    "Considering scalability and performance needs...",
    "Mapping out database schema requirements...",
    "Planning API endpoints and data flow...",
    "Generating project structure and architecture...",
    "Creating comprehensive project overview...",
  ];

  // WebSocket state
  // Initialize WebSocket connection
  const connectWebSocket = () => {
    // Replace with your actual WebSocket URL
    const websocket = new WebSocket("ws://your-backend-url/ai-thoughts");

    websocket.onopen = () => {
      console.log("[v0] WebSocket connected");
      setWsConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Assuming the WebSocket sends messages in format: { thought: "..." }
        if (data.thought) {
          setCurrentThought(data.thought);
        }

        // Handle completion message
        if (data.status === "complete") {
          setIsGenerating(false);
        }
      } catch (error) {
        console.error("[v0] Error parsing WebSocket message:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("[v0] WebSocket error:", error);
      setWsConnected(false);
    };

    websocket.onclose = () => {
      console.log("[v0] WebSocket disconnected");
      setWsConnected(false);
      setWs(null);
    };

    return websocket;
  };

  // Handle generate with WebSocket
  const handleGenerateWithWebSocket = () => {
    setIsGenerating(true);
    setCurrentThought("");

    // Connect to WebSocket if not already connected
    let websocket = ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      websocket = connectWebSocket();
    }

    // Send project input to backend to start generation
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          action: "generate",
          project: projectInput,
        })
      );
    }
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  // Current implementation using simulated thoughts
  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentThoughtIndex(-1);

    for (let i = 0; i < thoughts.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCurrentThoughtIndex(i);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsGenerating(false);
  };

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
                sx={{
                  color: "#a855f7",
                  "&:hover": {
                    background: "rgba(168, 85, 247, 0.1)",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                  },
                }}
              >
                <Settings />
              </IconButton>
              <UserMenu userName="Sarah Chen" userEmail="sarah@developer.com" />
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
              disabled={isGenerating}
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
              }}
            />
            <Button
              variant="contained"
              onClick={handleGenerateWithWebSocket}
              disabled={isGenerating}
              sx={{
                px: 4,
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                boxShadow: "0 4px 20px rgba(168, 85, 247, 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 30px rgba(168, 85, 247, 0.6)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "rgba(168, 85, 247, 0.3)",
                  color: "rgba(255, 255, 255, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isGenerating ? "Generating..." : "Generate ▶"}
            </Button>
          </Box>
        </Paper>

        {/* Thinking Section */}
        <Collapse in={isGenerating}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              background: "rgba(168, 85, 247, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(168, 85, 247, 0.2)",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                      transform: "scale(1)",
                    },
                    "50%": {
                      boxShadow: "0 0 40px rgba(168, 85, 247, 0.8)",
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Psychology sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  minHeight: "24px",
                }}
              >
                {/* For simulated mode: use currentThoughtIndex */}
                {currentThoughtIndex >= 0 && (
                  <Typography
                    key={currentThoughtIndex}
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      animation: "fadeInOut 1.2s ease-in-out",
                      "@keyframes fadeInOut": {
                        "0%": {
                          opacity: 0,
                          filter: "blur(4px)",
                          transform: "translateY(10px)",
                        },
                        "20%": {
                          opacity: 1,
                          filter: "blur(0px)",
                          transform: "translateY(0)",
                        },
                        "80%": {
                          opacity: 1,
                          filter: "blur(0px)",
                          transform: "translateY(0)",
                        },
                        "100%": {
                          opacity: 0,
                          filter: "blur(4px)",
                          transform: "translateY(-10px)",
                        },
                      },
                    }}
                  >
                    {thoughts[currentThoughtIndex]}
                  </Typography>
                )}

                {/* For WebSocket mode: uncomment this and comment out the above block */}
                {/*
                {currentThought && (
                  <Typography
                    key={currentThought}
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      animation: "fadeInOut 1.2s ease-in-out",
                      "@keyframes fadeInOut": {
                        "0%": {
                          opacity: 0,
                          filter: "blur(4px)",
                          transform: "translateY(10px)",
                        },
                        "20%": {
                          opacity: 1,
                          filter: "blur(0px)",
                          transform: "translateY(0)",
                        },
                        "80%": {
                          opacity: 1,
                          filter: "blur(0px)",
                          transform: "translateY(0)",
                        },
                        "100%": {
                          opacity: 0,
                          filter: "blur(4px)",
                          transform: "translateY(-10px)",
                        },
                      },
                    }}
                  >
                    {currentThought}
                  </Typography>
                )}
                */}
              </Box>
            </Box>
          </Paper>
        </Collapse>

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
                    onClick={handleGenerateWithWebSocket}
                    disabled={isGenerating}
                    sx={{
                      color: "#a855f7",
                      borderColor: "rgba(168, 85, 247, 0.3)",
                      border: "1px solid",
                      "&:hover": {
                        borderColor: "#a855f7",
                        background: "rgba(168, 85, 247, 0.1)",
                      },
                      "&:disabled": {
                        color: "rgba(168, 85, 247, 0.5)",
                        borderColor: "rgba(168, 85, 247, 0.2)",
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

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
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
                    💾 Save Project
                  </Button>
                  <Button
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
                    ⬇ Export
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
