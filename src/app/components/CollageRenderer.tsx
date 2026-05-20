import type { ReactNode } from "react";
import type { CollageBlock } from "../../hooks/useCollageGrid";

const GAP = "1.25rem";

/**
 * Equal-row collage renderer.
 *
 * Each element of `rows` is the number of cards in that row.
 * All cards in a row receive flex:1 (equal width → equal text wrapping →
 * equal natural height → near-zero height mismatch between siblings).
 *
 * The wrapper uses display:grid so the card fills 100% of the cell's width
 * AND height. The row uses default align-items:stretch so every wrapper in
 * a row reaches the same height (the tallest sibling). This guarantees the
 * gap below every card is exactly GAP — never more, never less.
 */
interface EqualGridProps {
  rows: number[];
  renderCard: (idx: number) => ReactNode;
}

export function EqualGridRenderer({ rows, renderCard }: Readonly<EqualGridProps>) {
  let cardIdx = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
      {rows.map((n, rowIdx) => {
        const start = cardIdx;
        cardIdx += n;
        return (
          <div key={start} style={{ display: "flex", gap: GAP, alignItems: "flex-start" }}>
            {Array.from({ length: n }, (_, i) => (
              <div key={start + i} style={{ flex: 1, minWidth: 0 }}>
                {renderCard(start + i)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  blocks: CollageBlock[];
  renderCard: (idx: number) => ReactNode;
}

/**
 * Renders a sequence of CollageBlocks into a vertical stack of flex rows.
 *
 * RowBlock  → flat flex row, align-items:flex-start so each card is exactly
 *             its content height. No stretching, no empty space inside cards.
 *
 * TallBlock → one narrow "main" card on one side, two stacked cards on the
 *             other. The outer flex uses align-items:stretch so the main card
 *             wrapper matches the combined stack height. A CSS grid wrapper
 *             passes that height into the card so its footer stays pinned to
 *             the bottom via the existing marginTop:auto on the footer element.
 *             The two stacked cards keep their natural content height.
 */
export function CollageRenderer({ blocks, renderCard }: Props) {
  let cardIdx = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
      {blocks.map((block, blockIdx) => {
        if (block.kind === "tall") {
          const mainIdx =
            block.side === "left" ? cardIdx : cardIdx + 2;
          const s1Idx =
            block.side === "left" ? cardIdx + 1 : cardIdx;
          const s2Idx =
            block.side === "left" ? cardIdx + 2 : cardIdx + 1;
          cardIdx += 3;

          const mainFlex = Math.round(block.mainWeight * 100);
          const stackFlex = 100 - mainFlex;

          const mainCol = (
            // display:grid makes the card fill the wrapper's stretched height,
            // so marginTop:auto on the footer still pins it to the bottom.
            <div style={{ flex: mainFlex, minWidth: 0, display: "grid" }}>
              {renderCard(mainIdx)}
            </div>
          );

          const stackCol = (
            <div
              style={{
                flex: stackFlex,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: GAP,
              }}
            >
              {/* Stacked cards keep natural height — no forced stretch */}
              <div style={{ minWidth: 0 }}>{renderCard(s1Idx)}</div>
              <div style={{ minWidth: 0 }}>{renderCard(s2Idx)}</div>
            </div>
          );

          return (
            <div
              key={blockIdx}
              style={{ display: "flex", gap: GAP, alignItems: "stretch" }}
            >
              {block.side === "left" ? mainCol : stackCol}
              {block.side === "left" ? stackCol : mainCol}
            </div>
          );
        }

        // RowBlock: each card is exactly its content height
        const rowStart = cardIdx;
        cardIdx += block.weights.length;

        return (
          <div
            key={blockIdx}
            style={{ display: "flex", gap: GAP, alignItems: "flex-start" }}
          >
            {block.weights.map((weight, colIdx) => (
              <div
                key={colIdx}
                style={{ flex: Math.round(weight * 100), minWidth: 0 }}
              >
                {renderCard(rowStart + colIdx)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
