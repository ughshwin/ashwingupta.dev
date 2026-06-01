import { Github, Linkedin, Mail, FileDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useCallback, useState, useEffect } from "react";
import { useIsMobile, useIsTouchDevice } from "../../hooks/useMediaQuery";
import { scrollToSection } from "../../hooks/useHashScroll";
import profilePicture from "../../assets/profilePicture.webp?url";
// @ts-ignore
import resumeUrl from "../../assets/Ashwin_Gupta_Senior_AI_Engineer.pdf?url";

const PROFILE_IMAGE = profilePicture;
const CONTACT_EMAIL = "ashwingupta3012@gmail.com";

export function Hero() {
  const isMobile = useIsMobile();
  const isTouchDevice = useIsTouchDevice();
  const layerText = useRef<HTMLDivElement>(null);
  const layerPhoto = useRef<HTMLDivElement>(null);
  const layerPills = useRef<HTMLDivElement>(null);
  const pendingRaf = useRef(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const workTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);

  const openWork = useCallback(() => {
    if (workTimerRef.current) clearTimeout(workTimerRef.current);
    setWorkOpen(true);
  }, []);

  const scheduleCloseWork = useCallback(() => {
    workTimerRef.current = setTimeout(() => setWorkOpen(false), 140);
  }, []);

  useEffect(() => {
    if (!workOpen) return;
    const handler = (e: MouseEvent) => {
      if (workRef.current && !workRef.current.contains(e.target as Node)) {
        setWorkOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [workOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const showToast = useCallback((msg: string, duration = 1600) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  }, []);

  const copyEmailToClipboard = useCallback(async () => {
    try {
      await globalThis.navigator.clipboard.writeText(CONTACT_EMAIL);
      showToast("Email copied to clipboard!");
    } catch {
      showToast("Could not copy email", 1800);
    }
  }, [showToast]);

  const handleResumeDownload = useCallback(() => {
    showToast("Resume downloaded!");
  }, [showToast]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (pendingRaf.current) return;
    const cx = e.clientX,
      cy = e.clientY;
    pendingRaf.current = requestAnimationFrame(() => {
      pendingRaf.current = 0;
      const W = window.innerWidth,
        H = window.innerHeight;
      const x = (cx / W - 0.5) * 2;
      const y = (cy / H - 0.5) * 2;
      if (layerText.current)
        layerText.current.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
      if (layerPhoto.current)
        layerPhoto.current.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg) translate(${x * 18}px, ${y * 12}px)`;
      if (layerPills.current)
        layerPills.current.style.transform = `translate(${x * 14}px, ${y * 9}px)`;
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    [layerText, layerPhoto, layerPills].forEach((r) => {
      if (r.current) {
        r.current.style.transform = "none";
        r.current.style.transition =
          "transform 0.9s cubic-bezier(0.23,1,0.32,1)";
      }
    });
  }, []);

  const onMouseEnterSection = useCallback(() => {
    [layerText, layerPhoto, layerPills].forEach((r) => {
      if (r.current) r.current.style.transition = "transform 0.08s ease-out";
    });
  }, []);

  const navBeforeWork: {
    label: string;
    href: string;
    section: string | null;
  }[] = [
    { label: "About", href: "/about", section: "about" },
    { label: "Experience", href: "/experience", section: "experience" },
    { label: "Impact", href: "/impact", section: "impact" },
  ];

  const workItems = [
    { label: "Featured", href: "/featured", section: "featured" },
    { label: "Projects", href: "/projects", section: "projects" },
  ];

  const navAfterWork: {
    label: string;
    href: string;
    section: string | null;
  }[] = [
    {
      label: "Recommendations",
      href: "/recommendations",
      section: "recommendations",
    },
    { label: "Stack", href: "/stack", section: "stack" },
    { label: "Articles", href: "/articles", section: null },
    { label: "Contact", href: "/contact", section: "contact" },
  ];

  const navLinkStyle = {
    fontFamily: '"DM Mono", monospace',
    fontSize: "0.65rem",
    letterSpacing: "0.13em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    textDecoration: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.65rem 0.4rem",
    cursor: "none",
    transition: "color 0.2s, background 0.2s",
    borderRadius: "3px",
  } as const;

  return (
    <section
      id="hero"
      onMouseMove={isTouchDevice ? undefined : onMouseMove}
      onMouseLeave={isTouchDevice ? undefined : onMouseLeave}
      onMouseEnter={isTouchDevice ? undefined : onMouseEnterSection}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "0 5.5vw" : "0 8.5vw",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Horizontal rule top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          top: isMobile ? 60 : 80,
          left: isMobile ? "5.5vw" : "8.5vw",
          right: isMobile ? "5.5vw" : "8.5vw",
          height: "1px",
          background: "rgba(255,255,255,0.08)",
          transformOrigin: "left",
          zIndex: 5,
        }}
      />

      {/* Navigation - hamburger on mobile, grid on desktop */}
      {isMobile ? (
        <>
          {/* Hamburger button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              position: "absolute",
              top: 18,
              right: "5.5vw",
              zIndex: 50,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.65)",
              cursor: "auto",
              padding: 0,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "flex" }}
                >
                  <X size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "flex" }}
                >
                  <Menu size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile full-screen overlay menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(6,6,6,0.55)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  zIndex: 40,
                  display: "flex",
                  flexDirection: "column",
                  padding: "80px 8vw 48px",
                  overflowY: "auto",
                }}
              >
                {/* All nav items */}
                <nav
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    flex: 1,
                  }}
                >
                  {navBeforeWork.map(({ label, href, section }, i) => (
                    <motion.a
                      key={href}
                      href={href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.22 }}
                      onClick={(e) => {
                        if (section) {
                          e.preventDefault();
                          setMenuOpen(false);
                          scrollToSection(section);
                          history.pushState(null, "", href);
                        }
                      }}
                      style={{
                        fontFamily: '"DM Mono", monospace',
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        padding: "1rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "block",
                      }}
                    >
                      {label}
                    </motion.a>
                  ))}

                  {/* Work expandable row */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 + navBeforeWork.length * 0.04,
                      duration: 0.22,
                    }}
                  >
                    <button
                      onClick={() => setMobileWorkOpen((v) => !v)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        padding: "1rem 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: '"DM Mono", monospace',
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        cursor: "auto",
                      }}
                    >
                      <span>Work</span>
                      <motion.span
                        animate={{ rotate: mobileWorkOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontSize: "1.5em",
                          opacity: 0.55,
                          display: "inline-block",
                        }}
                      >
                        ▾
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileWorkOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.22,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          {workItems.map(({ label, href, section }) => (
                            <a
                              key={href}
                              href={href}
                              onClick={(e) => {
                                e.preventDefault();
                                setMenuOpen(false);
                                setMobileWorkOpen(false);
                                scrollToSection(section);
                                history.pushState(null, "", href);
                              }}
                              style={{
                                display: "block",
                                fontFamily: '"DM Mono", monospace',
                                fontSize: "0.68rem",
                                letterSpacing: "0.13em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.6)",
                                textDecoration: "none",
                                padding: "0.75rem 0 0.75rem 1.25rem",
                                borderBottom:
                                  "1px solid rgba(255,255,255,0.04)",
                              }}
                            >
                              {label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {navAfterWork.map(({ label, href, section }, i) => (
                    <motion.a
                      key={href}
                      href={href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + (navBeforeWork.length + 1 + i) * 0.04,
                        duration: 0.22,
                      }}
                      onClick={(e) => {
                        if (section) {
                          e.preventDefault();
                          setMenuOpen(false);
                          scrollToSection(section);
                          history.pushState(null, "", href);
                        }
                      }}
                      style={{
                        fontFamily: '"DM Mono", monospace',
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        padding: "1rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "block",
                      }}
                    >
                      {label}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Desktop horizontal nav */
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{
            position: "absolute",
            top: 36,
            left: "5%",
            right: "5%",
            display: "grid",
            gridTemplateColumns: `repeat(${navBeforeWork.length + 1 + navAfterWork.length}, 1fr)`,
            zIndex: 5,
          }}
        >
          {navBeforeWork.map(({ label, href, section }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                if (section) {
                  e.preventDefault();
                  scrollToSection(section);
                  history.pushState(null, "", href);
                }
              }}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.9)";
                el.style.background =
                  "linear-gradient(to top, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.35)";
                el.style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}

          {/* Work ▾ dropdown */}
          <div
            ref={workRef}
            onMouseEnter={openWork}
            onMouseLeave={scheduleCloseWork}
            style={{ position: "relative", display: "flex" }}
          >
            <div
              style={{
                flex: 1,
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.58rem",
                letterSpacing: "0.13em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.35)",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "0.65rem 0.4rem",
                cursor: "none",
                transition: "color 0.2s, background 0.2s",
                borderRadius: "3px",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.9)";
                el.style.background =
                  "linear-gradient(to top, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.35)";
                el.style.background = "transparent";
              }}
            >
              <span>Work</span>
              <span
                style={{
                  fontSize: "1.5em",
                  opacity: 0.65,
                  marginTop: "0.05em",
                }}
              >
                ▾
              </span>
            </div>

            <AnimatePresence>
              {workOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={openWork}
                  onMouseLeave={scheduleCloseWork}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 2px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "0.5rem 0",
                    minWidth: "190px",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    zIndex: 20,
                  }}
                >
                  {workItems.map(({ label, href, section }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        setWorkOpen(false);
                        scrollToSection(section);
                        history.pushState(null, "", href);
                      }}
                      style={{
                        display: "block",
                        fontFamily: '"DM Mono", monospace',
                        fontSize: "0.6rem",
                        letterSpacing: "0.13em",
                        textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.4)",
                        textDecoration: "none",
                        padding: "0.75rem 1.3rem",
                        cursor: "none",
                        transition: "color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = "rgba(255,255,255,0.9)";
                        el.style.background = "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = "rgba(255,255,255,0.4)";
                        el.style.background = "transparent";
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navAfterWork.map(({ label, href, section }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                if (section) {
                  e.preventDefault();
                  scrollToSection(section);
                  history.pushState(null, "", href);
                }
              }}
              style={navLinkStyle}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.9)";
                el.style.background =
                  "linear-gradient(to top, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.35)";
                el.style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </motion.nav>
      )}

      {/* Main content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "3rem" : "4vw",
          alignItems: "center",
          paddingTop: isMobile ? "110px" : "60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT - typography */}
        <div ref={layerText} style={{ willChange: "transform" }}>
          {/* Eyebrow - tagline */}
          <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{ width: "28px", height: "1px", background: "#e8e0d0" }}
              />
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: isMobile ? "0.6rem" : "0.7rem",
                  letterSpacing: "0.12em",
                  color: "#e8e0d0",
                }}
              >
                Not what a model outputs - how the system decides, executes, and
                holds under load.
              </span>
            </motion.div>
          </div>

          {/* Giant name */}
          <div style={{ overflow: "visible", marginBottom: "-0.05em" }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                fontFamily:
                  '"Editorial New", "Playfair Display", Georgia, serif',
                fontSize: isMobile
                  ? "clamp(2.8rem, 10vw, 8.5rem)"
                  : "clamp(3.8rem, 10vw, 8.5rem)",
                fontWeight: 800,
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Ashwin
            </motion.h1>
          </div>
          <div
            style={{
              overflow: "visible",
              marginBottom: isMobile ? "2rem" : "3rem",
            }}
          >
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.65,
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                fontFamily:
                  '"Editorial New", "Playfair Display", Georgia, serif',
                fontSize: isMobile
                  ? "clamp(2.8rem, 10vw, 8.5rem)"
                  : "clamp(3.8rem, 10vw, 8.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
                display: "block",
              }}
            >
              Gupta
            </motion.h1>
          </div>

          {/* Role + Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1.5rem" : "3rem",
              marginBottom: isMobile ? "2rem" : "2.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Role
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.9rem",
                  color: "#e8e0d0",
                  lineHeight: 1.5,
                }}
              >
                AI Systems Engineer
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Company
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.9rem",
                  color: "#e8e0d0",
                  lineHeight: 1.5,
                }}
              >
                Coforge
                <br />
                Jun 2024 – Present
              </p>
            </div>
          </motion.div>

          {/* Status + socials row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.65rem",
              position: "relative",
            }}
          >
            {/* Toast - absolutely positioned so it never affects row width */}
            <AnimatePresence mode="wait">
              {toastMessage && (
                <motion.div
                  key={toastMessage}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.78rem",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,0.35)",
                    background: "rgba(74,222,128,0.06)",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    pointerEvents: "none",
                  }}
                >
                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Row 1 - icon buttons (+ Download Resume on desktop) */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {[
                {
                  href: `mailto:${CONTACT_EMAIL}`,
                  icon: <Mail size={15} />,
                  label: "Email",
                },
                {
                  href: "https://github.com/ughshwin",
                  icon: <Github size={15} />,
                  label: "GitHub",
                },
                {
                  href: "https://www.linkedin.com/in/ashwingupta3012/",
                  icon: <Linkedin size={15} />,
                  label: "LinkedIn",
                },
              ].map(({ href, icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  onClick={
                    href.startsWith("mailto:")
                      ? (e) => {
                          e.preventDefault();
                          void copyEmailToClipboard();
                        }
                      : undefined
                  }
                  whileHover={{ y: -2 }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    flexShrink: 0,
                    cursor: isMobile ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#e8e0d0";
                    el.style.color = "#e8e0d0";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  {icon}
                </motion.a>
              ))}
              {/* Download Resume - desktop only in this row */}
              {!isMobile && (
                <motion.a
                  href={resumeUrl}
                  download="Ashwin_Gupta_Senior_AI_Engineer.pdf"
                  onClick={handleResumeDownload}
                  whileHover={{ y: -2 }}
                  style={{
                    height: "38px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    cursor: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#e8e0d0";
                    el.style.color = "#e8e0d0";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  <FileDown size={14} strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Download Resume
                  </span>
                </motion.a>
              )}
            </div>

            {/* Row 2 - Download Resume, mobile only */}
            {isMobile && (
              <motion.a
                href={resumeUrl}
                download="Ashwin_Gupta_Senior_AI_Engineer.pdf"
                onClick={handleResumeDownload}
                whileHover={{ y: -2 }}
                style={{
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  cursor: "auto",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#e8e0d0";
                  el.style.color = "#e8e0d0";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                <FileDown size={14} strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.62rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Download Resume
                </span>
              </motion.a>
            )}

            {/* Building not Browsing status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
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
                Optimising: Residuals • Not: Roles
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT - photo */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "relative",
            width: isMobile ? "76%" : "74%",
            margin: isMobile ? "0 auto" : "0 2vw 0 auto",
          }}
        >
          <div
            ref={layerPhoto}
            style={{ willChange: "transform", borderRadius: "4px" }}
          >
            {/* Photo */}
            <div
              style={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
                aspectRatio: "3/4",
              }}
            >
              <img
                src={PROFILE_IMAGE}
                alt="Ashwin Gupta"
                width={800}
                height={1734}
                fetchPriority="high"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "50% 15%",
                  filter: "grayscale(20%) contrast(1.05)",
                }}
              />
              {/* Dark bottom fade */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 40%, transparent 70%)",
                }}
              />
            </div>

            {/* Caption below image */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                gap: isMobile ? "0.5rem" : "0",
                marginTop: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                }}
              >
                MLOps & GenAI - IIIT Bangalore
              </span>
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                }}
              >
                PyTorch • LLMs • RAG • GCP
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
