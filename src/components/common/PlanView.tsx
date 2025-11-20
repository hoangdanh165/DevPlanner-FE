import React, { useMemo } from "react";
import { Paper, Box, Tabs, Tab, Button } from "@mui/material";

import {
  Dashboard,
  AutoAwesome,
  Computer,
  ListAlt,
  SchemaOutlined,
  Article,
} from "@mui/icons-material";
import RenderFeaturesStructured from "@/components/common/renderers/RenderFeaturesStructured";
import RenderTechStackStructured from "@/components/common/renderers/RenderTechStackStructured";
import { RenderTasksStructured } from "@/components/common/renderers/RenderTasksStructured";
import RenderDiagramsStructured from "@/components/common/renderers/RenderDiagramsStructured";
import type { PlanViewerProps, SectionKey } from "@/types/all_types";
import { SectionView } from "@/components/common/SectionView";
import VersionSelector from "@/components/common/VersionSelector";
import { GetApp } from "@mui/icons-material";

const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
  renderer?: (raw: string) => React.ReactNode;
}> = [
  { key: "overview", label: "Overview", icon: <Dashboard /> },
  {
    key: "features",
    label: "Features",
    icon: <AutoAwesome />,
    renderer: (raw) => <RenderFeaturesStructured content={raw || ""} />,
  },
  {
    key: "techstack",
    label: "Tech Stack",
    icon: <Computer />,
    renderer: (raw) => <RenderTechStackStructured content={raw || ""} />,
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: <ListAlt />,
    renderer: (raw) => <RenderTasksStructured content={raw || ""} />,
  },
  {
    key: "diagrams",
    label: "Diagrams",
    icon: <SchemaOutlined />,
    renderer: (raw) => <RenderDiagramsStructured content={raw || ""} />,
  },
  { key: "docs", label: "Docs", icon: <Article /> },
];

export default function PlanViewer({
  plan,
  activeTab,
  onTabChange,
  onRegenerate,
  onChangeVersion,
  readOnly = false,
}: PlanViewerProps) {
  const { sections } = plan;

  const current = SECTIONS[activeTab];
  const rawContent = sections[current.key] ?? "";

  const contentRenderer = useMemo(() => {
    if (current.renderer) return current.renderer(rawContent);
    return undefined;
  }, [current, rawContent]);

  return (
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
      {/* Tabs header + Version selector */}
      <Box
        sx={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          px: 1,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Tabs scrollable */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            touchAction: "pan-x",
            position: "relative",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, i) => onTabChange(i)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                color: "rgba(255, 255, 255, 0.6)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                minWidth: { xs: 90, sm: 110 },
                whiteSpace: "nowrap",
                "&.Mui-selected": { color: "#a855f7" },
              },
              "& .MuiTabs-indicator": {
                background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                height: 3,
              },
            }}
          >
            {SECTIONS.map((s) => (
              <Tab key={s.key} label={s.label} />
            ))}
          </Tabs>

          {/* fade hint chỉ cho mobile, không đè lên VersionSelector */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 32,
              pointerEvents: "none",
              background:
                "linear-gradient(90deg, rgba(10,10,10,0), rgba(10,10,10,0.6))",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <VersionSelector onChangeVersion={onChangeVersion} />

          <Button
            startIcon={<GetApp />}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.4)",
                background: "rgba(255, 255, 255, 0.05)",
              },
            }}
            disabled={readOnly}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 4 }}>
        <SectionView
          icon={current.icon}
          title={current.label}
          readOnly={readOnly}
          // Nếu không phải diagrams -> regenerate nguyên section
          onRegenerate={
            current.key !== "diagrams"
              ? () => onRegenerate(current.key)
              : undefined
          }
          // Nếu là diagrams -> render custom + truyền regenerate từng loại
          contentRenderer={
            current.key === "diagrams" ? (
              <RenderDiagramsStructured
                content={rawContent} // [{ type: "diagrams_er", code: "..." }, ...]
                onRegenerate={(diagramKey) => onRegenerate(diagramKey)}
              />
            ) : (
              contentRenderer
            )
          }
          content={current.key === "diagrams" ? undefined : rawContent}
        />
      </Box>
    </Paper>
  );
}
