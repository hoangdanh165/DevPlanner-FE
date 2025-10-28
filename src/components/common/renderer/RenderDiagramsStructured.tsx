"use client";

import {
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { ZoomIn, ZoomOut, Refresh } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type DiagramItem = {
  type: string;
  code: string;
};

interface Props {
  content: DiagramItem[];
}

// ==== Init Mermaid once ====
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#a855f7",
    edgeLabelBackground: "#1e1e1e",
    tertiaryColor: "#ec4899",
  },
});

export default function RenderDiagramsStructured({ content }: Props) {
  if (!content || content.length === 0) {
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
        For Timeline & System Design
      </Typography>

      <Divider
        sx={{
          mb: 3,
          background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
          height: 2,
          borderRadius: 1,
        }}
      />

      {/* Tabs: one diagram per tab */}
      <TabsWrapper content={content} />
    </Box>
  );
}

function TabsWrapper({ content }: { content: DiagramItem[] }) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {content.map((d, i) => (
          <Tab
            key={i}
            label={d.type.replace("diagrams_", "") || `Diagram ${i + 1}`}
            id={`tab-${i}`}
            aria-controls={`tabpanel-${i}`}
          />
        ))}
      </Tabs>

      {content.map((diagram, idx) => (
        <div
          role="tabpanel"
          hidden={tab !== idx}
          id={`tabpanel-${idx}`}
          aria-labelledby={`tab-${idx}`}
          key={idx}
        >
          {tab === idx && (
            <Box sx={{ mt: 1 }}>
              <DiagramCard diagram={diagram} id={`diagram-${idx}`} />
            </Box>
          )}
        </div>
      ))}
    </Box>
  );
}

// ==== Diagram Card with zoom ====
function DiagramCard({ diagram, id }: { diagram: DiagramItem; id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  // transform state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Render Mermaid SVG and auto-fit to container
  useEffect(() => {
    if (!diagram?.code || !mermaidRef.current || !containerRef.current) return;

    try {
      mermaid.render(id, diagram.code).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          // Auto-fit: measure SVG and container, set scale
          setTimeout(() => {
            const svgEl = mermaidRef.current?.querySelector("svg");
            const containerEl = containerRef.current;
            if (svgEl && containerEl) {
              const svgRect = svgEl.getBoundingClientRect();
              const contRect = containerEl.getBoundingClientRect();
              // Use width and height to fit
              const scaleW = contRect.width / svgRect.width;
              const scaleH = contRect.height / svgRect.height;
              const fitScale = Math.min(scaleW, scaleH, 12); // don't zoom too much
              const scale = fitScale > 0 ? fitScale : 1;
              // Center: compute offset so diagram is centered after scaling
              const svgWidth = svgRect.width * scale;
              const svgHeight = svgRect.height * scale;
              const offsetX = (contRect.width - svgWidth) / 2;
              const offsetY = (contRect.height - svgHeight) / 2;
              setScale(scale);
              setTranslate({ x: offsetX, y: offsetY });
            }
          }, 50); // wait for DOM update
        }
      });
    } catch (err) {
      console.error("Mermaid render error:", err);
      if (mermaidRef.current)
        mermaidRef.current.innerHTML = `<p style=\"color:#ef4444;\">Error rendering diagram</p>`;
    }
  }, [diagram.code, id]);

  // Zoom handlers
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.25));
  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // Pointer (mouse/touch) handlers for panning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      // only left button
      if ((e as PointerEvent).button && (e as PointerEvent).button !== 0)
        return;
      draggingRef.current = true;
      (e.target as Element).setPointerCapture?.((e as any).pointerId);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || !lastPosRef.current) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
    };

    const onPointerUp = (e: PointerEvent) => {
      draggingRef.current = false;
      lastPosRef.current = null;
      try {
        (e.target as Element).releasePointerCapture?.((e as any).pointerId);
      } catch (err) {
        // ignore
      }
    };

    const onWheel = (e: WheelEvent) => {
      // if ctrlKey pressed or metaKey, zoom instead of scroll
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomFactor = delta > 0 ? 1.1 : 0.9;
        // compute focal point in container coordinates
        const rect = container.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        setScale((prev) => {
          const next = Math.min(Math.max(prev * zoomFactor, 0.25), 6);
          // adjust translate so point under cursor stays at same position
          setTranslate((t) => {
            const scaleRatio = next / prev;
            const nx = cx - scaleRatio * (cx - t.x);
            const ny = cy - scaleRatio * (cy - t.y);
            return { x: nx, y: ny };
          });
          return next;
        });
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("wheel", onWheel as any);
    };
  }, []);

  return (
    <Box
      sx={{
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#ec4899",
            fontWeight: 200,
            textTransform: "capitalize",
          }}
        >
          Hold{" "}
          <Box component="span" sx={{ fontWeight: 600 }}>
            Ctrl + Scroll
          </Box>{" "}
          To Zoom In/Out
        </Typography>

        <Box>
          <Tooltip title="Zoom In">
            <IconButton
              size="medium"
              onClick={zoomIn}
              sx={{ color: "#a855f7" }}
            >
              <ZoomIn fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton
              size="medium"
              onClick={zoomOut}
              sx={{ color: "#a855f7" }}
            >
              <ZoomOut fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom / Position">
            <IconButton
              size="medium"
              onClick={resetZoom}
              sx={{ color: "#a855f7" }}
            >
              <Refresh fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Diagram container with pan/zoom */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 480,
          overflow: "hidden",
          borderRadius: 1,
          background: "rgba(255,255,255,0.01)",
          position: "relative",
          touchAction: "none", // allow pointer events
        }}
      >
        <Box
          ref={mermaidRef}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: draggingRef.current ? "none" : "transform 0.12s ease",
            cursor: draggingRef.current ? "grabbing" : "grab",
            width: "max-content",
            padding: 1,
            "& svg": {
              display: "block",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Box>
  );
}
