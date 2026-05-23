import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const recs = [
  {
    name: "Arun Kumar Vastrakar",
    title: "Senior Delivery Director",
    company: "Coforge",
    relationship: "Delivery Head · HSBC AI · Pat on Back award",
    date: "Nov 2024",
    text: "Ashwin showed a great flexibility and stretched to complete a challenging task which resulted in client's delight. He was able to code a logic which client's other partner could not do it. Well done Ashwin.",
  },
  {
    name: "Raja Sekhar Amirapu",
    title: "Senior Technical Architect",
    company: "Coforge",
    relationship: "Direct colleague · HSBC project",
    date: "Nov 2025",
    text: "Ashwin's work on the telephony ingestion layer — PJSIP-based, highly stable, low-latency SIP call-handling at scale — was technically precise. Technically strong, dependable, and proactive. He consistently delivered production-ready code with strong technical ownership, and enhanced the development workflow through automation. Highly recommended for roles in VoIP engineering, real-time media systems, or conversational-AI infrastructure.",
  },
  {
    name: "Snehasish Chakraborty",
    title: "GCP Infrastructure Engineer",
    company: "HSBC (client)",
    relationship: "Client · HSBC",
    date: "Feb 2025",
    text: "I had the pleasure of working with Ashwin on a highly complex GCP infrastructure setup, where his expertise in scalability, testing, and debugging proved invaluable. He played a crucial role in designing and implementing the scalability logic, ensuring our infrastructure could handle increasing workloads efficiently. His structured approach to testing helped identify potential bottlenecks early, saving us from critical failures down the line.",
  },
  {
    name: "Kartik Mehta",
    title: "Fraud VS Technology Lead",
    company: "HSBC (client)",
    relationship: "Client · HSBC",
    date: "Feb 2025",
    text: "He would keep an open mind, welcome challenges, and think to deliver an end-to-end solution. I rate Ashwin highly — not just for his knowledge and skills, but his attitude to continue trying under pressure and deliver. I'm sure he will be adding great value wherever he works.",
  },
  {
    name: "Tulsi Patro",
    title: "AI Engineer",
    company: "Gida Technologies",
    relationship: "Direct colleague",
    date: "Nov 2023",
    text: "Ashwin is a risk-taker, never shying away from trying innovative approaches — and what sets him apart is his ability to convert those risks into successful implementations. His commitment to meeting deadlines while upholding the quality of work is a testament to his professionalism. Fearlessness in taking on challenges inspires the entire team to push boundaries and strive for excellence.",
  },
];

function RecCard({
  rec,
  index,
  isVisible,
}: {
  rec: (typeof recs)[number];
  index: number;
  isVisible: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      style={{
        padding: isMobile ? "1.4rem 1.4rem 1.4rem 1.6rem" : "1.6rem 1.6rem 1.6rem 1.8rem",
        borderLeft: "2px solid rgba(232,224,208,0.18)",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeftWidth: "2px",
        borderLeftColor: "rgba(232,224,208,0.2)",
        borderRadius: "6px",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      {/* Header: name + role */}
      <div>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "#e8e0d0",
            margin: "0 0 2px",
            lineHeight: 1.3,
          }}
        >
          {rec.name}
        </p>
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.56rem",
            letterSpacing: "0.07em",
            color: "rgba(255,255,255,0.35)",
            margin: 0,
          }}
        >
          {rec.title} · {rec.company}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* Quote */}
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: "0.88rem",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.62)",
          margin: 0,
          fontStyle: "normal",
          flex: 1,
        }}
      >
        "{rec.text}"
      </p>

      {/* Footer metadata */}
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.52rem",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.22)",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {rec.relationship} · {rec.date}
      </p>
    </motion.div>
  );
}

export function Recommendations() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="recommendations"
      style={{
        padding: isMobile ? "4rem 4vw" : "6rem 6vw",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: isMobile ? "2.5rem" : "4rem",
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
          Recommendations
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />
      </div>

      {/* Section header */}
      <div style={{ overflow: "hidden", marginBottom: isMobile ? "2.5rem" : "4rem" }}>
        <motion.h2
          initial={{ y: "100%" }}
          animate={isVisible ? { y: 0 } : { y: "100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: isMobile
              ? "clamp(1.8rem, 7vw, 4rem)"
              : "clamp(2.6rem, 4.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#fafaf8",
            margin: 0,
          }}
        >
          In their words.
        </motion.h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "1.2rem" : "1.5rem",
        }}
      >
        {recs.map((rec, i) => (
          <RecCard key={rec.name} rec={rec} index={i} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
}
