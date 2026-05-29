import { useRef, useEffect } from "react";
import gsap from "gsap";
import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import augmentLogoUrl from "../../assets/augmentAILogo.webp?url";
import bmsLogoUrl from "../../assets/BMSlogo.webp?url";
import coforgeLogoUrl from "../../assets/coforgeLogo.webp?url";
import guinnessLogoUrl from "../../assets/GuinnessLogo.webp?url";
import hsbcLogoUrl from "../../assets/HSBCLogo.webp?url";
import kaggleLogoUrl from "../../assets/KaggleLogo.webp?url";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';
const SPRING_ICON = "https://cdn.simpleicons.org/spring";

const highlights: { title: string; sub: string; time: string; icon: string }[] = [
  {
    title: "Augment.AI, Mentor and Founder",
    sub: "BMSCE's AI Club",
    time: "Jan 2022",
    icon: augmentLogoUrl,
  },
  {
    title: "Best Outgoing Project",
    sub: "Mechanical Engineering • BMSCE",
    time: "Aug 2024",
    icon: bmsLogoUrl,
  },
  {
    title: "Pat on Back — Think Customer Award",
    sub: "Individual Delivery Excellence • Coforge",
    time: "Dec 2024",
    icon: coforgeLogoUrl,
  },
  {
    title: "Guinness World Record",
    sub: "Command Centre Ops • Most Participants • Google Cloud | Hack2Skill",
    time: "Jul 2025",
    icon: guinnessLogoUrl,
  },
  {
    title: "Best Team Award",
    sub: "HSBC Account • Coforge",
    time: "Nov 2025",
    icon: hsbcLogoUrl,
  },
  {
    title: "Java Spring AI Trainer",
    sub: "130+ Participants • 81% voted preferred trainer • NPS +50",
    time: "Dec '25 – May '26",
    icon: SPRING_ICON,
  },
  {
    title: "$1.3M+ Annualised Savings",
    sub: "HSBC • Coforge",
    time: "Jan 2026",
    icon: hsbcLogoUrl,
  },
  {
    title: "42.8K Downloads • 202K Views",
    sub: "Human Faces Kaggle Dataset",
    time: "Present",
    icon: kaggleLogoUrl,
  },
];

const N = highlights.length; // 8

// Card dimensions
const CARD_W = 400;
const CARD_H = 175;
const COL_GAP = 24;
const ROW_GAP = 18;

// Deck: stacked at center, slight rotation and offset per card
function getDeckPos(i: number) {
  const sign = i % 2 === 0 ? 1 : -1;
  return {
    x: sign * i * 2,
    y: i * 4.5,
    rotation: sign * i * 0.9,
  };
}

// Grid: 2 columns × 4 rows, centered at origin
const COL_X = (CARD_W + COL_GAP) / 2; // horizontal offset from center
const ROW_STEP = CARD_H + ROW_GAP;
const ROW_YS = [-ROW_STEP * 1.5, -ROW_STEP * 0.5, ROW_STEP * 0.5, ROW_STEP * 1.5];

