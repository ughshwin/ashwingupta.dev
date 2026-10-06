import { useEffect, useRef, useState, type CSSProperties } from "react";
import { m } from "motion/react";
import { useKaggleDatasetStats } from "../../hooks/useKaggleDatasetStats";
import { formatKaggleCount, KAGGLE_DATASET_URL } from "../../lib/kaggle-stats";
import {
  impacts,
  CATEGORY_META,
  type Impact as ImpactMetric,
  type ImpactCategory,
} from "./impactData";
import "./Impact.css";
import { SlotNumber, type NumberRoll } from "./SlotNumber";

// Keep categories intact and pair similar result counts for balanced columns.
const OUTCOME_ORDER: ImpactCategory[] = [
  "scale", "cost", "accuracy", "reliability", "reach", "systems", "research",
];

const groups = OUTCOME_ORDER.map((category) => ({
  category,
  items: impacts.filter((metric) => metric.category === category),
})).filter((group) => group.items.length > 0)
  .sort((a, b) => b.items.length - a.items.length);

const categoryRows = [groups.slice(0, 3), groups.slice(3, 5), groups.slice(5)]
  .filter((row) => row.length > 0);

function Metric({ metric, freshness, roll }: Readonly<{
  metric: ImpactMetric;
  roll: NumberRoll;
  freshness?: { label: string; detail: string; live: boolean };
}>) {
  const external = metric.href?.startsWith("http");
  const content = (
    <>
      <SlotNumber value={metric.value} live={!!freshness} roll={roll} />
      <span className="impact-outcome-copy">
        <span className="impact-outcome-label">{metric.label}</span>
        <span className="impact-outcome-source">
          {metric.item}
          {metric.href && <span aria-hidden="true"> ↗</span>}
        </span>
      </span>
      {freshness && (
        <span className={`impact-outcome-freshness${freshness.live ? " is-live" : ""}`} title={freshness.detail}>
          <span className="impact-outcome-status-dot" aria-hidden="true" />
          {freshness.label}
        </span>
      )}
    </>
  );

  return (
    <li className={`impact-outcome-metric${freshness ? " impact-outcome-metric-live" : ""}`} data-kaggle-stat={metric.liveStat}>
      {metric.href ? (
        <a
          className="impact-outcome-readout"
          href={metric.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={`${metric.value}: ${metric.label}. ${metric.item}.${freshness ? ` ${freshness.label}. ${freshness.detail}` : ""} View project.`}
        >
          {content}
        </a>
      ) : (
        <div className="impact-outcome-readout">{content}</div>
      )}
    </li>
  );
}

function KaggleMetric({ metric, roll }: Readonly<{ metric: ImpactMetric & { liveStat: NonNullable<ImpactMetric["liveStat"]> }; roll: NumberRoll }>) {
  const { counts, stats, status } = useKaggleDatasetStats();
  const displayMetric = {
    ...metric,
    href: KAGGLE_DATASET_URL,
    value: formatKaggleCount(counts[metric.liveStat]),
  };
  const freshness = {
    label: status === "live" ? "Live" : "Recorded",
    live: status === "live",
    detail: stats
      ? `Checked on Kaggle at ${new Date(stats.checkedAt).toLocaleTimeString("en-US")}. ${status === "live" ? "Refreshes every minute while this page is visible." : "Showing the last successful count; refresh is temporarily unavailable."}`
      : "Recorded dataset count. The latest count will appear when Kaggle responds.",
  };
  return <Metric metric={displayMetric} freshness={freshness} roll={roll} />;
}

function OutcomeColumn({ category, items }: Readonly<(typeof groups)[number]>) {
  const column = useRef<HTMLElement>(null);
  const [roll, setRoll] = useState<NumberRoll>({ cycle: 0, active: false });

  useEffect(() => {
    const table = column.current;
    const root = table?.closest<HTMLElement>(".hologram-interface");
    if (!table || !root) return;
    let observer: IntersectionObserver | undefined;
    let fillsViewport = false;
    const update = () => {
      const active = fillsViewport && !document.hidden;
      setRoll((previous) => previous.active === active
        ? previous
        : { active, cycle: previous.cycle + (active ? 1 : 0) });
    };
    const observe = () => {
      observer?.disconnect();
      const height = table.getBoundingClientRect().height;
      // Short tables must fit in view; tall tables must fill the viewport.
      const threshold = height > 0 ? Math.min(height, root.clientHeight) / height * 0.98 : 1;
      observer = new IntersectionObserver(([entry]) => {
        fillsViewport = entry.isIntersecting && entry.intersectionRatio >= threshold;
        update();
      }, { root, threshold: [0, threshold] });
      observer.observe(table);
    };
    const resize = new ResizeObserver(observe);
    resize.observe(table);
    resize.observe(root);
    observe();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section
      ref={column}
      className="impact-outcome-column"
      aria-labelledby={`impact-category-${category}`}
      style={{ "--impact-outcome-color": CATEGORY_META[category].color } as CSSProperties}
    >
      <h3 id={`impact-category-${category}`} className="impact-outcome-heading">
        {CATEGORY_META[category].label}
      </h3>
      <ul className="impact-outcome-list">
        {items.map((metric) => metric.liveStat
          ? <KaggleMetric key={metric.liveStat} metric={{ ...metric, liveStat: metric.liveStat }} roll={roll} />
          : <Metric key={`${metric.item}-${metric.value}`} metric={metric} roll={roll} />)}
      </ul>
    </section>
  );
}

export function Impact() {
  return (
    <section id="impact" className="impact-outcomes" aria-labelledby="impact-heading">
      <div className="impact-outcomes-inner">
        <div className="impact-outcomes-kicker"><span>Impact</span></div>
        <div className="impact-outcomes-heading-wrap">
          <m.h2
            id="impact-heading"
            className="impact-outcomes-heading"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            Proof, not promises.
          </m.h2>
        </div>
        <p className="impact-outcomes-intro">
          Measurable results across performance, efficiency, quality, and beyond.
        </p>
        <div className="impact-outcomes-rows">
          {categoryRows.map((row) => (
            <div
              key={row[0].category}
              className="impact-outcomes-grid"
              style={{ "--impact-outcome-columns": row.length } as CSSProperties}
            >
              {row.map((group) => <OutcomeColumn key={group.category} {...group} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
