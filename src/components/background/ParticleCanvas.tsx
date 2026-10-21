import { useRef, useEffect, useCallback } from 'react';
import { AGENT_NODES, CONNECTIONS } from './agentData';
import type { PageId } from './types';
import { PAGE_CONFIGS } from './agentData';

/* ─── Particle along a connection ───────────────────────── */
interface Particle {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
}

/* ─── Floating ambient particle ─────────────────────────── */
interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const MAX_STREAM_PARTICLES = 18;
const MAX_AMBIENT_PARTICLES = 25;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

export default function ParticleCanvas({ page }: { page: PageId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ambientRef = useRef<AmbientParticle[]>([]);
  const pageRef = useRef(page);
  const reducedMotion = useRef(false);

  pageRef.current = page;

  /* ─── Check reduced-motion preference ────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ─── Resize canvas to fill viewport ─────────────────── */
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
    const ctx = c.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  /* ─── Spawn data-stream particles ────────────────────── */
  const spawnStreamParticle = useCallback(() => {
    const config = PAGE_CONFIGS[pageRef.current];
    const validConns = CONNECTIONS.filter(c =>
      config.emphasized.includes(c.from) || config.emphasized.includes(c.to)
    );
    if (validConns.length === 0) return null;
    const conn = validConns[Math.floor(Math.random() * validConns.length)];
    const fromIdx = AGENT_NODES.findIndex(n => n.id === conn.from);
    const toIdx = AGENT_NODES.findIndex(n => n.id === conn.to);
    if (fromIdx < 0 || toIdx < 0) return null;
    const node = AGENT_NODES[fromIdx];
    return {
      fromIdx,
      toIdx,
      progress: 0,
      speed: 0.002 + Math.random() * 0.003,
      size: 1.5 + Math.random() * 1.5,
      color: node.color,
      opacity: 0.3 + Math.random() * 0.35,
    } as Particle;
  }, []);

  /* ─── Spawn ambient particle ─────────────────────────── */
  const spawnAmbient = useCallback((): AmbientParticle => {
    const config = PAGE_CONFIGS[pageRef.current];
    const colors = ['#3B82F6', '#22D3EE', '#8B5CF6', '#10B981', config.ambientColor];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      size: 0.5 + Math.random() * 1.2,
      opacity: 0.08 + Math.random() * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 600 + Math.random() * 800,
    };
  }, []);

  /* ─── Animation loop ─────────────────────────────────── */
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    // Seed initial particles
    particlesRef.current = [];
    ambientRef.current = [];
    for (let i = 0; i < 8; i++) {
      const p = spawnStreamParticle();
      if (p) { p.progress = Math.random(); particlesRef.current.push(p); }
    }
    for (let i = 0; i < 15; i++) {
      ambientRef.current.push(spawnAmbient());
    }

    const loop = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      if (reducedMotion.current) {
        // Static: just draw dim connections + nodes
        drawStaticNetwork(ctx, w, h, pageRef.current);
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      const config = PAGE_CONFIGS[pageRef.current];

      /* ── Draw connections ──────────────────────────── */
      for (const conn of CONNECTIONS) {
        const fromNode = AGENT_NODES.find(n => n.id === conn.from);
        const toNode = AGENT_NODES.find(n => n.id === conn.to);
        if (!fromNode || !toNode) continue;

        const isEmphasized = config.emphasized.includes(conn.from) && config.emphasized.includes(conn.to);
        const alpha = isEmphasized ? 0.08 * conn.strength : 0.03 * conn.strength;

        ctx.beginPath();
        const x1 = fromNode.x * w / 100;
        const y1 = fromNode.y * h / 100;
        const x2 = toNode.x * w / 100;
        const y2 = toNode.y * h / 100;
        // Curved path
        const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
        const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.strokeStyle = `rgba(${hexToRgb(fromNode.color).join(',')},${alpha})`;
        ctx.lineWidth = isEmphasized ? 1 : 0.5;
        ctx.stroke();
      }

      /* ── Draw agent nodes ──────────────────────────── */
      const time = Date.now() * 0.001;
      for (const node of AGENT_NODES) {
        const nx = node.x * w / 100;
        const ny = node.y * h / 100;
        const isEmphasized = config.emphasized.includes(node.id);
        const baseAlpha = isEmphasized ? 0.35 : 0.1;
        const pulseAlpha = baseAlpha + Math.sin(time * 0.8 + nx) * 0.08;

        // Outer glow
        const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.radius * 4);
        const [r, g, b] = hexToRgb(node.color);
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},${pulseAlpha * 0.4})`);
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * (isEmphasized ? 1 : 0.7), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulseAlpha})`;
        ctx.fill();

        // Label
        if (isEmphasized) {
          ctx.font = '8px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(${r},${g},${b},${pulseAlpha * 0.7})`;
          ctx.fillText(node.label, nx, ny + node.radius * 2.5);
        }
      }

      /* ── Update & draw stream particles ────────────── */
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const fromN = AGENT_NODES[p.fromIdx];
        const toN = AGENT_NODES[p.toIdx];
        const x1 = fromN.x * w / 100;
        const y1 = fromN.y * h / 100;
        const x2 = toN.x * w / 100;
        const y2 = toN.y * h / 100;
        const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
        const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
        // Quadratic bezier interpolation
        const t = p.progress;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;

        // Fade in/out at edges
        const fade = Math.min(t * 4, (1 - t) * 4, 1);
        const [pr, pg, pb] = hexToRgb(p.color);

        // Trail
        const trailGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 6);
        trailGrad.addColorStop(0, `rgba(${pr},${pg},${pb},${p.opacity * fade * 0.5})`);
        trailGrad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.opacity * fade})`;
        ctx.fill();
      }

      // Spawn new stream particles
      if (particles.length < MAX_STREAM_PARTICLES && Math.random() < 0.03) {
        const np = spawnStreamParticle();
        if (np) particles.push(np);
      }

      /* ── Update & draw ambient particles ───────────── */
      const ambient = ambientRef.current;
      for (let i = ambient.length - 1; i >= 0; i--) {
        const a = ambient[i];
        a.x += a.vx;
        a.y += a.vy;
        a.life++;
        if (a.life >= a.maxLife || a.x < -20 || a.x > w + 20 || a.y < -20 || a.y > h + 20) {
          ambient.splice(i, 1);
          continue;
        }
        const lifeFade = Math.min(a.life / 60, (a.maxLife - a.life) / 60, 1);
        const [ar, ag, ab] = hexToRgb(a.color);
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${a.opacity * lifeFade})`;
        ctx.fill();
      }

      // Spawn new ambient
      if (ambient.length < MAX_AMBIENT_PARTICLES && Math.random() < 0.02) {
        ambient.push(spawnAmbient());
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [resize, spawnStreamParticle, spawnAmbient]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Reduced-motion fallback: static network ────────────── */
function drawStaticNetwork(ctx: CanvasRenderingContext2D, w: number, h: number, page: PageId) {
  const config = PAGE_CONFIGS[page];
  for (const conn of CONNECTIONS) {
    const fromNode = AGENT_NODES.find(n => n.id === conn.from);
    const toNode = AGENT_NODES.find(n => n.id === conn.to);
    if (!fromNode || !toNode) continue;
    const alpha = config.emphasized.includes(conn.from) ? 0.06 : 0.025;
    ctx.beginPath();
    ctx.moveTo(fromNode.x * w / 100, fromNode.y * h / 100);
    ctx.lineTo(toNode.x * w / 100, toNode.y * h / 100);
    ctx.strokeStyle = `rgba(${hexToRgb(fromNode.color).join(',')},${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  for (const node of AGENT_NODES) {
    const nx = node.x * w / 100;
    const ny = node.y * h / 100;
    const isEmphasized = config.emphasized.includes(node.id);
    const [r, g, b] = hexToRgb(node.color);
    ctx.beginPath();
    ctx.arc(nx, ny, node.radius * (isEmphasized ? 0.8 : 0.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${isEmphasized ? 0.2 : 0.08})`;
    ctx.fill();
  }
}
