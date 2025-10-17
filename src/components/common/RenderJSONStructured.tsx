import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Typography, Divider } from "@mui/material";

function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function RenderJSONStructured({ content }: { content: string }) {
  let parsed: any = null;
  try {
    parsed = JSON.parse(content);
  } catch (_) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
  }

  // Nếu là object, render đẹp từng section
  if (typeof parsed === "object" && parsed !== null) {
    return (
      <Box>
        {Object.entries(parsed).map(([category, items]: [string, any]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#a855f7",
                fontWeight: 600,
                textTransform: "capitalize",
                mb: 1,
              }}
            >
              {category.replace(/_/g, " ")}
            </Typography>

            <Divider
              sx={{
                mb: 2,
                background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                height: 2,
                borderRadius: 1,
              }}
            />

            {Array.isArray(items) ? (
              items.map((it, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2.5,
                    p: 2,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ec4899", fontWeight: 600 }}
                  >
                    {it.tech || it.name || `Item ${idx + 1}`}
                  </Typography>
                  {it.reason && (
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.9rem",
                        mt: 0.5,
                      }}
                    >
                      {it.reason}
                    </Typography>
                  )}

                  {/* Nếu có thêm field khác (ví dụ version, pros, cons...) */}
                  {Object.entries(it)
                    .filter(([k]) => !["tech", "name", "reason"].includes(k))
                    .map(([key, val]) => (
                      <Typography
                        key={key}
                        sx={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.85rem",
                          mt: 0.3,
                        }}
                      >
                        • {key}: {String(val)}
                      </Typography>
                    ))}
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                {JSON.stringify(items)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  }

  // fallback
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
