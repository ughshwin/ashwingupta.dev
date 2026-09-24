import { useEffect, useRef } from "react";
import { ASSEMBLY_MS, RELEASE_MS, smoothstep, momentumDistance } from '../../lib/entrance-motion';

interface OrbitState {
  orbitAngle: number;
  orbitBand: number;
  orbitSpeed: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  drawX: number;
  drawY: number;
  impulseX: number;
  impulseY: number;
  momentumX: number;
  momentumY: number;
  releaseElapsed: number;
  releaseDecay: number;
}

function orbitState(): OrbitState {
 return { orbitAngle: 0, orbitBand: Math.random(), orbitSpeed: 0, startX: 0, startY: 0, driftX: 0, driftY: 0, drawX: 0, drawY: 0, impulseX: 0, impulseY: 0, momentumX: 0, momentumY: 0, releaseElapsed: 0, releaseDecay: .34 };
}

function releaseOrbit(mote: OrbitState, W: number, H: number) {
  // Independent viewport destinations break up the ring without a central focus.
  // Keep each destination in its source hemisphere to avoid crossing the centre.
  const radialX = mote.drawX - W / 2;
  const radialY = mote.drawY - H / 2;
  let targetX = Math.random() * W;
  let targetY = Math.random() * H;
  if ((targetX - W / 2) * radialX + (targetY - H / 2) * radialY < 0) {
    targetX = W - targetX;
    targetY = H - targetY;
  }
  mote.releaseDecay = .18 + Math.random() * .38;
  // Immediate burst with random drag; normalized travel prevents a dense shell.
  mote.impulseX = (targetX - mote.drawX) / mote.releaseDecay;
  mote.impulseY = (targetY - mote.drawY) / mote.releaseDecay;
  mote.momentumX = -mote.driftX;
  mote.momentumY = -mote.driftY;
  mote.releaseElapsed = 0;
}

interface Node extends OrbitState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  activationTimer: number;
  activationDuration: number;
  layer: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface Particle extends OrbitState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
}

// ── Dust mote (replaces ParticleField DOM nodes) ──────────────────────────
interface DustMote extends OrbitState {
  baseX: number;
  baseY: number;
  travelX: number;
  travelY: number;
  kink1X: number;
  kink1Y: number;
  kink2X: number;
  kink2Y: number;
  pathDuration: number;
  shimmerDuration: number;
  phase: number;
  size: number;
  baseOpacity: number;
  isNear: boolean;
  mouseOffX: number;
  mouseOffY: number;

}

// ── Black monochrome palette with white accents ─────────────────────────────
const BG = "0,0,0";
const NODE_BRIGHT = "rgba(255,255,255,";
const EDGE_COLOR = "255,255,255";
const PARTICLE_COLOR = "255,255,255";

const getNodeCount = (isMobile: boolean) => (isMobile ? 40 : 110);
const getParticleCount = (isMobile: boolean) => (isMobile ? 40 : 75);
const getConnectionDist = (isMobile: boolean) => (isMobile ? 80 : 500);
const getDustMoteCount = (isMobile: boolean) => (isMobile ? 80 : 600);

const PACKET_INTERVAL = 20;
const PACKET_SPEED_MIN = 0.001;
const PACKET_SPEED_MAX = 0.004;
const NODE_SPEED = 0.4;

// ── Breeze-path keyframe stops (matching CSS @keyframes breeze-path) ──────
const BREEZE_KEYFRAMES = [
  { t: 0.0, mx: -0.52, my: -0.52, kx: 0, ky: 0 },
  { t: 0.22, mx: -0.22, my: -0.2, kx: 0, ky: 0 },
  { t: 0.36, mx: -0.08, my: -0.06, kx: 1, ky: 1 },
  { t: 0.51, mx: 0.1, my: 0.1, kx: 0, ky: 0 },
  { t: 0.67, mx: 0.26, my: 0.24, kx: 2, ky: 2 },
  { t: 0.82, mx: 0.42, my: 0.4, kx: 0, ky: 0 },
  { t: 1.0, mx: 0.56, my: 0.56, kx: 0, ky: 0 },
];

