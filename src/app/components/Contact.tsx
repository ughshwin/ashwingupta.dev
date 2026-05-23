import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Mail, Github, Linkedin, MapPin, FileDown } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
// @ts-ignore
import resumeUrl from "../../assets/Ashwin_Gupta_Senior_AI_Engineer.pdf?url";

const KaggleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334" />
  </svg>
);

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

export function Contact() {
  const isMobile = useIsMobile();
  const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);
  const [downloadToastMessage, setDownloadToastMessage] = useState<
    string | null
  >(null);

  const copyEmailToClipboard = async () => {
    try {
      await globalThis.navigator.clipboard.writeText(
        "ashwingupta3012@gmail.com",
      );
      setCopyToastMessage("Email copied to clipboard!");
      setTimeout(() => setCopyToastMessage(null), 1600);
    } catch {
      setCopyToastMessage("Could not copy email");
      setTimeout(() => setCopyToastMessage(null), 1800);
    }
  };

  const handleResumeDownload = () => {
    setDownloadToastMessage("Resume downloaded!");
    setTimeout(() => setDownloadToastMessage(null), 1600);
  };

  const links = [
    {
      label: "Resume",
      value: "Ashwin_Gupta_Senior_AI_Engineer.pdf",
      href: resumeUrl,
      icon: <FileDown size={14} />,
      download: "Ashwin_Gupta_Senior_AI_Engineer.pdf",
    },
    {
      label: "Email",
      value: "ashwingupta3012@gmail.com",
      href: "mailto:ashwingupta3012@gmail.com",
      icon: <Mail size={14} />,
    },
    {
      label: "GitHub",
      value: "github.com/ughshwin",
      href: "https://github.com/ughshwin",
      icon: <Github size={14} />,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/ashwingupta3012",
      href: "https://www.linkedin.com/in/ashwingupta3012/",
      icon: <Linkedin size={14} />,
    },
    {
      label: "Kaggle",
      value: "kaggle.com/ashwingupta3012",
      href: "https://www.kaggle.com/ashwingupta3012",
      icon: <KaggleIcon />,
    },
    {
      label: "Location",
      value: "Bangalore, India",
      href: "https://maps.google.com/?q=Bangalore,India",
      icon: <MapPin size={14} />,
    },
  ];

  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? "4rem 4vw 3rem" : "10rem 6vw 8rem",
        background: "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "5rem",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          07 — Contact
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "3rem" : "8vw",
          alignItems: "start",
        }}
      >
        {/* LEFT — header + description */}
        <div>
          <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: FONT_SERIF,
                fontSize: isMobile
                  ? "clamp(1.8rem, 7vw, 4rem)"
                  : "clamp(2.6rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Hard problems welcome.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 8px #ef4444",
                animation: "pulse 2s infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.55)",
                textTransform: "uppercase",
              }}
            >
              Optimising: Residuals · Not: Roles
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.6)",
              maxWidth: "400px",
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            Heads-down building right now — not looking for roles. But if you've
            got a hard problem, a wild idea, or just want to talk shop about
            LLMs, distributed systems, scientific ML, or why this site is
            unreasonably over-engineered for a portfolio, I'm always up for
            that.
          </motion.p>
        </div>

        {/* RIGHT — contact links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {links.map(({ label, value, href, icon, download }, i) => (
            <motion.a
              key={i}
              href={href}
              download={download ?? undefined}
              target={
                !download && href.startsWith("http") ? "_blank" : undefined
              }
              rel={
                !download && href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              whileHover={{ x: 4 }}
              onClick={
                label === "Email"
                  ? (e) => {
                      e.preventDefault();
                      void copyEmailToClipboard();
                    }
                  : label === "Resume"
                    ? () => handleResumeDownload()
                    : undefined
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderBottomColor = "rgba(255,255,255,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderBottomColor = "rgba(255,255,255,0.05)";
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", width: "16px" }}>
                {icon}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.58rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  {label}
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <p
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                    }}
                  >
                    {value}
                  </p>
                  {(label === "Email" || label === "Resume") && (
                    <AnimatePresence mode="wait">
                      {(label === "Email"
                        ? copyToastMessage
                        : downloadToastMessage) && (
                        <motion.p
                          key={
                            label === "Email"
                              ? copyToastMessage!
                              : downloadToastMessage!
                          }
                          initial={{ opacity: 0, x: -6, scale: 0.98 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -4, scale: 0.98 }}
                          transition={{
                            duration: 0.75,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: "0.78rem",
                            color: "#4ade80",
                            border: "1px solid rgba(74,222,128,0.35)",
                            background: "rgba(74,222,128,0.06)",
                            borderRadius: "999px",
                            padding: "4px 10px",
                            whiteSpace: "nowrap",
                            margin: 0,
                          }}
                        >
                          {label === "Email"
                            ? copyToastMessage
                            : downloadToastMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.7rem",
                }}
              >
                ↗
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: isMobile ? "5rem" : "8rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
          }}
        >
          © 2026 Ashwin Gupta · AI Engineer · Bangalore, India
        </span>
      </div>
    </section>
  );
}
