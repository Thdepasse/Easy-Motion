export interface AnimationConfig {
  text: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  speed: number; // 0.5 – 2.0
  size: number;  // 0.5 – 1.5
}

export const DEFAULT_CONFIG: AnimationConfig = {
  text: "EASY MOTION",
  primaryColor: "#a855f7",
  secondaryColor: "#ec4899",
  bgColor: "#0d0d0d",
  speed: 1,
  size: 1,
};

type DrawFn = (ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) => void;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ─── Shape helpers ───────────────────────────────────────────────────────────

function drawCirclePulse(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const cx = w / 2, cy = h / 2;
  const maxR = Math.min(w, h) * 0.38 * cfg.size;
  for (let i = 3; i >= 0; i--) {
    const phase = (t + i * 0.25) % 1;
    const r = maxR * phase;
    const alpha = (1 - phase) * 0.6;
    const { r: pr, g: pg, b: pb } = hexToRgb(cfg.primaryColor);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${pr},${pg},${pb},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // core
  const coreR = maxR * 0.22;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawWaveform(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const lines = 3;
  for (let l = 0; l < lines; l++) {
    const phase = t + l * 0.15;
    const alpha = 0.4 + l * 0.3;
    const amp = (h * 0.12 + l * 8) * cfg.size;
    const { r, g, b } = hexToRgb(l < 1 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = h / 2 + Math.sin((x / w) * Math.PI * 4 + phase * Math.PI * 2) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2 + l;
    ctx.stroke();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const count = 30;
  const seed = 42;
  for (let i = 0; i < count; i++) {
    const angle = ((i / count) * Math.PI * 2) + t * Math.PI * 2 * 0.3;
    const dist = (0.2 + ((i * seed) % 7) / 10) * Math.min(w, h) * 0.45 * cfg.size;
    const x = w / 2 + Math.cos(angle) * dist;
    const y = h / 2 + Math.sin(angle) * dist * 0.6;
    const r = 2 + ((i * seed) % 4);
    const alpha = 0.3 + Math.abs(Math.sin(t * Math.PI * 2 + i)) * 0.6;
    const { r: pr, g: pg, b: pb } = hexToRgb(i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.beginPath();
    ctx.arc(x, y, r * cfg.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${pr},${pg},${pb},${alpha})`;
    ctx.fill();
  }
}

function drawLines(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const count = 5;
  for (let i = 0; i < count; i++) {
    const progress = (t + i / count) % 1;
    const lineW = lerp(w * 0.1, w * 0.85, progress) * cfg.size;
    const yBase = h * 0.3 + i * (h * 0.1);
    const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
    const { r, g, b } = hexToRgb(i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.beginPath();
    ctx.roundRect(w / 2 - lineW / 2, yBase, lineW, 5 * cfg.size, 3);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.9})`;
    ctx.fill();
  }
}

function drawGeometric(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const cx = w / 2, cy = h / 2;
  const baseSize = Math.min(w, h) * 0.3 * cfg.size;
  for (let layer = 0; layer < 3; layer++) {
    const angle = t * Math.PI * 2 * (layer % 2 === 0 ? 1 : -1) + (layer * Math.PI) / 3;
    const s = baseSize * (1 - layer * 0.2);
    const { r, g, b } = hexToRgb(layer < 2 ? cfg.primaryColor : cfg.secondaryColor);
    const alpha = 0.2 + layer * 0.25;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.rect(-s / 2, -s / 2, s, s);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

function drawSquareBurst(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  const cx = w / 2, cy = h / 2;
  const steps = 4;
  for (let i = 0; i < steps; i++) {
    const phase = (t + i / steps) % 1;
    const s = phase * Math.min(w, h) * 0.7 * cfg.size;
    const alpha = (1 - phase) * 0.7;
    const { r, g, b } = hexToRgb(i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.beginPath();
    ctx.roundRect(cx - s / 2, cy - s / 2, s, s, 8);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  const s2 = Math.min(w, h) * 0.12 * cfg.size;
  const grad = ctx.createLinearGradient(cx - s2, cy - s2, cx + s2, cy + s2);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.beginPath();
  ctx.roundRect(cx - s2, cy - s2, s2 * 2, s2 * 2, 6);
  ctx.fillStyle = grad;
  ctx.fill();
}

// ─── Text overlay ─────────────────────────────────────────────────────────────

function drawText(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  if (!cfg.text) return;
  const fontSize = Math.min(w, h) * 0.08 * cfg.size;
  ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const opacity = 0.5 + Math.sin(t * Math.PI * 2) * 0.3;
  const { r, g, b } = hexToRgb(cfg.primaryColor);
  ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0.2, opacity)})`;
  ctx.fillText(cfg.text, w / 2, h - h * 0.08);
}

// ─── Shape map ───────────────────────────────────────────────────────────────

export const SHAPE_RENDERERS: Record<string, DrawFn> = {
  circle:   drawCirclePulse,
  wave:     drawWaveform,
  dots:     drawParticles,
  lines:    drawLines,
  triangle: drawGeometric,
  square:   drawSquareBurst,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  shape: string,
  cfg: AnimationConfig,
) {
  // Background
  ctx.fillStyle = cfg.bgColor;
  ctx.fillRect(0, 0, w, h);

  // Grid dots (subtle)
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  const spacing = 30;
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const renderer = SHAPE_RENDERERS[shape] ?? drawCirclePulse;
  renderer(ctx, t, w, h, cfg);
  drawText(ctx, t, w, h, cfg);
}