function breezePosition(
  mote: DustMote,
  progress: number,
  W: number,
  H: number,
): { x: number; y: number } {
  const p = progress % 1;
  let i = 0;
  for (; i < BREEZE_KEYFRAMES.length - 1; i++) {
    if (p < BREEZE_KEYFRAMES[i + 1].t) break;
  }
  const a = BREEZE_KEYFRAMES[i];
  const b = BREEZE_KEYFRAMES[i + 1] || a;
  const segT = b.t === a.t ? 0 : (p - a.t) / (b.t - a.t);

  const lerpX =
    a.mx * mote.travelX + segT * (b.mx * mote.travelX - a.mx * mote.travelX);
  const lerpY =
    a.my * mote.travelY + segT * (b.my * mote.travelY - a.my * mote.travelY);

  // Add kink offsets (kx=1 means kink1, kx=2 means kink2)
  let kinkOffX = 0,
    kinkOffY = 0;
  if (a.kx === 1) {
    kinkOffX = mote.kink1X * (1 - segT);
    kinkOffY = mote.kink1Y * (1 - segT);
  } else if (a.kx === 2) {
    kinkOffX = mote.kink2X * (1 - segT);
    kinkOffY = mote.kink2Y * (1 - segT);
  }
  if (b.kx === 1) {
    kinkOffX += mote.kink1X * segT;
    kinkOffY += mote.kink1Y * segT;
  } else if (b.kx === 2) {
    kinkOffX += mote.kink2X * segT;
    kinkOffY += mote.kink2Y * segT;
  }

  return {
    x: (mote.baseX / 100) * W + lerpX + kinkOffX,
    y: (mote.baseY / 100) * H + lerpY + kinkOffY,
  };
}

function shimmerOpacity(phase: number): number {
  const t = phase % 1;
  const ease = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
  return 0.07 + 0.15 * ease; // 0.07–0.22, faint background ambience
}

