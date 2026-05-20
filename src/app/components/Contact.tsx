import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TiltCard } from "./TiltCard";
import { Mail, Github, Linkedin, MapPin, Send, FileDown } from "lucide-react";
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
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);
  const [downloadToastMessage, setDownloadToastMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mzdjpglw", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
          05 — Contact
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
        {/* LEFT */}
        <div>
          <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: FONT_SERIF,
                fontSize: isMobile
                  ? "clamp(1.6rem, 7vw, 3.2rem)"
                  : "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Let's build something that matters.
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
                fontFamily: FONT_MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
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
              marginBottom: "2.5rem",
            }}
          >
            Heads-down building right now — not looking for roles. But if you've
            got a hard problem, a wild idea, or just want to talk shop about
            LLMs, distributed systems, scientific ML, or why this site is
            unreasonably over-engineered for a portfolio, I'm always up for that.
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {links.map(({ label, value, href, icon, download }, i) => (
              <motion.a
                key={i}
                href={href}
                download={download ?? undefined}
                target={!download && href.startsWith("http") ? "_blank" : undefined}
                rel={
                  !download && href.startsWith("http") ? "noopener noreferrer" : undefined
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
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                        {(label === "Email" ? copyToastMessage : downloadToastMessage) && (
                          <motion.p
                            key={label === "Email" ? copyToastMessage! : downloadToastMessage!}
                            initial={{ opacity: 0, x: -6, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -4, scale: 0.98 }}
                            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
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
                            {label === "Email" ? copyToastMessage : downloadToastMessage}
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
          </div>
        </div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <TiltCard
            intensity={5}
            style={{
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.11)",
              background: "rgba(255,255,255,0.025)",
              padding: isMobile ? "1.2rem" : "2.5rem",
            }}
          >
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: "2rem",
              }}
            >
              Send a message
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  padding: "3rem 1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "1px solid rgba(74,222,128,0.4)",
                    background: "rgba(74,222,128,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "#fafaf8",
                    margin: 0,
                  }}
                >
                  Message sent.
                </p>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                  }}
                >
                  Thanks for reaching out — I'll get back to you soon.
                </p>
                <motion.button
                  onClick={() => setStatus("idle")}
                  whileHover={{ background: "rgba(255,255,255,0.08)" }}
                  style={{
                    marginTop: "0.5rem",
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(0,0,0,0)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Send another
                </motion.button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                {[
                  { name: "name", placeholder: "Your name", type: "text" },
                  { name: "email", placeholder: "Your email", type: "email" },
                ].map(({ name, placeholder, type }) => (
                  <input
                    key={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.9rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      padding: "14px 16px",
                      color: "#e8e0d0",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) =>
                      ((e.target as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.45)")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.08)")
                    }
                  />
                ))}
                <textarea
                  name="message"
                  placeholder="What's on your mind?"
                  rows={isMobile ? 4 : 5}
                  required
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.9rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px",
                    padding: "14px 16px",
                    color: "#e8e0d0",
                    outline: "none",
                    resize: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    ((e.target as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.45)")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.08)")
                  }
                />

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      color: "#f87171",
                      margin: 0,
                    }}
                  >
                    Something went wrong. Please try again or email directly.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ background: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    background: "#e8e0d0",
                    color: "#0a0a0a",
                    border: "none",
                    borderRadius: "4px",
                    padding: "14px 24px",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "background 0.2s",
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                >
                  {status === "sending" ? "Sending..." : "Send message"}{" "}
                  {status !== "sending" && <Send size={14} />}
                </motion.button>
              </form>
            )}
          </TiltCard>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: isMobile ? "flex" : "flex",
          justifyContent: isMobile ? "center" : "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1rem" : "0",
          textAlign: isMobile ? "center" : "left",
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
          © 2026 Ashwin Gupta — Personal Portfolio
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
          }}
        >
          AI Engineer — Bangalore, India
        </span>
      </div>
    </section>
  );
}
