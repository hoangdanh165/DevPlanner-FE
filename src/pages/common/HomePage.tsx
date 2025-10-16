import { useEffect, useState, useRef } from "react";
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
  // Settings,
  Description,
  Refresh,
  AutoAwesome,
  Psychology,
} from "@mui/icons-material";
import { useThemeContext } from "@/themes/theme";
import SaveIcon from "@mui/icons-material/Save";
import GetAppIcon from "@mui/icons-material/GetApp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import UserMenu from "@/components/common/UserMenu";
import useAuth from "@/hooks/useAuth";
import { useSocketCtx } from "@/contexts/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/contexts/ToastProvider";

const AI_ENDPOINT =
  import.meta.env.VITE_AI_API_URL || "/api/v1/ai/generate-plan/";

export default function HomePage() {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const axiosPrivate = useAxiosPrivate();

  const [activeTab, setActiveTab] = useState(0);
  const [projectInput, setProjectInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(-1);
  const [projectId, setProjectId] = useState<string | null>(null);

  const { socket, joinRoom, leaveRoom, onProgress, on } = useSocketCtx();

  const [pubsubMessages, setPubsubMessages] = useState<
    Array<{ event: string; data: any; ts: number }>
  >([]);
  const currentProjectIdRef = useRef<string | null>(null);

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

  const handleGenerate = async () => {
    const projName = projectInput.trim();
    const projDesc = descriptionInput.trim();
    const projId = uuidv4();
    setProjectId(projId);

    // leave previous project room (if any) and join the new one
    try {
      if (currentProjectIdRef.current) {
        leaveRoom(currentProjectIdRef.current);
      }
    } catch (e) {}
    try {
      joinRoom(projId);
      currentProjectIdRef.current = projId;
    } catch (e) {
      // ignore
    }

    if (projName.length === 0 || projDesc.length === 0) {
      showToast("Please provide a project name or idea.", "error");
      return;
    }

    try {
      // mark as generating immediately so UI shows live section
      setIsGenerating(true);

      await axiosPrivate.post(AI_ENDPOINT, {
        project_id: projId,
        project_name: projName,
        description: projDesc,
      });
    } catch (e) {
      console.warn("AI generation request failed", e);
      setIsGenerating(false);
      showToast(
        "Failed to start plan generation for this project. Please try again.",
        "error"
      );
      return;
    }

    try {
      joinRoom(projId);
      console.log("Joined room for project:", projId);
    } catch (e) {
      // ignore
    }

    setCurrentThoughtIndex(-1);

    for (let i = 0; i < thoughts.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCurrentThoughtIndex(i);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const { toggleTheme, isLight } = useThemeContext();

  useEffect(() => {
    if (!projectId) return;

    joinRoom(projectId);

    const off = onProgress((payload) => {
      console.log("[WebSocket] Received payload:", payload);

      // payload may be sent as JSON string or already-parsed object
      let p: any = payload;
      try {
        if (typeof payload === "string") p = JSON.parse(payload);
      } catch (err) {
        // leave p as original
      }

      // normalize fields we expect from backend: { event, data, ts }
      const event = p.event || p.type || p.event_name || "unknown";
      const data = p.data ?? p.payload ?? null;
      const ts = Number(p.ts) || Date.now() / 1000; // backend ts is seconds

      const normalized = { event, data, ts };
      console.log(normalized);
      setPubsubMessages((prev) => [...prev, normalized]);

      // control UI state based on pipeline events
      if (
        event === "pipeline_complete" ||
        event === "pipeline_done" ||
        event === "completed"
      ) {
        setIsGenerating(false);
        setCurrentThoughtIndex(-1);
      }
      if (event === "pipeline_failed" || event === "failed") {
        setIsGenerating(false);
        showToast("AI generation failed. Check logs.", "error");
      }
      if (
        event === "pipeline_started" ||
        event === "queued" ||
        event === "init"
      ) {
        setIsGenerating(true);
      }
    });

    // cleanup
    return () => {
      off?.();
      leaveRoom(projectId);
    };
  }, [projectId, joinRoom, leaveRoom, onProgress]);

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
              placeholder="Your project idea..."
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
            <TextField
              fullWidth
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Describe more your project..."
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
              onClick={handleGenerate}
              size="medium"
              endIcon={<AutoAwesome />}
              disabled={isGenerating}
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
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </Box>
          <Collapse in={isGenerating}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                mb: 0,
                mt: 2,
                background: "rgba(168, 85, 247, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                borderRadius: 1,
                boxShadow: "0 8px 32px rgba(168, 85, 247, 0.2)",
                // maxWidth: "600px",
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
                  {currentThoughtIndex >= 0 && (
                    <Typography
                      key={currentThoughtIndex}
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "0.95rem",
                        fontWeight: "bold",
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
                </Box>
              </Box>
            </Paper>
            {/* Recent pubsub messages */}
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
              >
                Live updates
              </Typography>
              <Box sx={{ maxHeight: 160, overflow: "auto" }}>
                {pubsubMessages.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    No live messages yet
                  </Typography>
                ) : (
                  pubsubMessages.map((m, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.85rem",
                      }}
                    >
                      [
                      {new Date(
                        m.ts > 1e12 ? m.ts : m.ts * 1000
                      ).toLocaleTimeString()}
                      ] {m.event}:{" "}
                      {typeof m.data === "number"
                        ? m.data
                        : JSON.stringify(m.data)}
                    </Typography>
                  ))
                )}
              </Box>
            </Paper>
          </Collapse>
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
