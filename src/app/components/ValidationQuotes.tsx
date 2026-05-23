import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const quotes = [
  {
    text: "Technically strong, dependable, and proactive. Consistently delivered production-ready code with strong technical ownership.",
    name: "Raja Sekhar Amirapu",
    title: "Senior Technical Architect",
    company: "Coforge",
  },
  {
    text: "He would keep an open mind, welcome challenges, and think to deliver an end-to-end solution. Attitude to continue trying under pressure and deliver.",
    name: "Kartik Mehta",
    title: "Fraud VS Technology Lead",
    company: "HSBC (client)",
  },
  {
    text: "Ashwin is a risk-taker, never shying away from trying innovative approaches — and what sets him apart is his ability to convert those risks into successful implementations.",
    name: "Tulsi Patro",
    title: "AI Engineer",
    company: "Gida Technologies",
  },
];

export function ValidationQuotes() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: isMobile ? "2rem 4vw" : "4rem 6vw",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : `repeat(${quotes.length}, 1fr)`,
          gap: isMobile ? "1.5rem" : "2vw",
        }}
      >
        {quotes.map((quote, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            style={{
              padding: "1.4rem 1.4rem 1.4rem 1.6rem",
              borderLeft: "2px solid rgba(232,224,208,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.88rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.68)",
                margin: 0,
                fontStyle: "normal",
              }}
            >
              "{quote.text}"
            </p>
            <div>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.55)",
                  margin: "0 0 1px",
                }}
              >
                — {quote.name}
              </p>
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.56rem",
                  letterSpacing: "0.07em",
                  color: "rgba(255,255,255,0.28)",
                  margin: 0,
                }}
              >
                {quote.title} · {quote.company}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
