import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Shortest-column-first (greedy bin-packing) masonry layout hook.
 *
 * How it works
 * ────────────
 * 1. Initial render uses round-robin column assignment so React has real DOM
 *    nodes to measure.
 * 2. useLayoutEffect fires synchronously before paint, measures every item's
 *    rendered height via getBoundingClientRect, and calls pack() to compute
 *    the optimal column assignment.
 * 3. pack() runs the greedy algorithm: for each item in order, it picks the
 *    column with the smallest cumulative height and places the item there.
 *    This eliminates both staircase patterns (caused by naive document-order
 *    placement) and dead space (caused by column-fill: balance).
 * 4. setAssignment only triggers a re-render if the new assignment differs
 *    from the previous one, breaking the infinite-loop risk.
 * 5. A no-deps useLayoutEffect reconnects ResizeObserver after every render.
 *    This is necessary because when items redistribute between columns React
 *    can create new DOM nodes; the observer must track the live elements.
 *    When elements haven't resized, the observer does not fire, so no extra
 *    setState calls occur.
 * 6. When the observer fires (window resize, content change), measure() runs
 *    again and the cycle repeats.
 *
 * Gap contract
 * ────────────
 * The caller passes `gap` in pixels. The hook adds this value to each item's
 * measured height when accumulating column heights, which makes the greedy
 * algorithm account for vertical spacing correctly. The same pixel value must
 * be used as the CSS `gap` on the column containers so horizontal and vertical
 * spacing are always identical.
 */
export function useMasonry(
  count: number,
  cols: number,
  gap: number,
): { columns: number[][]; getRef: (i: number) => (el: HTMLElement | null) => void } {
  // Measured heights for each item (in px). Updated by measure() before pack().
  const heights = useRef<number[]>(Array.from({ length: count }, () => 0));

  // DOM element for each item wrapper. Populated by the stable ref callbacks.
  const els = useRef<(HTMLElement | null)[]>(
    Array.from({ length: count }, () => null),
  );

  // Stable ref-callback instances, one per item index.
  // Allocated once and reused across renders to keep ref identity stable.
  const refCbs = useRef<((el: HTMLElement | null) => void)[]>([]);

  // assignment[i] = which column index item i belongs to.
  // Initial value: round-robin so the first render has something to show.
  const [assignment, setAssignment] = useState<number[]>(() =>
    Array.from({ length: count }, (_, i) => i % cols),
  );

  // ── Greedy packer ──────────────────────────────────────────────────────────
  // Iterates items in order; at each step picks the column with the minimum
  // cumulative height and assigns the item there, then adds (height + gap) to
  // that column's tally. This is O(n × cols), fast for any reasonable card
  // count.
  const pack = useCallback(() => {
    const colH = Array<number>(cols).fill(0);
    const next = Array<number>(count).fill(0);

    for (let i = 0; i < count; i++) {
      let c = 0;
      for (let j = 1; j < cols; j++) {
        if (colH[j] < colH[c]) c = j;
      }
      next[i] = c;
      colH[c] += heights.current[i] + gap;
    }

    // Only update state if the assignment actually changed.
    setAssignment((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i])
        ? prev
        : [...next],
    );
  }, [cols, count, gap]);

  // ── Height measurement ─────────────────────────────────────────────────────
  const measure = useCallback(() => {
    let anyNonZero = false;
    for (let i = 0; i < count; i++) {
      const el = els.current[i];
      if (el) {
        const h = el.getBoundingClientRect().height;
        if (h > 0) {
          heights.current[i] = h;
          anyNonZero = true;
        }
      }
    }
    if (anyNonZero) pack();
  }, [count, pack]);

  // ── Initial measurement + first-time ResizeObserver ────────────────────────
  // Runs synchronously before first paint (useLayoutEffect) so the user never
  // sees the round-robin layout.
  useLayoutEffect(() => {
    measure();

    const ro = new ResizeObserver(measure);
    els.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measure]); // re-runs only when cols / count / gap change

  // ── ResizeObserver reconnect after every render ────────────────────────────
  // After redistribution, items may live in new DOM nodes (React unmounts from
  // old column and mounts in new column). This effect reconnects the observer
  // to whichever elements are currently live.
  // The no-deps signature is intentional: must run after every render.
  useLayoutEffect(() => {
    const ro = new ResizeObserver(measure);
    els.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  });

  // ── Stable ref-callback factory ────────────────────────────────────────────
  // Returns the same function instance for each index across all renders.
  // Stable identity prevents React from calling the ref with null + element on
  // every re-render (which would happen if the function were recreated).
  const getRef = useCallback(
    (i: number): ((el: HTMLElement | null) => void) => {
      if (!refCbs.current[i]) {
        refCbs.current[i] = (el: HTMLElement | null) => {
          els.current[i] = el;
        };
      }
      return refCbs.current[i];
    },
    [], // no deps — the closure only captures the stable refs
  );

  // ── Column arrays ──────────────────────────────────────────────────────────
  // Derive ordered arrays of item indices from the flat assignment array.
  const columns = useMemo(() => {
    const result: number[][] = Array.from({ length: cols }, () => []);
    for (let i = 0; i < count; i++) {
      const col = assignment[i];
      if (col < cols) result[col].push(i);
    }
    return result;
  }, [assignment, cols, count]);

  return { columns, getRef };
}
