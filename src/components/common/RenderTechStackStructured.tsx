import { Box, Typography, Divider, Paper } from "@mui/material";

export default function RenderTechStackStructured({
  content,
}: {
  content: string;
}) {
  // 🧩 Fallback for empty content
  if (!content || !content.trim()) {
    return (
      <Typography
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontStyle: "italic",
          textAlign: "center",
          py: 4,
          border: "1px dashed rgba(255,255,255,0.2)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        No tech stack generated yet.
      </Typography>
    );
  }

  // 🧠 Parse JSON safely
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

  // 🧩 Validate structure
  const categories = Object.keys(parsed || {});
  if (categories.length === 0) {
    return (
      <Typography
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontStyle: "italic",
          textAlign: "center",
          py: 4,
          border: "1px dashed rgba(255,255,255,0.2)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        Invalid or empty tech stack data.
      </Typography>
    );
  }

  // 🎨 Render structured sections
  return (
    <Box>
      {categories.map((category) => {
        const items = parsed[category];
        if (!Array.isArray(items) || items.length === 0) return null;

        return (
          <Box key={category} sx={{ mb: 5 }}>
            {/* ==== Category Header ==== */}
            <Typography
              variant="h6"
              sx={{
                color: "#a855f7",
                fontWeight: 700,
                mb: 2,
                textTransform: "capitalize",
                textShadow: "0 0 6px rgba(168,85,247,0.5)",
              }}
            >
              {category.replace(/_/g, " ")}
            </Typography>

            <Divider
              sx={{
                mb: 3,
                background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                height: 2,
                borderRadius: 1,
              }}
            />

            {/* ==== Tech Cards ==== */}
            {items.map((item: any, idx: number) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  mb: 2,
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
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#ec4899",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {item.tech || `Technology ${idx + 1}`}
                </Typography>

                {item.reason && (
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.reason}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
