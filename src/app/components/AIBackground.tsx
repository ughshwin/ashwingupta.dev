import { useEffect, useRef } from "react";
import { useIsMobile, useIsTouchDevice } from "../../hooks/useMediaQuery";

interface Node {
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
}

// ── Dust mote (replaces ParticleField DOM nodes) ──────────────────────────
interface DustMote {
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
}

// ── Black monochrome palette with white accents ─────────────────────────────
const BG = "0,0,0";
const NODE_BRIGHT = "rgba(255,255,255,";
const EDGE_COLOR = "255,255,255";
const PARTICLE_COLOR = "255,255,255";

const getNodeCount = (isMobile: boolean) => (isMobile ? 40 : 90);
const getParticleCount = (isMobile: boolean) => (isMobile ? 20 : 60);
const getConnectionDist = (isMobile: boolean) => (isMobile ? 80 : 400);
const getDustMoteCount = (isMobile: boolean) => (isMobile ? 60 : 400);

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
  const isMobile = useIsMobile();
  const isTouchDevice = useIsTouchDevice();
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

    const NODE_COUNT = getNodeCount(isMobile);
    const PARTICLE_COUNT = getParticleCount(isMobile);
    const CONNECTION_DIST = getConnectionDist(isMobile);
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const DUST_MOTE_COUNT = getDustMoteCount(isMobile);

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

    // ── resize (viewport height only — canvas is position:fixed) ──────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
      initParticles();
      initDustMotes();
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
      dustMotesRef.current = Array.from({ length: DUST_MOTE_COUNT }, () => {
        const isNear = Math.random() < 0.42;
        const horizontalDir = Math.random() < 0.86 ? 1 : -1;
        // Convert vw/vh to approximate pixels (based on viewport)
        const vwPx = canvas.width / 100;
        const vhPx = canvas.height / 100;
        return {
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
        };
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
    const draw = () => {
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

      frameRef.current++;
      if (frameRef.current % PACKET_INTERVAL === 0) spawnPacket();

      // ── draw dust motes (replaces 500 DOM ParticleField nodes) ──────────
      for (const mote of dustMotes) {
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

        // Skip if offscreen
        if (pos.x < -50 || pos.x > W + 50 || pos.y < -50 || pos.y > H + 50)
          continue;

        // ctx.shadowBlur directly replicates CSS box-shadow — zero gradient allocations
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = mote.isNear ? 24 : 14;
        ctx.shadowColor = mote.isNear
          ? "rgba(235,242,255,0.56)"
          : "rgba(229,236,252,0.34)";
        ctx.fillStyle = "rgba(248,250,255,0.97)";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, mote.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── move and draw small bouncing particles ──────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.01;
        p.alpha = 0.2 + Math.sin(p.life) * 0.15;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR},${p.alpha})`;
        ctx.fill();
      }

      // ── move nodes with mouse interaction ───────────────────────────────
      const mouse = mouseRef.current;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.activationTimer > 0) n.activationTimer--;

        if (!isTouchDevice) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 22500 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (150 - dist) / 150;
            n.x += (dx / dist) * force * 2;
            n.y += (dy / dist) * force * 2;
          }
        }

        if (n.x < 0 || n.x > W) {
          n.vx *= -1;
          n.x = Math.max(0, Math.min(W, n.x));
        }
        if (n.y < 0 || n.y > H) {
          n.vy *= -1;
          n.y = Math.max(0, Math.min(H, n.y));
        }
      }

      // ── rebuild edge cache every 3 frames (O(n²) amortised) ────────────
      if (frameRef.current % 3 === 0) {
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
      packetsRef.current = packets.filter((p) => {
        p.progress += p.speed;
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

      animRef.current = requestAnimationFrame(draw);
    };

    // ── debounced resize ──────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    // ── visibility guard — pause RAF when tab hidden ──────────────────────
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        draw();
      }
    };

    // Size canvas immediately (trivial), defer heavy init to idle
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const runInit = () => {
      initNodes();
      initParticles();
      initDustMotes();
      if (!isMobile) buildScanlines(canvas.width, canvas.height);
      draw();
    };

    if (typeof requestIdleCallback === "undefined") {
      setTimeout(runInit, 100);
    } else {
      requestIdleCallback(runInit, { timeout: 1000 });
    }

    window.addEventListener("resize", debouncedResize);
    document.addEventListener("visibilitychange", handleVisibility);
    const ro = new ResizeObserver(debouncedResize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
