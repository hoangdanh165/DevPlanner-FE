"use client";

import type React from "react";
import { useState, useMemo } from "react";

import RenderFeaturesStructured from "@/components/common/renderers/RenderFeaturesStructured";
import RenderTechStackStructured from "@/components/common/renderers/RenderTechStackStructured";
import { RenderTasksStructured } from "@/components/common/renderers/RenderTasksStructured";
import RenderDiagramsStructured from "@/components/common/renderers/RenderDiagramsStructured";
import RenderJSONStructured from "@/components/common/renderers/RenderJSONStructured";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { Close, Download, Share } from "@mui/icons-material";

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    description: string;
    version: string;
    status: string;
    tags: string[];
    created_at: string;
    updated_at: string;
    sections: Array<{
      id: string;
      title: string;
      content: string;
      order_index: number;
    }>;
  };
}

export default function ProjectDetailsDialog({
  open,
  onClose,
  project,
}: ProjectDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeDiagramTab, setActiveDiagramTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  const handleDiagramTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setActiveDiagramTab(newValue);

  // Separate diagram + gantt sections from others
  const { nonDiagramSections, diagramSections } = useMemo(() => {
    const diagram = [];
    const others = [];

    (project?.sections || []).forEach((section) => {
      const title = (section.title || "").toLowerCase();
      if (title.includes("diagram") || title.includes("gantt"))
        diagram.push(section);
      else others.push(section);
    });

    diagram.sort((a, b) => a.order_index - b.order_index);
    others.sort((a, b) => a.order_index - b.order_index);

    return { nonDiagramSections: others, diagramSections: diagram };
  }, [project]);

  // Add top-level "Diagrams" tab if needed
  const topLevelTabs = useMemo(() => {
    const tabs = [...nonDiagramSections];
    if (diagramSections.length > 0) {
      tabs.push({
        id: "diagrams-tab",
        title: "Diagrams",
        content: "",
        order_index: 999,
      });
    }
    return tabs;
  }, [nonDiagramSections, diagramSections]);

  // Renderer
  const renderSectionContent = (section: any) => {
    if (!section) return null;
    const title = (section.title || "").toLowerCase();
    const content = section.content || "";

    if (title.includes("feature"))
      return <RenderFeaturesStructured content={content} />;
    if (title.includes("tech"))
      return <RenderTechStackStructured content={content} />;
    if (title.includes("task"))
      return <RenderTasksStructured content={content} />;
    if (title.includes("diagram") || title.includes("gantt")) {
      const diagrams = [
        {
          type: title.replace(/diagrams?|gantt/gi, "").trim() || "diagram",
          code: content,
        },
      ];
      return <RenderDiagramsStructured content={diagrams} />;
    }
    if (title.includes("doc"))
      return <RenderJSONStructured content={content} />;
    return <RenderJSONStructured content={content} />;
  };

  const safeProject = project || {
    id: "",
    name: "(No project)",
    description: "",
    version: "",
    status: "",
    tags: [],
    created_at: "",
    updated_at: "",
    sections: [],
  };

  const activeSection = topLevelTabs[activeTab];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background:
            "linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(15, 15, 25, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(168, 85, 247, 0.2)",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          background: "rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          pb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
          >
            {safeProject.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={"v" + safeProject.version || ""}
              size="small"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)",
                color: "#a855f7",
                fontWeight: 600,
              }}
            />
            <Chip
              label={safeProject.status || ""}
              size="small"
              sx={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
            />
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Top-level Tabs */}
      <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.6)",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              "&.Mui-selected": { color: "#a855f7" },
            },
            "& .MuiTabs-indicator": {
              background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
              height: 3,
            },
          }}
        >
          {topLevelTabs.map((section) => (
            <Tab
              key={section.id}
              label={
                section.title.charAt(0).toUpperCase() + section.title.slice(1)
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          py: 3,
          px: 3,
          maxHeight: "60vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(168, 85, 247, 0.3)",
            borderRadius: "10px",
            "&:hover": { background: "rgba(168, 85, 247, 0.5)" },
          },
        }}
      >
        {activeSection?.id === "diagrams-tab" ? (
          <>
            {/* Instead of showing your own nested Tabs, 
        just merge all diagram + gantt sections and let RenderDiagramsStructured handle its tabs */}
            {diagramSections.length > 0 ? (
              <RenderDiagramsStructured
                content={diagramSections.map((section) => ({
                  type: section.title.replace(/diagrams_?|chart/gi, "").trim(),
                  code: section.content,
                }))}
              />
            ) : (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontStyle: "italic",
                }}
              >
                No diagrams or Gantt charts available.
              </Typography>
            )}
          </>
        ) : activeSection ? (
          <>
            {/* <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 2 }}
            >
              {activeSection.title}
            </Typography> */}
            {/* <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} /> */}
            {renderSectionContent(activeSection)}
          </>
        ) : (
          <Typography
            sx={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
          >
            No section data available.
          </Typography>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          p: 2,
          gap: 1,
          display: "flex",
          justifyContent: "flex-end", // ✅ căn phải
        }}
      >
        <Button
          startIcon={<Share />}
          sx={{
            color: "#a855f7",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            "&:hover": {
              borderColor: "#a855f7",
              background: "rgba(168, 85, 247, 0.1)",
            },
          }}
        >
          Share
        </Button>

        <Button
          startIcon={<Download />}
          sx={{
            color: "#a855f7",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            "&:hover": {
              borderColor: "#a855f7",
              background: "rgba(168, 85, 247, 0.1)",
            },
          }}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}
