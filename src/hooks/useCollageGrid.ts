import { useMemo, useRef } from "react";
import type { CSSProperties } from "react";

// ── Span variant system ─────────────────────────────────────────────────────
// Each card gets a layout span type that maps to CSS Grid column/row spans.
// The variant controls GEOMETRY only — card content is never modified.

export type SpanVariant = "small" | "wide" | "tall" | "large" | "hero";

type SpanDef = { col: number; row: number };

const SPAN_MAP: Record<SpanVariant, SpanDef> = {
  small: { col: 2, row: 1 },  // 33% on 6-col grid — narrow
  wide:  { col: 3, row: 1 },  // 50% on 6-col grid — medium
  tall:  { col: 4, row: 1 },  // 67% on 6-col grid — wide
  large: { col: 4, row: 1 },  // alias for tall, kept for type compat
  hero:  { col: 6, row: 1 },  // 100% full-width accent, max 1 per section
};

const VARIANT_WEIGHTS: Record<SpanVariant, number> = {
  small: 0.35,
  wide:  0.40,
  tall:  0.20,
  large: 0,    // never picked directly (alias)
  hero:  0.05,
};

// ── Seeded PRNG ─────────────────────────────────────────────────────────────
// Linear congruential generator — deterministic within a session so the layout
// stays stable across re-renders but changes on page reload.

function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

// ── Variant picker ──────────────────────────────────────────────────────────

function pickVariant(
  rand: () => number,
  maxCols: number,
  largeCount: number,
  heroCount: number,
): SpanVariant {
  const eligible: [SpanVariant, number][] = [];

  for (const [v, w] of Object.entries(VARIANT_WEIGHTS)) {
    const variant = v as SpanVariant;
    const span = SPAN_MAP[variant];
    // Filter out variants that exceed available columns
    if (span.col > maxCols) continue;
    // Constraint: max 2 large cards per section
    if (variant === "large" && largeCount >= 2) continue;
    // Constraint: max 1 hero card per section
    if (variant === "hero" && heroCount >= 1) continue;
    eligible.push([variant, w]);
  }

  if (eligible.length === 0) return "small";

  const totalWeight = eligible.reduce((sum, [, w]) => sum + w, 0);
  let r = rand() * totalWeight;

  for (const [variant, weight] of eligible) {
    r -= weight;
    if (r <= 0) return variant;
  }

  return eligible[eligible.length - 1][0];
}

// ── Hook ────────────────────────────────────────────────────────────────────
// Returns an array of SpanVariant assignments, one per card.
// Seed is captured once per component mount for session consistency.

export function useCollageGrid(
  count: number,
  cols: number,
): SpanVariant[] {
  const seedRef = useRef(Math.floor(Math.random() * 2147483647));

  return useMemo(() => {
    if (cols <= 1) return Array<SpanVariant>(count).fill("small");

    const rand = seededRandom(seedRef.current);
    const variants: SpanVariant[] = [];
    let largeCount = 0;
    let heroCount = 0;

    for (let i = 0; i < count; i++) {
      const variant = pickVariant(rand, cols, largeCount, heroCount);
      variants.push(variant);
      if (variant === "large") largeCount++;
      if (variant === "hero") heroCount++;
    }

    // Fill the last row so the outer boundary is a clean rectangle.
    // Walk backwards and expand cards to absorb the column deficit.
    let totalCols = variants.reduce((s, v) => s + SPAN_MAP[v].col, 0);
    let deficit = (cols - (totalCols % cols)) % cols;

    const upgradeCandidates: SpanVariant[] = ["wide", "tall", "hero"];
    for (let i = variants.length - 1; i >= 0 && deficit > 0; i--) {
      const cur = SPAN_MAP[variants[i]].col;
      for (const candidate of upgradeCandidates) {
        const next = SPAN_MAP[candidate].col;
        const gain = next - cur;
        if (gain > 0 && gain <= deficit && next <= cols) {
          variants[i] = candidate;
          deficit -= gain;
          break;
        }
      }
    }

    return variants;
  }, [count, cols]);
}

// ── Style helper ────────────────────────────────────────────────────────────
// Column-only spanning. Row height is content-driven — different widths
// cause different text wrapping, which produces natural height variation.
// Row spanning is intentionally omitted: it inflates grid tracks and
// forces cards to fill space their content doesn't need.

export function getSpanStyle(variant: SpanVariant): CSSProperties {
  return {
    gridColumn: `span ${SPAN_MAP[variant].col}`,
  };
}

// ── Collage block layout ─────────────────────────────────────────────────────
//
// Two block kinds:
//
//  "row"  — a flat flex row of 2 or 3 cards.
//           weights[] sum to 1; use as flex-grow values.
//           align-items: flex-start → each card is exactly its content height.
//
//  "tall" — 1 narrow card alongside 2 stacked cards, spanning the same height.
//           The narrow "main" card is wider than 25 % so it wraps text into a
//           natural tall shape. The two stacked cards are wider (less wrapping)
//           so each is roughly half the main card's height.
//           The outer flex uses align-items: stretch so the main card fills the
//           combined height of the stack; a CSS grid wrapper passes that height
//           into the card component so its footer stays pinned to the bottom.
//
// No 4-card rows — they produce overly narrow, hard-to-read cards.
// TallBlock replaces the role of 4-card rows with a more readable pattern.

/** A flat flex row: 2 or 3 cards, widths proportional to weights (sum = 1). */
export type RowBlock = { kind: "row"; weights: number[] };

/**
 * A tall-card block: 1 narrow card (the "main") + 2 stacked cards.
 * Consumes exactly 3 consecutive cards.
 * side: which side the main (tall) card is on.
 * mainWeight: fraction of row width given to the main card (0–1).
 */
