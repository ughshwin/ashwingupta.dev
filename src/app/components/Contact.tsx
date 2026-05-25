import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const headerGapRef = useRef<HTMLDivElement>(null);
  const maxOffsetRef = useRef(0);
  const cachedTopRef = useRef<number | null>(null);

  const [vpH, setVpH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const [sectionH, setSectionH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );

  const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);
  const [downloadToastMessage, setDownloadToastMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      const header = headerRef.current;
      const inner = innerRef.current;
      if (!header || !inner) return;
      const vh = window.innerHeight;
      const headerH = header.offsetHeight;
      const contentH = inner.scrollHeight;
      const stripH = Math.max(0, vh - headerH);
      const maxOffset = Math.max(0, contentH - stripH);
      maxOffsetRef.current = maxOffset;
      cachedTopRef.current = null;
      setVpH(vh);
      setSectionH(vh + maxOffset);
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section) return;

    const measureTop = () => {
      let acc = 0;
      let el: HTMLElement | null = section;
      while (el && el !== scroller) {
        acc += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      cachedTopRef.current = acc;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (cachedTopRef.current === null) measureTop();
        const raw = scroller.scrollTop - (cachedTopRef.current ?? 0);
        const offset = Math.max(0, Math.min(maxOffsetRef.current, raw));
        if (innerRef.current) {
          innerRef.current.style.transform = `translateY(-${offset}px)`;
        }
        const compressRatio = Math.min(1, offset / 100);
        const gapPx = 80 * (1 - compressRatio) + 20 * compressRatio;
        if (headerGapRef.current) {
          headerGapRef.current.style.marginBottom = `${gapPx}px`;
        }
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        cachedTopRef.current = null;
      },
      { passive: true },
    );
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  useLayoutEffect(() => {
    if (isMobile) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section || !innerRef.current) return;
    let acc = 0;
    let el: HTMLElement | null = section;
    while (el && el !== scroller) {
      acc += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    cachedTopRef.current = acc;
    const raw = scroller.scrollTop - acc;
    const offset = Math.max(0, Math.min(maxOffsetRef.current, raw));
    innerRef.current.style.transform = `translateY(-${offset}px)`;
    if (headerGapRef.current) {
      const compressRatio = Math.min(1, offset / 100);
      headerGapRef.current.style.marginBottom = `${80 * (1 - compressRatio) + 20 * compressRatio}px`;
    }
  }, [isMobile, sectionH]);

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
      ref={sectionRef}
      id="contact"
      style={{
        position: "relative",
        height: isMobile ? "auto" : sectionH,
        background: "transparent",
        ...(isMobile && { padding: "4rem 4vw 3rem" }),
      }}
    >
      <div
        style={
          isMobile
            ? {}
            : {
                position: "sticky",
                top: 0,
                height: vpH,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }
        }
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={isMobile ? {} : { padding: "0.85rem 6vw 2rem" }}
        >
          <div
            ref={headerGapRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: isMobile ? "2rem" : "80px",
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
              Contact
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>
          <div style={{ overflow: "hidden" }}>
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
        </div>

        {/* Content strip */}
        <div
          style={
            isMobile
              ? {}
              : { flex: 1, position: "relative", overflow: "hidden" }
          }
        >
          <div
            ref={innerRef}
            style={
              isMobile
                ? { paddingTop: "2rem" }
                : {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem 6vw 4rem",
                  }
            }
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "3rem" : "8vw",
                alignItems: "start",
              }}
            >
              {/* LEFT - description */}
              <div>
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
                  Heads-down building right now - not looking for roles. But if
                  you've got a hard problem, a wild idea, or just want to talk
                  shop about LLMs, distributed systems, scientific ML, or why
                  this site is unreasonably over-engineered for a portfolio, I'm
                  always up for that.
                </motion.p>
              </div>

              {/* RIGHT - contact links */}
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
                      !download && href.startsWith("http")
                        ? "_blank"
                        : undefined
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
                    <span
                      style={{ color: "rgba(255,255,255,0.4)", width: "16px" }}
                    >
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
