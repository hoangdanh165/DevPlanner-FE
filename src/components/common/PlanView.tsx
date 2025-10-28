import React, { useMemo } from "react";
import { Paper, Box, Tabs, Tab } from "@mui/material";

import {
  Dashboard,
  AutoAwesome,
  Computer,
  ListAlt,
  SchemaOutlined,
  Article,
} from "@mui/icons-material";
import RenderFeaturesStructured from "@/components/common/renderer/RenderFeaturesStructured";
import RenderTechStackStructured from "@/components/common/renderer/RenderTechStackStructured";
import { RenderTasksStructured } from "@/components/common/renderer/RenderTasksStructured";
import RenderDiagramsStructured from "@/components/common/renderer/RenderDiagramsStructured";
import type { PlanViewerProps, SectionKey } from "@/types/all_types";
import { SectionView } from "@/components/common/SectionView";

const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
  // factory nhận raw string -> JSX (lazy-safe)
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
  readOnly = false,
}: PlanViewerProps) {
  const { sections } = plan;

  // chọn item hiện tại từ index
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
      {/* Tabs header */}
      <Box
        sx={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            touchAction: "pan-x",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, i) => onTabChange(i)}
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
        </Box>

        {/* fade hint mobile */}
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

      {/* Body */}
      <Box sx={{ p: 4 }}>
        <SectionView
          icon={current.icon}
          title={current.label}
          content={rawContent}
          contentRenderer={contentRenderer}
          onRegenerate={
            onRegenerate ? () => onRegenerate(current.key) : undefined
          }
          readOnly={readOnly}
        />
      </Box>
    </Paper>
  );
}
