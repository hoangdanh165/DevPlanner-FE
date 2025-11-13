import { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Collapse,
} from "@mui/material";
import { AutoAwesome, Psychology } from "@mui/icons-material";
import { useThemeContext } from "@/themes/theme";
import useAuth from "@/hooks/useAuth";
import { useSocketCtx } from "@/contexts/SocketContext";
import { useGeneration } from "@/contexts/GenerationContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/contexts/ToastProvider";
import type { DiagramItem, DiagramStep, Sections } from "@/types/all_types";
import PlanViewer from "@/components/common/PlanView";
import Header from "@/components/common/Header";

const AI_GENERATION_ENDPOINT = "/api/v1/ai/generate-plan/";
const AI_REGENERATION_ENDPOINT = "/api/v1/ai/regenerate-section/";

export default function HomePage() {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const { toggleTheme, isLight } = useThemeContext();
  const { joinRoom, leaveRoom, onProgress } = useSocketCtx();
  const {
    setGlobalGenerating,
    setCurrentVersion,
    appendAvailableVersion,
    setAvailableVersions,
  } = useGeneration();

  const [activeTab, setActiveTab] = useState(0);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectNameInput, setProjectNameInput] = useState("");
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

  const handleGenerate = async (): Promise<boolean> => {
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

    const projName = projectNameInput.trim();
    const projDesc = descriptionInput.trim();

    if (!projName || !projDesc) {
      showToast("Please provide a project name and idea.", "error");
      return false;
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
    } catch (e) {
      return false;
    }

    setIsGenerating(true);

    try {
      await axiosPrivate.post(AI_GENERATION_ENDPOINT, {
        project_id: projId,
        project_name: projName,
        description: projDesc,
      });
      showToast("AI generation started", "info");
      setLastGeneration({ id: projId, idea: projName, description: projDesc });
      setCurrentVersion(0);
      setAvailableVersions([]);
      return true;
    } catch (e) {
      console.warn("AI generation request failed", e);
      setIsGenerating(false);
      showToast(
        "Failed to start plan generation for this project. Please try again.",
        "error"
      );
      return false;
    }
  };

  const handleRegenerate = async (section: string): Promise<boolean> => {
    setSections((prev) => ({
      ...prev,
      [section]: section === "diagrams" ? [] : "",
    }));

    console.log(section);
    const lastProjectRaw = localStorage.getItem("last_project");

    const projectId =
      (lastProjectRaw && JSON.parse(lastProjectRaw).projectId) ||
      lastGeneration.id;

    setIsGenerating(true);
    try {
      await axiosPrivate.post(AI_REGENERATION_ENDPOINT, {
        project_id: projectId,
        section: section,
      });

      showToast("Starting section regeneration for this plan.", "info");
      return true;
    } catch (e) {
      console.warn("AI generation request failed", e);
      setIsGenerating(false);
      showToast(
        "Failed to start section regeneration for this plan. Please try again.",
        "error"
      );
      return false;
    }
  };

  useEffect(() => {
    const lastProjectRaw = localStorage.getItem("last_project");

    const projectId =
      (lastProjectRaw && JSON.parse(lastProjectRaw).projectId) ||
      lastGeneration.id;

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
          if (data.step.startsWith("diagrams_")) {
            const diagramType = data.step.replace(
              "diagrams_",
              ""
            ) as DiagramStep;

            const existingIndex = prev.diagrams.findIndex(
              (d) => d.type === diagramType
            );

            let updatedDiagrams;

            if (existingIndex !== -1) {
              updatedDiagrams = prev.diagrams.map((d, i) =>
                i === existingIndex ? { ...d, code: d.code + data.text } : d
              );
            } else {
              updatedDiagrams = [
                ...prev.diagrams,
                { type: diagramType, code: data.text },
              ];
            }

            return { ...prev, diagrams: updatedDiagrams };
          }

          return {
            ...prev,
            [data.step]: (prev[data.step as keyof Sections] || "") + data.text,
          };
        });
      }

      // control generation states
      if (["pipeline_complete", "pipeline_done", "completed"].includes(event)) {
        const new_ver = data.version;
        setCurrentVersion(new_ver);
        appendAvailableVersion(new_ver);
        setIsGenerating(false);
        setGlobalGenerating(false);

        localStorage.setItem(
          "last_project",
          JSON.stringify({ projectId: projectId })
        );
      }
      if (["pipeline_failed", "failed"].includes(event)) {
        setIsGenerating(false);
        showToast("AI generation failed.", "error");
        setGlobalGenerating(false);
      }
      if (["pipeline_started", "queued", "init"].includes(event)) {
        setIsGenerating(true);
        setGlobalGenerating(true);
      }
    });

    unsubRef.current = off;

    return () => {
      console.log("[Socket] Cleanup for", projectId);
      off?.();

      const isSignedIn = localStorage.getItem("isSignedIn") === "true";

      if (!isSignedIn && projectId) {
        console.log("[Socket] Leaving room because user signed out");
        setProjectId(null);
        leaveRoom(projectId);
      } else {
        console.log("[Socket] Keep room, user still signed in");
      }
    };
  }, [projectId]);

  const hasChangedSinceLastGenerate =
    (projectNameInput ?? "").toString().trim() !==
      (lastGeneration.idea ?? "").toString().trim() ||
    (descriptionInput ?? "").toString().trim() !==
      (lastGeneration.description ?? "").toString().trim();

  const isGenerateDisabled = isGenerating || !hasChangedSinceLastGenerate;

  const plan = useMemo(
    () => ({
      id: lastGeneration.id || projectId || "draft",
      name: lastGeneration.idea || projectNameInput || "Untitled",
      updatedAt: new Date().toISOString(),
      sections,
    }),
    [
      lastGeneration.id,
      lastGeneration.idea,
      projectId,
      projectNameInput,
      sections,
    ]
  );

  useEffect(() => {
    const loadLastProject = async (last: string) => {
      try {
        const { projectId } = JSON.parse(last);

        const res = await axiosPrivate.get(
          `/api/v1/projects/${projectId}/detail-main/`
        );

        const data = res.data?.data;
        if (!data) return null;

        setCurrentVersion(data.currentVersion);
        setAvailableVersions(data.availableVersions);

        setProjectNameInput(data.name || "Untitled");
        setDescriptionInput(data.description || "");

        if (data.sections) {
          setSections(data.sections);
        }

        return data;
      } catch (error) {
        console.error("Failed to load last project:", error);
        return null;
      }
    };

    const last = localStorage.getItem("last_project");

    if (last) {
      (async () => {
        const data = await loadLastProject(last);
        if (data) {
          console.log("✅ Loaded project:", data);
        }
      })();
    }
  }, [auth]);

  const fetchVersionHistory = async (version: number) => {
    const lastProjectRaw = localStorage.getItem("last_project");

    const projectId =
      (lastProjectRaw && JSON.parse(lastProjectRaw).projectId) ||
      lastGeneration.id;

    try {
      const res = await axiosPrivate.get(
        `/api/v1/projects/${projectId}/version-history/?version=${version}`
      );

      const data = res.data?.data;
      if (!data) return null;
      console.log(data);
      if (data.sections) {
        setSections(data.sections);
      }
      setCurrentVersion(version);
      return data;
    } catch (error) {
      console.error("Failed to load version history:", error);
      return null;
    }
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
      <Header isLight={isLight} toggleTheme={toggleTheme} auth={auth} />

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
            value={projectNameInput}
            onChange={(e) => setProjectNameInput(e.target.value)}
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
        <PlanViewer
          plan={plan}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRegenerate={handleRegenerate}
          onChangeVersion={fetchVersionHistory}
          // readOnly={false}
        />
      </Container>
    </Box>
  );
}
