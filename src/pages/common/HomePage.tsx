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
  AutoAwesome,
  Psychology,
  Computer,
  ListAlt,
  Article,
  SchemaOutlined,
  Dashboard,
} from "@mui/icons-material";
import { useThemeContext } from "@/themes/theme";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import UserMenu from "@/components/common/UserMenu";
import useAuth from "@/hooks/useAuth";
import { useSocketCtx } from "@/contexts/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/contexts/ToastProvider";
import { SectionView } from "@/components/common/SectionView";
import { RenderTasksStructured } from "@/components/common/RenderTasksStructured";
import RenderFeaturesStructured from "@/components/common/RenderFeaturesStructured";
import RenderTechStackStructured from "@/components/common/RenderTechStackStructured";

const AI_ENDPOINT =
  import.meta.env.VITE_AI_API_URL || "/api/v1/ai/generate-plan/";
import RenderDiagramsStructured from "./../../components/common/RenderDiagramsStructured";
import type { DiagramItem, DiagramStep, Sections } from "@/types/all_types";

export default function HomePage() {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const { toggleTheme, isLight } = useThemeContext();
  const { joinRoom, leaveRoom, onProgress } = useSocketCtx();

  const [activeTab, setActiveTab] = useState(0);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectInput, setProjectInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentThought, setCurrentThought] = useState<string | null>(null);
  const [lastGeneration, setLastGeneration] = useState({
    id: "",
    idea: "",
    description: "",
  });

  const [sections, setSections] = useState({
    overview: "",
    features: "",
    techstack: "",
    tasks: "",
    docs: "",
    diagrams: [] as DiagramItem[],
  });

  const currentProjectIdRef = useRef<string | null>(null);
  const unsubRef = useRef<() => void>(null);

  const thoughts: Record<string, string> = {
    // ===== Pipeline =====
    pipeline_started: "🚀 Starting AI project planning pipeline...",
    pipeline_complete:
      "🎉 All sections generated successfully! Project plan ready.",
    pipeline_failed: "❌ Pipeline failed. Please try again.",
    pipeline_progress: "⚙️ Processing...",
    stream_error: "⚠️ Streaming error occurred, please try again.",

    // ===== Overview =====
    overview_start: "🧩 Generating project overview...",
    stream_chunk_overview: "🧠 Expanding overview section...",
    overview_end: "✅ Overview section completed.",

    // ===== Tech Stack =====
    techstack_start: "💻 Analyzing and recommending tech stack...",
    stream_chunk_techstack: "⚙️ Selecting frameworks, databases, and tools...",
    techstack_end: "✅ Tech stack section completed.",

    // ===== Features =====
    features_start: "✨ Generating key features and functionalities...",
    stream_chunk_features: "🔍 Writing detailed feature descriptions...",
    features_end: "✅ Features section completed.",

    // ===== Tasks =====
    tasks_start: "🗂️ Breaking down project into actionable tasks...",
    stream_chunk_tasks: "📝 Detailing milestones and dependencies...",
    tasks_end: "✅ Tasks section completed.",

    // ===== Diagrams - Gantt =====
    diagrams_gantt_start: "🕒 Generating project timeline (Gantt chart)...",
    stream_chunk_diagrams_gantt: "📆 Adding milestones and dependencies...",
    diagrams_gantt_end: "✅ Gantt chart completed.",

    // ===== Diagrams - ERD =====
    diagrams_er_start: "🧱 Building Entity Relationship Diagram (ERD)...",
    stream_chunk_diagrams_er:
      "🔗 Defining tables, fields, and relationships...",
    diagrams_er_end: "✅ ERD diagram completed.",

    // ===== Diagrams - Architecture =====
    diagrams_architecture_start: "🏗️ Designing System Architecture Diagram...",
    stream_chunk_diagrams_architecture:
      "⚙️ Mapping components and data flow...",
    diagrams_architecture_end: "✅ Architecture diagram completed.",

    // ===== Diagrams - Sequence =====
    diagrams_sequence_start: "🔄 Creating main Sequence Diagram...",
    stream_chunk_diagrams_sequence:
      "📡 Defining interactions between components...",
    diagrams_sequence_end: "✅ Sequence diagram completed.",

    // ===== Docs =====
    docs_start: "📝 Generating technical documentation...",
    stream_chunk_docs: "📖 Writing detailed documentation sections...",
    docs_end: "✅ Documentation completed.",
  };

  const handleGenerate = async () => {
    // Clean up before starting new generation
    setSections({
      overview: "",
      features: "",
      techstack: "",
      tasks: "",
      docs: "",
      diagrams: [],
    });
    setCurrentThought(null);

    const projName = projectInput.trim();
    const projDesc = descriptionInput.trim();

    if (!projName || !projDesc) {
      showToast("Please provide a project name and idea.", "error");
      return;
    }

    const projId = uuidv4();
    setProjectId(projId);
    currentProjectIdRef.current = projId;

    // leave previous project room (if any) and join the new one
    if (currentProjectIdRef.current && currentProjectIdRef.current !== projId) {
      leaveRoom(currentProjectIdRef.current);
    }

    try {
      joinRoom(projId);
      currentProjectIdRef.current = projId;
    } catch (e) {}

    setIsGenerating(true);

    try {
      await axiosPrivate.post(AI_ENDPOINT, {
        project_id: projId,
        project_name: projName,
        description: projDesc,
      });

      setLastGeneration({ id: projId, idea: projName, description: projDesc });
    } catch (e) {
      console.warn("AI generation request failed", e);
      setIsGenerating(false);
      showToast(
        "Failed to start plan generation for this project. Please try again.",
        "error"
      );
      return;
    }
  };

  useEffect(() => {
    if (!projectId) return;

    console.log("[Socket] Listening for project:", projectId);
    joinRoom(projectId);

    if (unsubRef.current) unsubRef.current();

    const off = onProgress((payload) => {
      console.log("[Socket] Received:", payload);
      let p = payload;
      try {
        if (typeof payload === "string") p = JSON.parse(payload);
      } catch (_) {}

      const event = p.event || "unknown";
      const data = p.data || {};

      const mappedThought = thoughts[event] || null;

      if (mappedThought) {
        setCurrentThought(mappedThought);
      }

      if (event === "stream_chunk") {
        setSections((prev) => {
          // Nếu là diagram
          if (data.step.startsWith("diagrams_")) {
            const diagramType = data.step.replace(
              "diagrams_",
              ""
            ) as DiagramStep;

            // Tìm xem diagram này đã tồn tại trong mảng chưa
            const existingIndex = prev.diagrams.findIndex(
              (d) => d.type === diagramType
            );

            let updatedDiagrams;

            if (existingIndex !== -1) {
              // Append vào diagram hiện có
              updatedDiagrams = prev.diagrams.map((d, i) =>
                i === existingIndex ? { ...d, code: d.code + data.text } : d
              );
            } else {
              // Chưa có → thêm mới
              updatedDiagrams = [
                ...prev.diagrams,
                { type: diagramType, code: data.text },
              ];
            }

            return { ...prev, diagrams: updatedDiagrams };
          }

          // Nếu KHÔNG phải diagram (overview, features, techstack,...)
          return {
            ...prev,
            [data.step]: (prev[data.step as keyof Sections] || "") + data.text,
          };
        });
      }

      // control generation states
      if (["pipeline_complete", "pipeline_done", "completed"].includes(event)) {
        console.log(sections.diagrams);
        setIsGenerating(false);
        setProjectId(null);
      }
      if (["pipeline_failed", "failed"].includes(event)) {
        setIsGenerating(false);
        showToast("AI generation failed.", "error");
      }
      if (["pipeline_started", "queued", "init"].includes(event)) {
        setIsGenerating(true);
      }
    });

    unsubRef.current = off;

    return () => {
      console.log("[Socket] Cleanup for", projectId);
      off?.();
      leaveRoom(projectId);
    };
  }, [projectId]);

  const hasChangedSinceLastGenerate =
    projectInput.trim() !== lastGeneration.idea ||
    descriptionInput.trim() !== lastGeneration.description;

  const isGenerateDisabled = isGenerating || !hasChangedSinceLastGenerate;

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

          {/* ==== Idea (Top) ==== */}
          <TextField
            fullWidth
            label="Project Idea"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            placeholder="Your project idea..."
            disabled={isGenerating}
            sx={{
              mb: 2,
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
              },
            }}
          />

          {/* ==== Description (Multiline) + Button Row ==== */}
          <Box sx={{ position: "relative", pb: 10 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Describe your project in more detail..."
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
                "& textarea": {
                  color: "white",
                  resize: "none",
                  lineHeight: 1.5,
                },
              }}
            />
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
                    {currentThought && (
                      <Typography
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
                        {currentThought}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Collapse>
            {/* Generate Button */}
            <Button
              variant="contained"
              onClick={handleGenerate}
              size="medium"
              endIcon={<AutoAwesome />}
              disabled={isGenerating || isGenerateDisabled}
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                color: "white",
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                },
              }}
            >
              {isGenerating ? "Generating..." : "Generate"}
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
            overflow: "visible",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Scroll container: handles horizontal scrolling & touch panning on mobile */}
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                // allow horizontal panning gestures to take precedence
                touchAction: "pan-x",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  px: 1,
                  "& .MuiTab-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    minWidth: { xs: 100, sm: 120 },
                    whiteSpace: "nowrap",
                    "&.Mui-selected": {
                      color: "#a855f7",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    background:
                      "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                    height: 3,
                  },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Features" />
                <Tab label="Tech Stack" />
                <Tab label="Tasks" />
                <Tab label="Diagrams" />
                <Tab label="Docs" />
              </Tabs>
            </Box>

            {/* subtle fade hint when overflow exists */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 40,
                pointerEvents: "none",
                background:
                  "linear-gradient(90deg, rgba(10,10,10,0), rgba(10,10,10,0.35))",
              }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            {/* OVERVIEW */}
            {activeTab === 0 && (
              <SectionView
                icon={<Dashboard />}
                title="Overview"
                content={sections.overview}
                // onRegenerate={() => regenerate("overview")}
              />
            )}

            {/* FEATURES */}
            {activeTab === 1 && (
              <SectionView
                icon={<AutoAwesome />}
                title="Features"
                content={sections.features}
                contentRenderer={
                  <RenderFeaturesStructured content={sections.features || ""} />
                }
                // onRegenerate={() => regenerate("features")}
              />
            )}

            {/* TECH STACK */}
            {activeTab === 2 && (
              <SectionView
                icon={<Computer />}
                title="Tech Stack"
                content={sections.techstack}
                contentRenderer={
                  <RenderTechStackStructured
                    content={sections.techstack || ""}
                  />
                }
                // onRegenerate={() => regenerate("techstack")}
              />
            )}

            {/* TASKS */}
            {activeTab === 3 && (
              <SectionView
                icon={<ListAlt />}
                title="Tasks"
                content={sections.tasks}
                contentRenderer={
                  <RenderTasksStructured content={sections.tasks || ""} />
                }
                // onRegenerate={() => regenerate("tasks")}
              />
            )}

            {/* DIAGRAMS */}
            {activeTab === 4 && (
              <SectionView
                icon={<SchemaOutlined />}
                title="Diagrams"
                // content={sections.diagrams}
                contentRenderer={
                  <RenderDiagramsStructured content={sections.diagrams || ""} />
                }
                // onRegenerate={() => regenerate("tasks")}
              />
            )}

            {/* DOCS */}
            {activeTab === 5 && (
              <SectionView
                icon={<Article />}
                title="Docs"
                content={sections.docs}
                // onRegenerate={() => regenerate("docs")}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
