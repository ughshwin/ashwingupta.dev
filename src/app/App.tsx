import { Cursor } from "./components/Cursor";
import { EnvironmentLayer } from "./components/EnvironmentLayer";
import { AIBackground } from "./components/AIBackground";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const isMobile = useIsMobile();

  return (
    <div
      className="spatial-scene"
      style={{ cursor: isMobile ? "auto" : "none" }}
    >
      <EnvironmentLayer />
      <AIBackground />
      <Cursor />

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          zIndex: 10,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            margin: 0,
          }}
        >
          ashwingupta.dev
        </p>
        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.82)",
            margin: 0,
            lineHeight: 1.5,
            maxWidth: "520px",
          }}
        >
          Down for a complete overhaul.
          <br />
          Something great is going to be here soon — very soon.
        </p>
      </div>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}
