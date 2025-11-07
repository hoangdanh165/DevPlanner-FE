import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  Refresh,
  Save as SaveIcon,
  GetApp as GetAppIcon,
} from "@mui/icons-material";
import RenderJSONStructured from "@/components/common/renderer/RenderJSONStructured";

type SectionViewProps = {
  icon: React.ReactNode;
  title: string;
  /** Raw text content (string). Với Diagrams, hãy dùng contentRenderer thay vì content */
  content?: string;
  /** Khi cần render phức tạp (diagrams, tables, …) */
  contentRenderer?: React.ReactNode;
  onRegenerate?: () => Promise<boolean>;
  readOnly?: boolean;
};

export function SectionView({
  icon,
  title,
  content,
  contentRenderer,
  onRegenerate,
  readOnly = false,
}: SectionViewProps) {
  const safeText = typeof content === "string" ? content : "";
  const hasContent = safeText.trim().length > 0;
  const fallbackMessage = `No ${title.toLowerCase()} generated yet.`;

  const canRegenerate = Boolean(onRegenerate) && !readOnly;

  return (
    <Box>
      {/* ===== Header (Icon + Title + Regenerate) ===== */}
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
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden
          >
            {icon}
          </Box>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Button
          startIcon={<Refresh />}
          sx={{
            color: canRegenerate ? "#a855f7" : "rgba(255,255,255,0.4)",
            borderColor: "rgba(168, 85, 247, 0.3)",
            border: "1px solid",
            "&:hover": {
              borderColor: canRegenerate ? "#a855f7" : "rgba(255,255,255,0.3)",
              background: canRegenerate
                ? "rgba(168, 85, 247, 0.1)"
                : "transparent",
            },
          }}
          onClick={onRegenerate}
          disabled={!canRegenerate || !content}
        >
          Regenerate
        </Button>
      </Box>

      {/* ===== Content ===== */}
      <Box
        sx={{
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "0.95rem",
          lineHeight: 1.8,
          mb: 4,
          "& pre": {
            background: "rgba(0, 0, 0, 0.4)",
            padding: "8px 12px",
            borderRadius: "6px",
            overflowX: "auto",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          },
          "& code": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            padding: "2px 4px",
            fontFamily: "monospace",
          },
          "& strong": { color: "#a855f7" },
          "& h1, & h2, & h3": {
            color: "#ec4899",
            fontWeight: 700,
            mt: 2,
          },
          "& ul": { pl: 3, mb: 2 },
        }}
      >
        {contentRenderer ? (
          contentRenderer
        ) : hasContent ? (
          <RenderJSONStructured content={safeText} />
        ) : (
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontStyle: "italic",
              textAlign: "center",
              py: 4,
              border: "1px dashed rgba(255,255,255,0.2)",
              borderRadius: 2,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {fallbackMessage}
          </Typography>
        )}
      </Box>

      {/* ===== Footer Buttons ===== */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
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
          disabled={readOnly}
        >
          Export
        </Button>
      </Box>
    </Box>
  );
}