export function AIBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const packetsRef = useRef<Packet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dustMotesRef = useRef<DustMote[]>([]);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scanlinesRef = useRef<HTMLCanvasElement | null>(null);
  const edgeCacheRef = useRef<Array<{ i: number; j: number; fade: number }>>(
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    // Read actual media at initialization, before React's hydration effects.
    const isMobile = matchMedia('(max-width: 767px)').matches;
    const isTouchDevice = matchMedia('(hover: none) and (pointer: coarse)').matches;
    let entrance = document.documentElement.dataset.entrance || 'done';
    let phaseTime = performance.now();
    let assemblyElapsed = 0;
    let lastTime = 0;
    let tick = 0;
    let releaseTime = 0;
    let drawCost = 0;
    const onEntrance = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      canvas.dataset.entrancePhase = next;
      if (next === 'revealing') return; // Keep the release trajectory uninterrupted.
      if (next === 'assembling') {
        assemblyElapsed = 0;
        window.dispatchEvent(new CustomEvent('portfolio:text-seeds', {
          detail: [...dustMotesRef.current, ...nodesRef.current, ...particlesRef.current]
            .map(mote => ({ x: mote.drawX, y: mote.drawY })),
        }));
      }
      if (next === 'assembling' || next === 'releasing') {
        const W = canvas.width, H = canvas.height;
        for (const mote of dustMotesRef.current) {
          const progress = ((frameRef.current / mote.pathDuration) + mote.phase) % 1;
          const position = breezePosition(mote, progress, W, H);
          const future = breezePosition(mote, Math.min(progress + 1 / mote.pathDuration, .999999), W, H);
          mote.driftX = (future.x - position.x) * 60;
          mote.driftY = (future.y - position.y) * 60;
          if (next === 'assembling') {
            mote.startX = mote.drawX;
            mote.startY = mote.drawY;
            mote.orbitAngle = Math.atan2(mote.drawY - H / 2, mote.drawX - W / 2);
          } else {
            // Move the existing path origin to the current particle, then add
            // decaying momentum. The original path keeps running underneath.
            mote.baseX += (mote.drawX - position.x) / W * 100;
            mote.baseY += (mote.drawY - position.y) / H * 100;
            releaseOrbit(mote, W, H);
            mote.mouseOffX = mote.mouseOffY = 0;
          }
        }
      }
      if (next === 'assembling' || next === 'releasing') {
        for (const dot of [...nodesRef.current, ...particlesRef.current]) {
          dot.driftX = dot.vx * 60; dot.driftY = dot.vy * 60;
          if (next === 'assembling') {
            dot.startX = dot.x; dot.startY = dot.y;
            dot.orbitAngle = Math.atan2(dot.y - canvas.height / 2, dot.x - canvas.width / 2);
            dot.orbitSpeed = Math.hypot(dot.vx, dot.vy);
          } else releaseOrbit(dot, canvas.width, canvas.height);
        }
      }
      entrance = next;
      phaseTime = performance.now();
      if (next === 'releasing') releaseTime = phaseTime;
    };
    window.addEventListener('portfolio:entrance', onEntrance);

    // Cache soft particle sprites once instead of hundreds of shadowBlur passes.
    const sprites = [false, true].map(near => {
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 48;
      const c = sprite.getContext('2d')!;
      const glow = c.createRadialGradient(24, 24, 0, 24, 24, 24);
      glow.addColorStop(0, 'rgba(248,250,255,1)');
      glow.addColorStop(.10, 'rgba(248,250,255,.9)');
      glow.addColorStop(.22, near ? 'rgba(205,230,239,.18)' : 'rgba(229,236,252,.12)');
      glow.addColorStop(1, 'rgba(229,236,252,0)');
      c.fillStyle = glow;
      c.fillRect(0, 0, 48, 48);
      return sprite;
    });

    const NODE_COUNT = getNodeCount(isMobile);
    const PARTICLE_COUNT = getParticleCount(isMobile);
    const CONNECTION_DIST = getConnectionDist(isMobile);
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const DUST_MOTE_COUNT = isMobile && document.documentElement.dataset.entrance ? 160 : getDustMoteCount(isMobile);

    // ── mouse tracking (disabled on touch devices) ────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── pre-render scanlines to offscreen canvas ──────────────────────────
    const buildScanlines = (w: number, h: number) => {
      const sc = document.createElement("canvas");
      sc.width = w;
      sc.height = h;
      const sctx = sc.getContext("2d")!;
      sctx.fillStyle = "rgba(255,255,255,0.015)";
      for (let y = 0; y < h; y += 4) {
        sctx.fillRect(0, y, w, 1);
      }
      scanlinesRef.current = sc;
    };

    // ── resize (viewport height only - canvas is position:fixed) ──────────
    const resize = () => {
      if (canvas.width === window.innerWidth && canvas.height === window.innerHeight) return;
      const oldW = canvas.width, oldH = canvas.height;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Resize existing trajectories, never replace the particles during a morph.
      for (const n of [...nodesRef.current, ...particlesRef.current]) {
        n.x *= canvas.width / oldW;
        n.y *= canvas.height / oldH;
      }
      for (const mote of dustMotesRef.current) {
        mote.travelX *= canvas.width / oldW;
        mote.travelY *= canvas.height / oldH;
      }
      for (const mote of [...dustMotesRef.current, ...nodesRef.current, ...particlesRef.current]) {
        mote.orbitSpeed *= canvas.width / oldW;
        mote.startX *= canvas.width / oldW;
        mote.startY *= canvas.height / oldH;
        mote.drawX *= canvas.width / oldW;
        mote.drawY *= canvas.height / oldH;
        mote.driftX *= canvas.width / oldW;
        mote.driftY *= canvas.height / oldH;
        mote.impulseX *= canvas.width / oldW;
        mote.impulseY *= canvas.height / oldH;
        mote.momentumX *= canvas.width / oldW;
        mote.momentumY *= canvas.height / oldH;
      }
      if (!isMobile) {
        buildScanlines(canvas.width, canvas.height);
      }
    };

    // ── init nodes ────────────────────────────────────────────────────────
    const initNodes = () => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => {
        const layer = Math.floor(Math.random() * 3);
        const speed = NODE_SPEED * (0.5 + layer * 0.3);
        return {
          ...orbitState(),
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: 0.8 + layer * 0.4 + Math.random() * 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.04 + Math.random() * 0.03,
          layer,
          activationTimer: 0,
          activationDuration: 30 + Math.floor(Math.random() * 25),
        };
      });
    };

    // ── init floating particles (the small bouncing dots) ─────────────────
    const initParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        ...orbitState(),
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 0.5 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.3,
        life: Math.random(),
      }));
    };

    // ── init dust motes (replaces ParticleField DOM) ──────────────────────
    const initDustMotes = () => {
      dustMotesRef.current = Array.from({ length: DUST_MOTE_COUNT }, (_, index) => {
        const isNear = Math.random() < 0.42;
        const horizontalDir = Math.random() < 0.86 ? 1 : -1;
        // Convert vw/vh to approximate pixels (based on viewport)
        const vwPx = canvas.width / 100;
        const vhPx = canvas.height / 100;
        const mote: DustMote = {
          baseX: Math.random() * 100,
          baseY: Math.random() * 100,
          travelX:
            horizontalDir *
            (isNear ? 60 + Math.random() * 58 : 40 + Math.random() * 40) *
            vwPx,
          travelY:
            (isNear ? -18 + Math.random() * 36 : -12 + Math.random() * 24) *
            vhPx,
          kink1X: isNear ? -16 + Math.random() * 32 : -10 + Math.random() * 20,
          kink1Y: isNear ? -12 + Math.random() * 24 : -8 + Math.random() * 16,
          kink2X: isNear ? -14 + Math.random() * 28 : -9 + Math.random() * 18,
          kink2Y: isNear ? -10 + Math.random() * 20 : -7 + Math.random() * 14,
          pathDuration: isNear
            ? (22 + Math.random() * 16) * 60
            : (32 + Math.random() * 22) * 60,
          shimmerDuration: isNear
            ? (4.2 + Math.random() * 2.4) * 60
            : (6 + Math.random() * 3) * 60,
          phase: Math.random(),
          size: isNear ? 2.8 + Math.random() * 4 : 1.5 + Math.random() * 2.6,
          baseOpacity: isNear
            ? 0.33 + Math.random() * 0.36
            : 0.2 + Math.random() * 0.28,
          isNear,
          mouseOffX: 0,
          mouseOffY: 0,
          orbitAngle: (index / DUST_MOTE_COUNT) * Math.PI * 2,
          orbitBand: Math.random(),
          orbitSpeed: 0,
          startX: 0, startY: 0, driftX: 0, driftY: 0,
          drawX: 0, drawY: 0, impulseX: 0, impulseY: 0,
          momentumX: 0, momentumY: 0, releaseElapsed: 0, releaseDecay: .34,
        };
        // Match tangential ring speed to the actual breeze path's mean px/frame.
        let length = 0;
        let previous = breezePosition(mote, 0, canvas.width, canvas.height);
        for (let s = 1; s <= 20; s++) {
          const next = breezePosition(mote, s / 20 * .9999, canvas.width, canvas.height);
          length += Math.hypot(next.x - previous.x, next.y - previous.y);
          previous = next;
        }
        mote.orbitSpeed = length / mote.pathDuration;
        return mote;
      });
    };

    // ── spawn packet ──────────────────────────────────────────────────────
    const spawnPacket = () => {
      const nodes = nodesRef.current;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const from = nodes[fromIdx];

      const candidates: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].x - from.x;
        const dy = nodes[i].y - from.y;
        if (dx * dx + dy * dy < CONNECTION_DIST_SQ) candidates.push(i);
      }
      if (candidates.length === 0) return;

      const toIdx = candidates[Math.floor(Math.random() * candidates.length)];
      nodes[fromIdx].activationTimer = nodes[fromIdx].activationDuration;

      packetsRef.current.push({
        fromNode: fromIdx,
        toNode: toIdx,
        progress: 0,
        speed:
          PACKET_SPEED_MIN +
          Math.random() * (PACKET_SPEED_MAX - PACKET_SPEED_MIN),
      });
    };

    // ── draw grid pattern ─────────────────────────────────────────────────
    const drawGrid = (time: number) => {
      const W = canvas.width,
        H = canvas.height;
      const gridSize = 50;
      const offset = (time * 0.02) % gridSize;

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;

      for (let x = -offset; x < W + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -offset; y < H + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    };

    // ── draw loop ─────────────────────────────────────────────────────────
    const draw = (now = performance.now()) => {
      const drawStart = import.meta.env.DEV ? performance.now() : 0;
      const dt = Math.min(lastTime ? (now - lastTime) / (1000 / 60) : 1, 2.5);
      lastTime = now;
      tick++;
      const assembling = entrance === 'assembling';
      const releasing = entrance === 'releasing';
      const inRing = assembling || entrance === 'ready' || entrance === 'selected';
      // Use rendered time, not wall time: font sampling or a slow frame must
      // never skip the middle of the gathering motion. Ready is a UI state,
      // not permission to snap an unfinished trajectory onto the ring.
      if (inRing) assemblyElapsed = Math.min(ASSEMBLY_MS, assemblyElapsed + dt * (1000 / 60));
      const assembly = inRing ? smoothstep(assemblyElapsed / ASSEMBLY_MS) : 0;
      const release = releasing ? smoothstep((now - releaseTime) / RELEASE_MS) : 0;
      const ringMix = releasing ? 1 - release : assembly;
      const nodes = nodesRef.current;
      const packets = packetsRef.current;
      const particles = particlesRef.current;
      const dustMotes = dustMotesRef.current;
      const W = canvas.width,
        H = canvas.height;

      // Pure black background
      ctx.fillStyle = `rgba(${BG},1)`;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid (skip on mobile)
      if (!isMobile) {
        drawGrid(frameRef.current);
      }

      // Scanlines via pre-rendered offscreen canvas (skip on mobile)
      if (!isMobile && scanlinesRef.current) {
        ctx.drawImage(scanlinesRef.current, 0, 0);
      }

      frameRef.current += dt;
      if (tick % PACKET_INTERVAL === 0 && ringMix < .1) spawnPacket();
      const ringRadius = Math.min(H * .35, W * .42);

      // ── draw dust motes (replaces 500 DOM ParticleField nodes) ──────────
      const placeInRing = (mote: OrbitState, drawX: number, drawY: number) => {
        const radius = ringRadius * (.94 + mote.orbitBand * .24);
        mote.orbitAngle += mote.orbitSpeed / Math.max(1, radius) * dt;
        const angle = mote.orbitAngle;

        if (inRing) {
          const seconds = assemblyElapsed / 1000;
          const blend = smoothstep((assemblyElapsed - mote.orbitBand * 500) / (ASSEMBLY_MS - 500));
          const startX = mote.startX + mote.driftX * seconds - W / 2;
          const startY = mote.startY + mote.driftY * seconds - H / 2;
          const startAngle = Math.atan2(startY, startX);
          const angleDifference = Math.atan2(Math.sin(angle - startAngle), Math.cos(angle - startAngle));
          const flowingAngle = startAngle + angleDifference * blend;
          const flowingRadius = Math.hypot(startX, startY) * (1 - blend) + radius * blend;
          drawX = W / 2 + Math.cos(flowingAngle) * flowingRadius;
          drawY = H / 2 + Math.sin(flowingAngle) * flowingRadius;
        }
        mote.drawX = drawX;
        mote.drawY = drawY;

      };
      const moveDot = (dot: Node | Particle) => {
        dot.x += dot.vx * dt; dot.y += dot.vy * dt;
        if (dot.impulseX || dot.impulseY || dot.momentumX || dot.momentumY) {
          const before = dot.releaseElapsed, after = before + dt / 60;
          const kick = momentumDistance(after, dot.releaseDecay) - momentumDistance(before, dot.releaseDecay);
          const carry = momentumDistance(after, .24) - momentumDistance(before, .24);
          dot.x += dot.impulseX * kick + dot.momentumX * carry;
          dot.y += dot.impulseY * kick + dot.momentumY * carry;
          dot.releaseElapsed = after;
          if (after > 4) {
            dot.impulseX = dot.impulseY = dot.momentumX = dot.momentumY = 0;
            dot.releaseElapsed = 0;
          }
        }
        placeInRing(dot, dot.x, dot.y);
        dot.x = dot.drawX; dot.y = dot.drawY;
        if (!inRing && dot.releaseElapsed === 0) {
          if (dot.x < 0 || dot.x > W) dot.vx = dot.x < 0 ? Math.abs(dot.vx) : -Math.abs(dot.vx);
          if (dot.y < 0 || dot.y > H) dot.vy = dot.y < 0 ? Math.abs(dot.vy) : -Math.abs(dot.vy);
          dot.x = Math.max(0, Math.min(W, dot.x));
          dot.y = Math.max(0, Math.min(H, dot.y));
        }
      };

      for (const mote of dustMotes) {
        if (mote.impulseX || mote.impulseY || mote.momentumX || mote.momentumY) {
          const before = mote.releaseElapsed;
          const after = before + dt / 60;
          const kick = momentumDistance(after, mote.releaseDecay) - momentumDistance(before, mote.releaseDecay);
          const carry = momentumDistance(after, .24) - momentumDistance(before, .24);
          mote.baseX += (mote.impulseX * kick + mote.momentumX * carry) / W * 100;
          mote.baseY += (mote.impulseY * kick + mote.momentumY * carry) / H * 100;
          mote.releaseElapsed = after;
          if (after > 4) {
            mote.impulseX = mote.impulseY = mote.momentumX = mote.momentumY = 0;
            mote.releaseElapsed = 0;
          }
        }
        const pathProgress =
          ((frameRef.current + mote.phase * mote.pathDuration) %
            mote.pathDuration) /
          mote.pathDuration;
        const shimmerProgress =
          ((frameRef.current + mote.phase * mote.shimmerDuration) %
            mote.shimmerDuration) /
          mote.shimmerDuration;

        const pos = breezePosition(mote, pathProgress, W, H);
        const opacity = shimmerOpacity(shimmerProgress);

        // Mouse repulsion - spring offset decays back to zero
        if (!isTouchDevice && entrance === 'done' && mote.releaseElapsed === 0) {
          const mdx = pos.x - mouseRef.current.x;
          const mdy = pos.y - mouseRef.current.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const MOUSE_R = 150;
          if (mDistSq < MOUSE_R * MOUSE_R && mDistSq > 0) {
            const mDist = Math.sqrt(mDistSq);
            const force = ((MOUSE_R - mDist) / MOUSE_R) * 42;
            mote.mouseOffX += (mdx / mDist) * force;
            mote.mouseOffY += (mdy / mDist) * force;
          }
        }
        mote.mouseOffX *= 0.85;
        mote.mouseOffY *= 0.85;
        // cap displacement so motes don't fly off screen
        const CAP = 200;
        if (mote.mouseOffX > CAP) mote.mouseOffX = CAP;
        if (mote.mouseOffX < -CAP) mote.mouseOffX = -CAP;
        if (mote.mouseOffY > CAP) mote.mouseOffY = CAP;
        if (mote.mouseOffY < -CAP) mote.mouseOffY = -CAP;
        placeInRing(mote, pos.x + mote.mouseOffX, pos.y + mote.mouseOffY);
        const drawX = mote.drawX, drawY = mote.drawY;
        // Skip if offscreen
        if (drawX < -50 || drawX > W + 50 || drawY < -50 || drawY > H + 50)
          continue;

        ctx.globalAlpha = opacity + ringMix * (mote.isNear ? .25 : .15);
        const size = mote.size * (5 - ringMix * 1.2);
        ctx.drawImage(sprites[mote.isNear ? 1 : 0], drawX - size / 2, drawY - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // ── move and draw small bouncing particles ──────────────────────────
      for (const p of particles) {
        moveDot(p);
        p.life += 0.01 * dt;
        p.alpha = 0.2 + Math.sin(p.life) * 0.15;



        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR},${p.alpha})`;
        ctx.fill();
      }

      // ── move nodes with mouse interaction ───────────────────────────────
      const mouse = mouseRef.current;
      for (const n of nodes) {
        moveDot(n);
        n.pulse += n.pulseSpeed * dt;
        if (n.activationTimer > 0) n.activationTimer--;

        if (!isTouchDevice && entrance === 'done' && n.releaseElapsed === 0) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 32400 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (180 - dist) / 180;
            n.x += (dx / dist) * force * 5.5;
            n.y += (dy / dist) * force * 5.5;
          }
        }


      }

      // ── rebuild edge cache every 3 frames (O(n²) amortised) ────────────
      if (tick % 3 === 0 && ringMix < .99) {
        const cache: typeof edgeCacheRef.current = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < CONNECTION_DIST_SQ) {
              cache.push({
                i,
                j,
                fade: 1 - Math.sqrt(distSq) / CONNECTION_DIST,
              });
            }
          }
        }
        edgeCacheRef.current = cache;
      }

      // ── draw edges from cache ────────────────────────────────────────────
      ctx.globalAlpha = 1 - ringMix;
      ctx.lineWidth = 0.3;
      for (const edge of edgeCacheRef.current) {
        const isActive =
          nodes[edge.i].activationTimer > 0 ||
          nodes[edge.j].activationTimer > 0;
        const alpha = isActive ? edge.fade * 0.18 : edge.fade * 0.05;
        ctx.beginPath();
        ctx.moveTo(nodes[edge.i].x, nodes[edge.i].y);
        ctx.lineTo(nodes[edge.j].x, nodes[edge.j].y);
        ctx.strokeStyle = `rgba(${EDGE_COLOR},${alpha.toFixed(3)})`;
        ctx.stroke();
      }

      // ── draw nodes (flat fill for inactive, gradient only for active) ───
      ctx.globalAlpha = 1;
      for (const n of nodes) {
        const ps = 1 + Math.sin(n.pulse) * 0.25;
        const isActive = n.activationTimer > 0;
        const frac = n.activationTimer / n.activationDuration;

        if (isActive) {
          // Core dot only, dimmed
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * ps, 0, Math.PI * 2);
          ctx.fillStyle = `${NODE_BRIGHT}${(frac * 0.25).toFixed(3)})`;
          ctx.fill();
        } else {
          // Inactive nodes: single small flat dot
          const coreAlpha = 0.08 + n.layer * 0.04;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * ps, 0, Math.PI * 2);
          ctx.fillStyle = `${NODE_BRIGHT}${coreAlpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // ── draw packets with enhanced trails ───────────────────────────────
      ctx.globalAlpha = 1 - ringMix;
      packetsRef.current = packets.filter((p) => {
        p.progress += p.speed * dt;
        if (p.progress >= 1) {
          nodes[p.toNode].activationTimer = nodes[p.toNode].activationDuration;
          return false;
        }

        const from = nodes[p.fromNode],
          to = nodes[p.toNode];
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;

        const t0 = Math.max(0, p.progress - 0.25);
        const tx = from.x + (to.x - from.x) * t0;
        const ty = from.y + (to.y - from.y) * t0;

        const tg = ctx.createLinearGradient(tx, ty, px, py);
        tg.addColorStop(0, "rgba(255,255,255,0)");
        tg.addColorStop(0.6, "rgba(255,255,255,0.06)");
        tg.addColorStop(1, "rgba(255,255,255,0.12)");
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const hg = ctx.createRadialGradient(px, py, 0, px, py, 3);
        hg.addColorStop(0, "rgba(255,255,255,0.18)");
        hg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;
      if (import.meta.env.DEV) {
        drawCost += performance.now() - drawStart;
        if (tick % 120 === 0) {
          canvas.dataset.averageDrawMs = (drawCost / 120).toFixed(2);
          drawCost = 0;
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    // ── debounced resize ──────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    // ── visibility guard - pause RAF when tab hidden ──────────────────────
    let initialized = false;
    let disposed = false;
    let initTimer: ReturnType<typeof setTimeout> | undefined;
    let initIdle: number | undefined;
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else if (initialized && !disposed) {
        cancelAnimationFrame(animRef.current);
        lastTime = 0;
        draw();
      }
    };

    // Size canvas immediately (trivial), defer heavy init to idle
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const runInit = () => {
      if (disposed) return;
      initialized = true;
      initNodes();
      initParticles();
      initDustMotes();
      if (!isMobile) buildScanlines(canvas.width, canvas.height);
      canvas.dataset.particlesReady = 'true';
      canvas.dataset.motion = 'full';
      canvas.dataset.entrancePhase = entrance;
      window.dispatchEvent(new Event('portfolio:particles-ready'));
      if (!document.hidden) draw();
    };

    if (document.documentElement.dataset.entrance) {
      runInit();
    } else if (typeof requestIdleCallback === "undefined") {
      initTimer = setTimeout(runInit, 100);
    } else {
      initIdle = requestIdleCallback(runInit, { timeout: 1000 });
    }

    window.addEventListener("resize", debouncedResize);
    document.addEventListener("visibilitychange", handleVisibility);
    const ro = new ResizeObserver(debouncedResize);
    ro.observe(document.body);

    return () => {
      disposed = true;
      clearTimeout(initTimer);
      if (initIdle !== undefined) cancelIdleCallback(initIdle);
      cancelAnimationFrame(animRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('portfolio:entrance', onEntrance);
      document.removeEventListener("visibilitychange", handleVisibility);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
