import { Box, Typography, Chip, Divider } from "@mui/material";

export default function RenderFeaturesStructured({
  content,
}: {
  content: string;
}) {
  // ==== Handle empty or missing content ====
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
        No features generated yet.
      </Typography>
    );
  }

  // ==== Try to parse JSON ====
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

  // ==== Validate structure ====
  if (!parsed?.features || !Array.isArray(parsed.features)) {
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
        Invalid or empty features data.
      </Typography>
    );
  }

  // ==== Render valid features ====
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: "#a855f7",
          fontWeight: 700,
          mb: 2,
          textShadow: "0 0 6px rgba(168,85,247,0.5)",
        }}
      >
        Features
      </Typography>

      <Divider
        sx={{
          mb: 3,
          background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
          height: 2,
          borderRadius: 1,
        }}
      />

      {parsed.features.map((f: any, idx: number) => (
        <Box
          key={idx}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
            },
          }}
        >
          {/* ==== Feature Title ==== */}
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
            {f.title || `Feature ${idx + 1}`}
          </Typography>

          {/* ==== Description ==== */}
          {f.description && (
            <Typography
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              {f.description}
            </Typography>
          )}

          {/* ==== Metadata Chips ==== */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {f.priority && (
              <Chip
                size="small"
                label={`Priority: ${f.priority}`}
                sx={{
                  background:
                    f.priority.toLowerCase() === "high"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(234,179,8,0.1)",
                  color:
                    f.priority.toLowerCase() === "high" ? "#ef4444" : "#eab308",
                  fontWeight: 600,
                }}
              />
            )}
            {Object.entries(f)
              .filter(
                ([k]) => !["title", "description", "priority"].includes(k)
              )
              .map(([key, val]) => (
                <Chip
                  key={key}
                  size="small"
                  label={`${key}: ${String(val)}`}
                  sx={{
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                />
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
