import { Box, Typography, Chip, Divider } from "@mui/material";

export function RenderDiagramsStructured({ content }: { content: string }) {
  // === Handle empty or missing content ===
  if (!content || !content.trim()) {
    return (
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
        No diagrams generated yet.
      </Typography>
    );
  }

  // === Try parsing JSON ===
  let parsed: any = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    return (
      <Typography
        sx={{
          color: "rgba(255,255,255,0.7)",
          fontStyle: "italic",
          textAlign: "center",
          py: 4,
          border: "1px dashed rgba(255,255,255,0.2)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {content}
      </Typography>
    );
  }

  // === Validate structure ===
  if (!parsed?.milestones || !Array.isArray(parsed.milestones)) {
    return (
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
        Invalid or empty tasks structure.
      </Typography>
    );
  }

  // === Render valid milestones & tasks ===
  return (
    <Box>
      {parsed.milestones.map((phase: any, idx: number) => (
        <Box key={idx} sx={{ mb: 5 }}>
          {/* Milestone title */}
          <Typography
            variant="h6"
            sx={{
              color: "#a855f7",
              fontWeight: 600,
              mb: 2,
              textShadow: "0 0 8px rgba(168,85,247,0.5)",
            }}
          >
            {phase.name || `Milestone ${idx + 1}`}
          </Typography>

          <Divider
            sx={{
              mb: 2,
              background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
              height: 2,
              borderRadius: 1,
            }}
          />

          {/* Tasks inside milestone */}
          {phase.tasks?.map((t: any, i: number) => (
            <Box
              key={i}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
                },
              }}
            >
              {/* Task title */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#ec4899",
                  fontWeight: 600,
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {t.title || `Task ${i + 1}`}
              </Typography>

              {/* Description */}
              {t.description && (
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                    mb: 1,
                  }}
                >
                  {t.description}
                </Typography>
              )}

              {/* Role / Priority chips */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {t.role && (
                  <Chip
                    size="small"
                    label={`Role: ${t.role}`}
                    sx={{
                      background: "rgba(168,85,247,0.1)",
                      color: "#a855f7",
                      fontWeight: 600,
                    }}
                  />
                )}
                {t.priority && (
                  <Chip
                    size="small"
                    label={`Priority: ${t.priority}`}
                    sx={{
                      background:
                        t.priority.toLowerCase() === "high"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(34,197,94,0.1)",
                      color:
                        t.priority.toLowerCase() === "high"
                          ? "#ef4444"
                          : "#22c55e",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
