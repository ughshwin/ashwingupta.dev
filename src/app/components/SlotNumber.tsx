import { useEffect, useRef } from "react";

export type NumberRoll = { cycle: number; active: boolean };

/** A single reel moves the complete value, with its original typography. */
export function SlotNumber({ value, live, roll }: Readonly<{ value: string; live?: boolean; roll: NumberRoll }>) {
  const element = useRef<HTMLSpanElement>(null);
  const active = useRef(roll.active);
  active.current = roll.active;

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const visual = node.querySelector<HTMLElement>(".impact-slot-visual")!;
    let animation: Animation | undefined;
    let disposed = false;
    const numeric = /\d/.test(value);

    const restore = () => {
      animation?.cancel();
      animation = undefined;
      visual.replaceChildren(document.createTextNode(node.dataset.value!));
      node.dataset.reelState = "settled";
    };

    const spin = () => {
      if (disposed || !active.current || document.hidden || !numeric || roll.cycle === 0) return;
      restore();
      node.dataset.reelState = "spinning";
      const height = visual.getBoundingClientRect().height;
      const steps = 34 + Math.floor(Math.random() * 7);
      const track = document.createElement("span");
      track.className = "impact-slot-track";
      let previous = value;
      for (let step = 0; step <= steps; step++) {
        let faceValue = value;
        // The final value sits at the top; the strip travels down toward it.
        if (step > 0) {
          faceValue = value.replace(/\d/g, () => String(Math.floor(Math.random() * 10)));
          if (faceValue === previous) faceValue = faceValue.replace(/\d/, digit => String((Number(digit) + 1) % 10));
        }
        previous = faceValue;
        const face = document.createElement("span");
        face.textContent = faceValue;
        track.append(face);
      }
      visual.replaceChildren(track);
      animation = track.animate([
        { transform: `translateY(${-steps * height}px)`, filter: "blur(0.65px)" },
        { transform: "translateY(0)", filter: "blur(0)" },
      ], { duration: 2800, easing: "cubic-bezier(0.12, 0.62, 0.2, 1)", fill: "both" });
      animation.onfinish = () => { if (!disposed) restore(); };
    };

    node.dataset.reelState = numeric && roll.cycle === 0 ? "waiting" : "settled";
    document.fonts.ready.then(spin);
    const onVisibilityChange = () => { if (document.hidden) restore(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      restore();
    };
  }, [value, roll.cycle]);

  return (
    <span
      ref={element}
      className={`impact-outcome-value${value.length > 9 ? " impact-outcome-value-long" : ""}`}
      data-value={value}
      aria-live={live ? "polite" : undefined}
      aria-atomic={live ? true : undefined}
    >
      <span className="impact-slot-accessible">{value}</span>
      <span className="impact-slot-visual" aria-hidden="true">{value}</span>
    </span>
  );
}
