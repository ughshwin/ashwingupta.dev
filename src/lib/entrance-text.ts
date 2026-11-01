type Seed = { x: number; y: number };

export function assembleEntranceText(shell: HTMLElement) {
  let resolve!: () => void;
  const finished = new Promise<void>(done => { resolve = done; });
  let frame = 0;
  let cancelled = false;
  const canvas = document.createElement('canvas');
  canvas.className = 'entrance-text-particles';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width = innerWidth, H = canvas.height = innerHeight;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const title = shell.querySelector<HTMLElement>('#entrance-title')!;
  const titleRect = title.getBoundingClientRect();
  const mask = document.createElement('canvas');
  mask.width = W; mask.height = H;
  const ink = mask.getContext('2d', { willReadFrequently: true })!;
  // Render complete lines, preserving kerning, letter spacing and italic tilt.
  for (const line of title.querySelectorAll<HTMLElement>('.entrance-title-line')) {
    const style = getComputedStyle(line);
    const rect = line.getBoundingClientRect();
    ink.save();
    ink.font = style.fontStyle + ' ' + style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
    ink.letterSpacing = style.letterSpacing;
    ink.textAlign = 'center';
    ink.textBaseline = 'alphabetic';
    ink.fillStyle = style.color;
    ink.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
    if (line.tagName === 'EM') ink.rotate(-3 * Math.PI / 180);
    const metrics = ink.measureText(line.textContent!);
    const baseline = (metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
    ink.fillText(line.textContent!, 0, baseline);
    ink.restore();
  }
  const pixels = ink.getImageData(0, 0, W, H).data;
  const targets: Seed[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    if (pixels[(y * W + x) * 4 + 3] > 100) targets.push({ x, y });
  }
  // Shuffle once, then distribute every source across the glyphs without
  // replacing sources: X ambient particles produce exactly X text particles.
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const ease = (v: number) => v * v * (3 - 2 * v);
  const stop = () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    canvas.remove();
    shell.style.setProperty('--headline-solid', '1');
    window.removeEventListener('portfolio:text-seeds', receive);
    window.removeEventListener('pagehide', stop);
    resolve();
  };
  const receive = (event: Event) => {
    const seeds = (event as CustomEvent<Seed[]>).detail;
    if (!seeds.length || !targets.length) { stop(); return; }
    shell.prepend(canvas);
    canvas.dataset.particleCount = String(seeds.length);
    const dots = seeds.map((seed, i) => ({
      x0: seed.x, y0: seed.y, ...targets[i % targets.length],
      delay: Math.random() * 450, bend: (Math.random() - .5) * 130,
      radius: .7 + Math.random() * .65,
    }));
    // The complete DOM headline participates in the same crossfade as the dots.
    // A separate growth mask would multiply its opacity and delay visibility.
    shell.style.setProperty('--headline-solid', '0');
    let last = 0, elapsed = 0;
    const draw = (now: number) => {
      if (cancelled) return;
      elapsed += last ? Math.min(now - last, 1000 / 24) : 0;
      last = now;
      // Finish gathering, hold the dotted letters, then crossfade both layers.
      const fill = clamp((elapsed - 3800) / 2400);
      // One shared crossfade: both layers start and finish on the same frames.
      const headlineOpacity = ease(fill);
      shell.style.setProperty('--headline-solid', String(headlineOpacity));
      canvas.dataset.stage = elapsed < 3250 ? 'gathering' : elapsed < 3800 ? 'dotted-headline' : 'solidifying';
      canvas.dataset.elapsed = String(Math.round(elapsed));
      canvas.dataset.fill = fill.toFixed(3);
      ctx.clearRect(0, 0, W, H);
      const currentRect = title.getBoundingClientRect();
      for (const dot of dots) {
        const t = clamp((elapsed - dot.delay) / 2800);
        const travel = t * t * t * (t * (t * 6 - 15) + 10);
        const bend = Math.sin(Math.PI * travel) * dot.bend;
        const targetX = currentRect.x + (dot.x - titleRect.x) / titleRect.width * currentRect.width;
        const targetY = currentRect.y + (dot.y - titleRect.y) / titleRect.height * currentRect.height;
        const x = dot.x0 + (targetX - dot.x0) * travel + bend;
        const y = dot.y0 + (targetY - dot.y0) * travel - bend * .4;
        ctx.globalAlpha = (.35 + .6 * travel) * (1 - headlineOpacity);
        const pixel = (dot.y * W + dot.x) * 4;
        const tint = ease(clamp(fill / .6));
        const red = Math.round(216 + (pixels[pixel] - 216) * tint);
        const green = Math.round(238 + (pixels[pixel + 1] - 238) * tint);
        const blue = Math.round(233 + (pixels[pixel + 2] - 233) * tint);
        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.beginPath(); ctx.arc(x, y, dot.radius, 0, Math.PI * 2); ctx.fill();
      }
      if (elapsed >= 6200) { stop(); return; }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  };
  window.addEventListener('portfolio:text-seeds', receive, { once: true });
  window.addEventListener('pagehide', stop, { once: true });
  return { stop, finished };
}