function getGridPos(i: number) {
  return {
    x: i % 2 === 0 ? -COL_X : COL_X,
    y: ROW_YS[Math.floor(i / 2)],
    rotation: 0,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeIn3(t: number) {
  return t * t * t;
}

function easeOut3(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// rotateY half-flip: 0→-90 (ease in), -90→0 (ease out)
function getFlipY(t: number): number {
  if (t <= 0.5) return -easeIn3(t * 2) * 90;
  return -(1 - easeOut3((t - 0.5) * 2)) * 90;
}

export function Awards() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fallPlayedRef = useRef(false);

  useEffect(() => {
    if (isMobile) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < N) return;

    const section = sectionRef.current!;
    const scroller = document.querySelector(".hologram-interface") as HTMLElement;
    if (!scroller) return;

    // Deterministic wide spread for fall start
    const fallStartX = highlights.map((_, i) => {
      const sign = i % 2 === 0 ? 1 : -1;
      return getDeckPos(i).x + sign * (120 + i * 60);
    });
    const fallStartRot = highlights.map((_, i) =>
      (i % 2 === 0 ? 1 : -1) * (25 + i * 10),
    );

    // Section tall enough to stay pinned while both animations play (~5s at normal scroll speed)
    const updateHeight = () => {
      section.style.height = `${scroller.clientHeight * 2.8}px`;
    };

    // ── Fall → auto deal ──
    const playFall = () => {
      gsap.set(cards, {
        x: (i) => fallStartX[i],
        y: -scroller.clientHeight * 2.8,
        rotation: (i) => fallStartRot[i],
        rotateX: -70,
        scale: 1.8,
        opacity: 0,
        transformOrigin: "center center",
        zIndex: (i) => N - i,
      });

      gsap.to(cards, {
        x: (i) => getDeckPos(i).x,
        y: (i) => getDeckPos(i).y,
        rotation: (i) => getDeckPos(i).rotation,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: "power3.out",
        stagger: { each: 0.09, from: "end" },
        onComplete: () => {
          // 1 second pause, then auto-deal to grid
          const dealTl = gsap.timeline({ delay: 1.0 });

          for (let i = 0; i < N; i++) {
            const deck = getDeckPos(i);
            const grid = getGridPos(i);
            const tStart = i * 0.14;
            const midX = (deck.x + grid.x) / 2;
            const midY = (deck.y + grid.y) / 2;

            // Bring to front while dealing
            dealTl.set(cards[i], { zIndex: N + 5 }, tStart);

            // Phase 1: deck → midpoint, card flips to edge
            dealTl.to(cards[i], {
              x: midX,
              y: midY,
              rotateY: -90,
              rotation: deck.rotation * 0.2,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.in",
            }, tStart);

            // Phase 2: midpoint → grid, card flips face-up
            dealTl.to(cards[i], {
              x: grid.x,
              y: grid.y,
              rotateY: 0,
              rotation: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            }, tStart + 0.3);

            // Settle z-index
            dealTl.set(cards[i], { zIndex: i + 1 }, tStart + 0.3);
          }
        },
      });
    };

    // Cards invisible until section pins
    gsap.set(cards, {
      opacity: 0,
      y: -scroller.clientHeight * 2.8,
      transformOrigin: "center center",
    });

    // Scroll handler: only purpose is to detect section pin and trigger fall
    const getProgress = (): number => {
      const rect = section.getBoundingClientRect();
      const budget = section.offsetHeight - scroller.clientHeight;
      if (budget <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top) / budget);
    };

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!fallPlayedRef.current && getProgress() > 0) {
          fallPlayedRef.current = true;
          playFall();
        }
      });
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(section);
    ro.observe(scroller);

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeight);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
      ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      gsap.killTweensOf(cards);
    };
  }, [isMobile]);

  // ── Mobile: static 2-col grid ──
  if (isMobile) {
    return (
      <section
        id="awards"
        style={{ background: "transparent", padding: "4rem 4vw" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              color: "rgba(245,202,64,1)",
              textTransform: "uppercase",
            }}
          >
            • The Gold and the Glory •
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.42 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <img
                  src={h.icon}
                  alt=""
                  aria-hidden
                  style={{
                    width: "18px",
                    height: "18px",
                    objectFit: "contain",
                    opacity: 0.85,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.44rem",
                    letterSpacing: "0.1em",
                    color: "rgba(245,202,64,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  {h.time}
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: "#f5ca40",
                  lineHeight: 1.2,
                  marginBottom: "4px",
                }}
              >
                {h.title}
              </div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.58rem",
                  lineHeight: 1.3,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {h.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // ── Desktop: sticky animation stage ──
  return (
    <section
      ref={sectionRef}
      id="awards"
      style={{ position: "relative", background: "transparent" }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
        }}
      >
        {/* Heading — top-center */}
        <div
          style={{
            position: "absolute",
            top: "3.5rem",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              color: "rgba(245,202,64,1)",
              textTransform: "uppercase",
            }}
          >
            • The Gold and the Glory •
          </motion.span>
        </div>

        {/* Card stage — 3D perspective anchor at viewport center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            perspective: "1200px",
          }}
        >
          {highlights.map((h, i) => (
            <div
              key={h.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                marginLeft: `-${CARD_W / 2}px`,
                marginTop: `-${CARD_H / 2}px`,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                willChange: "transform",
                cursor: "default",
              }}
            >
              {/* Icon + time row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <img
                  src={h.icon}
                  alt=""
                  aria-hidden
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                    opacity: 0.9,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.56rem",
                    letterSpacing: "0.12em",
                    color: "rgba(245,202,64,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  {h.time}
                </span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 800,
                  fontSize: "0.98rem",
                  color: "#f5ca40",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  textShadow: "0 0 14px rgba(245,202,64,0.15)",
                  flexShrink: 0,
                }}
              >
                {h.title}
              </div>

              {/* Sub */}
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.76rem",
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.38)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {h.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