export type TallBlock = { kind: "tall"; side: "left" | "right"; mainWeight: number };

export type CollageBlock = RowBlock | TallBlock;

// prettier-ignore
const ROW2: number[][] = [
  [0.50, 0.50],
  [0.42, 0.58], [0.58, 0.42],
  [0.38, 0.62], [0.62, 0.38],
  [0.45, 0.55], [0.55, 0.45],
];

// prettier-ignore
const ROW3: number[][] = [
  [0.33, 0.34, 0.33],
  [0.40, 0.30, 0.30], [0.30, 0.40, 0.30], [0.30, 0.30, 0.40],
  [0.38, 0.32, 0.30], [0.30, 0.38, 0.32], [0.32, 0.30, 0.38],
];

// mainWeight options for TallBlock — narrow enough to wrap text tall,
// wide enough to stay readable (38–45 % of row width).
const TALL_WEIGHTS = [0.38, 0.40, 0.42, 0.44];

function pickWeights(rand: () => number, n: number): number[] {
  const pool = n === 3 ? ROW3 : ROW2;
  return pool[Math.floor(rand() * pool.length)];
}

function pickBlockSize(rand: () => number, remaining: number): number {
  // Never strand exactly 1 card for the next block.
  if (remaining <= 3) return remaining;
  if (remaining === 4) return 2; // → leaves 2 for the next block
  const valid = [2, 3].filter((n) => remaining - n !== 1);
  if (valid.length === 0) return 2;
  // Slight bias toward 3-card rows for variety.
  const r = rand();
  if (valid.includes(3) && r > 0.40) return 3;
  return 2;
}

/**
 * Returns a sequence of CollageBlocks describing the mosaic layout.
 *
 * Each RowBlock has weights[] (sum = 1) for 2 or 3 cards.
 * Each TallBlock covers 3 consecutive cards: 1 tall + 2 stacked.
 *
 * @param count      Total number of cards.
 * @param maxPerRow  1 = mobile (single column), 2 = tablet, 3 = desktop.
 */
// ── Equal-row collage layout ─────────────────────────────────────────────────
//
// Strategy: all cards within a row share the same width (flex:1 each).
// Equal width → equal text wrapping → equal natural height → no height
// mismatch between siblings → no ragged visual gap next to shorter cards.
//
// Visual variety comes from the row composition: rows of 1 (full-width accent),
// 2 (medium paired), or 3 (compact trio) alternate randomly per session.
// Single-card rows appear ~12 % of the time on desktop as bold accent breaks.

function pickEqualRows(count: number, rand: () => number, maxPerRow: number): number[] {
  const rows: number[] = [];
  let rem = count;

  while (rem > 0) {
    // Row size distribution — intentionally varied so each page load
    // produces a noticeably different composition:
    //   22 % → 1-card full-width accent break
    //   36 % → 2-card pair
    //   42 % → 3-card trio (capped to maxPerRow on tablet)
    //
    // Single-card rows are fully intentional (full-width accent); no
    // strand-avoidance is needed because a trailing 1-card row just
    // becomes another accent break, which looks great.
    const r = rand();
    let n: number;
    if (r < 0.22) n = 1;
    else if (r < 0.58) n = 2;
    else n = Math.min(3, maxPerRow);

    const take = Math.min(n, rem);
    rows.push(take);
    rem -= take;
  }

  return rows;
}

/**
 * Returns a session-stable sequence of row sizes for an equal-width-per-row
 * collage layout. All cards in a row share the same width (flex:1), so text
 * wraps identically → cards reach the same natural height → gaps are uniform.
 *
 * Row counts vary (1 / 2 / 3 per row) to create editorial visual rhythm.
 * Seed captured once per mount; stable across re-renders, fresh on page load.
 */
export function useEqualRows(count: number, maxPerRow: number): number[] {
  const seedRef = useRef(Math.floor(Math.random() * 2_147_483_647));
  return useMemo<number[]>(() => {
    if (maxPerRow <= 1) return Array<number>(count).fill(1);
    const rand = seededRandom(seedRef.current);
    return pickEqualRows(count, rand, maxPerRow);
  }, [count, maxPerRow]);
}

export function useCollageBlocks(count: number, maxPerRow: number): CollageBlock[] {
  const seedRef = useRef(Math.floor(Math.random() * 2_147_483_647));

  return useMemo<CollageBlock[]>(() => {
    if (maxPerRow <= 1 || count === 0) {
      return Array.from({ length: count }, () => ({ kind: "row", weights: [1] } as RowBlock));
    }

    const rand = seededRandom(seedRef.current);
    const blocks: CollageBlock[] = [];
    let remaining = count;

    while (remaining > 0) {
      // TallBlock uses 3 cards. Allow it when:
      //   • desktop (maxPerRow >= 3 implies enough width for the split)
      //   • remaining === 3 (fits perfectly) or remaining - 3 >= 2 (won't strand 1)
      const canTall =
        maxPerRow >= 3 &&
        remaining >= 3 &&
        (remaining === 3 || remaining - 3 >= 2);

      if (canTall && rand() < 0.32) {
        const side: "left" | "right" = rand() < 0.5 ? "left" : "right";
        const mainWeight = TALL_WEIGHTS[Math.floor(rand() * TALL_WEIGHTS.length)];
        blocks.push({ kind: "tall", side, mainWeight });
        remaining -= 3;
      } else {
        const n = Math.min(pickBlockSize(rand, remaining), maxPerRow);
        blocks.push({ kind: "row", weights: pickWeights(rand, n) });
        remaining -= n;
      }
    }

    return blocks;
  }, [count, maxPerRow]);
}