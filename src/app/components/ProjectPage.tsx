import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { projects, renderBullet } from "./Projects";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const BULLET_ICONS = ["⚡", "⚠️", "⚙️", "🛡️", "🚀"] as const;

export function ProjectPage({ slug, backHref = "/#projects" }: { slug: string; backHref?: string }) {
  const isMobile = useIsMobile();
  const p = projects.find((pr) => pr.slug === slug);
  const backSection = backHref.replace("/#", "");

  if (!p) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.4)",
          fontFamily: FONT_MONO,
          fontSize: "0.8rem",
        }}
      >
        Project not found.
      </div>
    );
  }

  const isAward = p.status === "Best Outgoing Project · 2022–23";
  const statusColor = isAward
    ? "#facc15"
    : p.status === "Client Delivery"
      ? "#22d3ee"
      : p.devStatus === "completed"
        ? "#4ade80"
        : "#facc15";
  const statusBorder = isAward
    ? "rgba(250,204,21,0.35)"
    : p.status === "Client Delivery"
      ? "rgba(34,211,238,0.4)"
      : p.devStatus === "completed"
        ? "rgba(74,222,128,0.35)"
        : "rgba(250,204,21,0.35)";
  const statusBg = isAward
    ? "rgba(250,204,21,0.06)"
    : p.status === "Client Delivery"
      ? "rgba(34,211,238,0.08)"
      : p.devStatus === "completed"
        ? "rgba(74,222,128,0.06)"
        : "rgba(250,204,21,0.06)";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "80vw",
        margin: "0 auto",
        padding: "4rem 0 8rem",
      }}
    >
      {/* Back */}
      <motion.a
        href={backHref}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: FONT_MONO,
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          textDecoration: "none",
          marginBottom: isMobile ? "2.5rem" : "3.5rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
        }}
      >
        ← Back to {backSection}
      </motion.a>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}
      >
        {/* Status badge */}
        <div>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.52rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "20px",
              color: statusColor,
              border: `1px solid ${statusBorder}`,
              background: statusBg,
            }}
          >
            {p.status}
            {isAward && " 🏆"}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 800,
            fontSize: isMobile ? "clamp(1.6rem, 6vw, 2.8rem)" : "clamp(2rem, 3.5vw, 3rem)",
            color: "#fafaf8",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {p.title}
        </h1>

        {/* Company */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={p.logo}
            alt={p.company}
            style={{
              height: `${p.logoHeight}px`,
              width: "auto",
              maxWidth: "72px",
              objectFit: "contain",
              borderRadius: "3px",
              opacity: 0.85,
            }}
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).style.display = "none")
            }
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.65rem",
              letterSpacing: "0.09em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {p.company}
          </span>
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "3rem" }} />

      {/* Full bullets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "3rem" }}
      >
        {p.bullets.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              padding: "1.1rem 0",
              borderBottom:
                i < p.bullets.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <span
              style={{ fontSize: "0.95rem", flexShrink: 0, marginTop: "2px" }}
            >
              {BULLET_ICONS[i] ?? "▸"}
            </span>
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: isMobile ? "0.88rem" : "0.93rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {renderBullet(b)}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Impact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.65rem",
          color: "#e8e0d0",
          letterSpacing: "0.05em",
          background: "rgba(232,224,208,0.07)",
          border: "1px solid rgba(232,224,208,0.15)",
          borderRadius: "4px",
          padding: "12px 16px",
          lineHeight: 1.7,
          marginBottom: "2rem",
        }}
      >
        ↳ {p.impact}
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "2.5rem" }}
      >
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.54rem",
              letterSpacing: "0.07em",
              color: "rgba(255,255,255,0.38)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "3px",
              padding: "4px 9px",
            }}
          >
            {t}
          </span>
        ))}
      </motion.div>

      {/* GitHub link */}
      {p.github && (
        <motion.a
          href={p.github}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.35 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: FONT_MONO,
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.45)",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "11px 16px",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
            (e.currentTarget as HTMLElement).style.color = "#fafaf8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
          }}
        >
          <ArrowUpRight size={13} />
          View on GitHub
        </motion.a>
      )}
    </div>
  );
}
