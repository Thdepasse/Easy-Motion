export interface AnimationConfig {
  text: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  speed: number;
  size: number;
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

// ─── Utilities ───────────────────────────────────────────────────────────────

function hex(color: string): [number, number, number] {
  const c = color.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}
function rgba(color: string, a: number) {
  const [r, g, b] = hex(color);
  return `rgba(${r},${g},${b},${a})`;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function spring(t: number, freq = 3, decay = 5) { return 1 - Math.exp(-decay * t) * Math.cos(freq * Math.PI * 2 * t); }
function rng(seed: number) { return ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1; }

function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width: number, blur: number) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function gradFill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c1: string, c2: string, angle = 0) {
  const rad = (angle * Math.PI) / 180;
  const gx = Math.cos(rad), gy = Math.sin(rad);
  const g = ctx.createLinearGradient(x - gx * w / 2, y - gy * h / 2, x + gx * w / 2, y + gy * h / 2);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function bg(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}

function subtleGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let x = 0; x < w; x += 32) for (let y = 0; y < h; y += 32) {
    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
  }
}

// ─── 1. BLOB MORPH ──────────────────────────────────────────────────────────

const drawBlob: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const base = Math.min(w, h) * 0.28 * cfg.size;
  const points = 128;

  for (let layer = 0; layer < 3; layer++) {
    const phase = t * Math.PI * 2 + (layer * Math.PI * 2) / 3;
    const color = layer === 0 ? cfg.primaryColor : layer === 1 ? cfg.secondaryColor : cfg.primaryColor;
    const alpha = 0.15 + layer * 0.2;
    const r0 = base * (0.7 + layer * 0.15);

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 30 - layer * 8;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2;
      const noise =
        0.18 * Math.sin(3 * a + phase) +
        0.12 * Math.sin(5 * a - phase * 0.7) +
        0.07 * Math.sin(7 * a + phase * 1.3) +
        0.05 * Math.sin(11 * a - phase * 0.4);
      const r = r0 * (1 + noise);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = rgba(color, alpha);
    ctx.fill();
    ctx.restore();
  }
  // core bright circle
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.45);
  grad.addColorStop(0, rgba(cfg.primaryColor, 0.9));
  grad.addColorStop(0.5, rgba(cfg.secondaryColor, 0.5));
  grad.addColorStop(1, rgba(cfg.primaryColor, 0));
  ctx.beginPath(); ctx.arc(cx, cy, base * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = grad; ctx.fill();
};

// ─── 2. TYPEWRITER ──────────────────────────────────────────────────────────

const drawTypewriter: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const text = cfg.text || "EASY MOTION";
  const chars = Math.floor(t * (text.length + 1) * 1.2);
  const visible = text.slice(0, Math.min(chars, text.length));
  const fs = Math.min(w, h) * 0.13 * cfg.size;
  ctx.font = `700 ${fs}px 'Courier New', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // glow
  ctx.save();
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = cfg.primaryColor;
  ctx.fillText(visible, w / 2, h / 2);
  ctx.restore();

  // cursor blink
  if (chars <= text.length && Math.sin(t * Math.PI * 8) > 0) {
    const tw = ctx.measureText(visible).width;
    ctx.fillStyle = cfg.secondaryColor;
    ctx.fillRect(w / 2 + tw / 2 + 3, h / 2 - fs * 0.55, fs * 0.08, fs * 1.1);
  }

  // terminal lines decoration
  const lineFs = fs * 0.22;
  ctx.font = `${lineFs}px 'Courier New', monospace`;
  ctx.fillStyle = rgba(cfg.primaryColor, 0.25);
  ctx.textAlign = "left";
  ctx.fillText("> initializing animation...", w * 0.1, h * 0.25);
  ctx.fillStyle = rgba(cfg.secondaryColor, 0.2);
  ctx.fillText("> rendering frames...", w * 0.1, h * 0.75);
};

// ─── 3. WIGGLE TEXT ─────────────────────────────────────────────────────────

const drawWiggle: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "WIGGLE";
  const fs = Math.min(w * 0.8 / Math.max(text.length, 1), Math.min(w, h) * 0.18) * cfg.size;
  ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalW = ctx.measureText(text).width;
  let x = w / 2 - totalW / 2;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cw = ctx.measureText(ch).width;
    const phase = (i / text.length) * Math.PI * 2;
    const amp = fs * 0.25 * cfg.size;
    const yOff = Math.sin(t * Math.PI * 4 + phase) * amp;
    const rot = Math.sin(t * Math.PI * 3 + phase * 0.7) * 0.15;
    const scale = 1 + 0.08 * Math.sin(t * Math.PI * 5 + phase * 1.3);
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;

    ctx.save();
    ctx.translate(x + cw / 2, h / 2 + yOff);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    x += cw;
  }
};

// ─── 4. SCATTER TEXT ────────────────────────────────────────────────────────

const drawScatter: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "SCATTER";
  const fs = Math.min(w * 0.75 / Math.max(text.length, 1), Math.min(w, h) * 0.17) * cfg.size;
  ctx.font = `800 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalW = ctx.measureText(text).width;
  let cx0 = w / 2 - totalW / 2;
  // t < 0.5: scatter in; t > 0.5: scatter out
  const phase = Math.sin(t * Math.PI); // 0→1→0
  const gathered = easeOut(phase);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cw = ctx.measureText(ch).width;
    const tx = cx0 + cw / 2;
    const ty = h / 2;

    const randX = (rng(i * 7.3) - 0.5) * w * 1.4;
    const randY = (rng(i * 3.7) - 0.5) * h * 1.4;
    const startX = tx + randX;
    const startY = ty + randY;
    const x = lerp(startX, tx, gathered);
    const y = lerp(startY, ty, gathered);
    const alpha = gathered;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.fillText(ch, x, y);
    ctx.restore();

    cx0 += cw;
  }
};

// ─── 5. ENERGY TEXT ─────────────────────────────────────────────────────────

const drawEnergy: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "ENERGY";
  const fs = Math.min(w * 0.82 / Math.max(text.length, 1), Math.min(w, h) * 0.2) * cfg.size;
  ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalW = ctx.measureText(text).width;
  let x0 = w / 2 - totalW / 2;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cw = ctx.measureText(ch).width;
    const e = 1.5 + Math.abs(Math.sin(t * Math.PI * 6 + i * 0.9));
    const dx = (rng(i * 11 + Math.floor(t * 30)) - 0.5) * e * fs * 0.08;
    const dy = (rng(i * 17 + Math.floor(t * 30) + 1) - 0.5) * e * fs * 0.08;

    ctx.save();
    ctx.shadowColor = cfg.primaryColor;
    ctx.shadowBlur = 20 * e;
    ctx.fillStyle = cfg.primaryColor;
    ctx.fillText(ch, x0 + cw / 2 + dx, h / 2 + dy);

    // ghost layer
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = cfg.secondaryColor;
    ctx.fillStyle = cfg.secondaryColor;
    ctx.fillText(ch, x0 + cw / 2 - dx * 1.5, h / 2 - dy * 1.5);
    ctx.restore();

    x0 += cw;
  }
};

// ─── 6. SPILL TEXT ──────────────────────────────────────────────────────────

const drawSpill: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "SPILL";
  const fs = Math.min(w * 0.8 / Math.max(text.length, 1), Math.min(w, h) * 0.2) * cfg.size;
  ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalW = ctx.measureText(text).width;
  let x0 = w / 2 - totalW / 2;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cw = ctx.measureText(ch).width;
    const spillPhase = (t + rng(i * 5) * 0.3) % 1;
    const spillY = easeOut(spillPhase) * h * 0.5;
    const alpha = spillPhase < 0.85 ? 1 : 1 - (spillPhase - 0.85) / 0.15;
    const angle = (rng(i * 3.1) - 0.5) * 0.5 * spillPhase;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x0 + cw / 2, h / 3 + spillY);
    ctx.rotate(angle);
    ctx.shadowColor = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.shadowBlur = 8;
    ctx.fillStyle = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.fillText(ch, 0, 0);
    ctx.restore();

    x0 += cw;
  }
};

// ─── 7. SENTENCE REVEAL ─────────────────────────────────────────────────────

const drawReveal: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const words = (cfg.text || "EASY MOTION STUDIO").split(" ");
  const fs = Math.min(w, h) * 0.12 * cfg.size;
  ctx.font = `800 ${fs}px Inter, system-ui, sans-serif`;

  const totalH = words.length * fs * 1.4;
  let y0 = h / 2 - totalH / 2 + fs * 0.7;

  words.forEach((word, i) => {
    const revealAt = i / words.length;
    const localT = Math.max(0, (t - revealAt * 0.6) / 0.4);
    const progress = Math.min(1, easeOut(localT));
    const xOff = (1 - progress) * 40;

    ctx.save();
    ctx.globalAlpha = progress;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12 * progress;
    ctx.fillStyle = color;
    ctx.fillText(word, w / 2 + xOff, y0);

    // underline reveal
    const tw = ctx.measureText(word).width;
    ctx.globalAlpha = progress * 0.5;
    ctx.fillStyle = color;
    ctx.fillRect(w / 2 - (tw * progress) / 2, y0 + fs * 0.6, tw * progress, 2);

    ctx.restore();
    y0 += fs * 1.4;
  });
};

// ─── 8. FUNNEL TEXT ─────────────────────────────────────────────────────────

const drawFunnel: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "FUNNEL";
  const baseFontSize = Math.min(w * 0.78 / Math.max(text.length, 1), Math.min(w, h) * 0.18) * cfg.size;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const mid = text.length / 2;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const dist = Math.abs(i - mid) / mid; // 0 = center, 1 = edge
    const scale = lerp(1.8, 0.6, dist) * (1 + 0.15 * Math.sin(t * Math.PI * 3 + i));
    const fs = baseFontSize * scale;
    ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
    const alpha = lerp(1, 0.4, dist);
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;

    // Compute x positions (funnel: center letters are closer together)
    const spacing = baseFontSize * 0.9 * (1 - dist * 0.4);
    const xOffset = (i - mid + 0.5) * spacing;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillText(ch, w / 2 + xOffset, h / 2);
    ctx.restore();
  }
};

// ─── 9. BLOB MORPH (legacy alias kept) + KINETIC WORD ───────────────────────

const drawKinetic: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const words = (cfg.text || "EASY MOTION").split(" ");
  const fs = Math.min(w, h) * 0.18 * cfg.size;

  words.forEach((word, wi) => {
    const wordPhase = (t + wi * 0.25) % 1;
    const scale = 0.6 + easeOut(Math.sin(wordPhase * Math.PI)) * 0.8;
    const rot = (Math.sin(wordPhase * Math.PI * 2) * Math.PI) / 12;
    const yPos = h / 2 + (wi - (words.length - 1) / 2) * fs * 1.4;
    const alpha = 0.3 + 0.7 * Math.abs(Math.sin(wordPhase * Math.PI));

    ctx.save();
    ctx.translate(w / 2, yPos);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = wi % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = wi % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.fillText(word, 0, 0);
    ctx.restore();
  });
};

// ─── 10. PARTICLES RAIN ─────────────────────────────────────────────────────

interface Particle { x: number; y: number; vy: number; rot: number; rotV: number; scale: number; color: string; sym: string }
const PARTICLE_CACHE: Map<string, Particle[]> = new Map();

function getParticles(key: string, count: number, w: number, syms: string[], colors: string[]): Particle[] {
  if (PARTICLE_CACHE.has(key)) return PARTICLE_CACHE.get(key)!;
  const ps: Particle[] = [];
  for (let i = 0; i < count; i++) {
    ps.push({
      x: rng(i * 13) * w,
      y: -(rng(i * 7) * 200),
      vy: 1.5 + rng(i * 3) * 2.5,
      rot: rng(i * 5) * Math.PI * 2,
      rotV: (rng(i * 11) - 0.5) * 0.08,
      scale: 0.6 + rng(i * 17) * 0.8,
      color: colors[i % colors.length],
      sym: syms[i % syms.length],
    });
  }
  PARTICLE_CACHE.set(key, ps);
  return ps;
}

const drawParticleRain: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const ps = getParticles("rain", 30, w, ["$", "€", "💰", "✦", "★"], [cfg.primaryColor, cfg.secondaryColor, "#fbbf24"]);
  const dt = t * 3;
  ps.forEach((p, i) => {
    const y = ((p.y + dt * p.vy * 60) % (h + 200)) - 100;
    const rot = p.rot + dt * p.rotV * 30;
    ctx.save();
    ctx.translate(p.x, y);
    ctx.rotate(rot);
    ctx.scale(p.scale * cfg.size, p.scale * cfg.size);
    ctx.font = `bold 22px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = p.color;
    ctx.fillText(p.sym, 0, 0);
    ctx.restore();
  });
};

// ─── 11. CONFETTI ───────────────────────────────────────────────────────────

const drawConfetti: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const count = 40;
  const colors = [cfg.primaryColor, cfg.secondaryColor, "#fbbf24", "#34d399", "#60a5fa", "#f87171"];
  const dt = t * 2;
  for (let i = 0; i < count; i++) {
    const x = rng(i * 7.3) * w;
    const vy = 1 + rng(i * 3.1) * 2;
    const vx = (rng(i * 5.7) - 0.5) * 1.2;
    const rot = rng(i * 11) * Math.PI * 2 + dt * (rng(i * 2) - 0.5) * 4;
    const y = ((rng(i * 1.7) * h - 20 + dt * vy * 60 + rng(i * 9) * 80) % (h + 60)) - 30;
    const cx = x + Math.sin(dt * 2 + i) * 15 * vx;
    const cw = (6 + rng(i * 4) * 8) * cfg.size;
    const ch = (4 + rng(i * 6) * 5) * cfg.size;
    const color = colors[i % colors.length];

    ctx.save();
    ctx.translate(cx, y);
    ctx.rotate(rot);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = color;
    ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
    ctx.restore();
  }
};

// ─── 12. BAR CHART ──────────────────────────────────────────────────────────

const drawBarChart: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const data = [72, 45, 88, 61, 95, 54, 79, 40, 83, 67];
  const pad = w * 0.1;
  const chartW = w - pad * 2;
  const chartH = h * 0.62;
  const barW = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;
  const baseY = h * 0.82;
  const maxV = 100;

  // Axis
  ctx.strokeStyle = rgba(cfg.primaryColor, 0.2);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, h * 0.1); ctx.lineTo(pad, baseY); ctx.lineTo(w - pad, baseY); ctx.stroke();

  data.forEach((val, i) => {
    const delay = i / data.length * 0.6;
    const progress = Math.min(1, easeOut(Math.max(0, (t - delay) / 0.5)));
    const barH = (val / maxV) * chartH * progress;
    const x = pad + i * (barW + gap);
    const y = baseY - barH;

    const grad = ctx.createLinearGradient(x, baseY, x, y);
    grad.addColorStop(0, rgba(cfg.secondaryColor, 0.7));
    grad.addColorStop(1, rgba(cfg.primaryColor, 0.95));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
    ctx.fill();

    // value label
    if (progress > 0.7) {
      ctx.font = `bold ${w * 0.028}px Inter, system-ui`;
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(cfg.primaryColor, progress);
      ctx.fillText(String(val), x + barW / 2, y - 6);
    }
  });

  ctx.font = `bold ${w * 0.038}px Inter, system-ui`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.7);
  ctx.fillText(cfg.text || "ANALYTICS", w / 2, h * 0.07);
};

// ─── 13. PIE CHART / DONUT ──────────────────────────────────────────────────

const drawPieChart: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.32 * cfg.size;
  const inner = r * 0.5;
  const segments = [
    { val: 35, color: cfg.primaryColor },
    { val: 25, color: cfg.secondaryColor },
    { val: 20, color: "#fbbf24" },
    { val: 12, color: "#34d399" },
    { val: 8,  color: "#60a5fa" },
  ];
  const total = segments.reduce((s, v) => s + v.val, 0);
  const maxAngle = t * Math.PI * 2;

  let startAngle = -Math.PI / 2;
  segments.forEach(({ val, color }) => {
    const slice = (val / total) * Math.PI * 2;
    const endAngle = Math.min(startAngle + slice, startAngle + Math.min(slice, maxAngle - (startAngle + Math.PI / 2)));
    const drawn = Math.min(slice, Math.max(0, maxAngle - (startAngle + Math.PI / 2)));
    if (drawn <= 0) { startAngle += slice; return; }

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + drawn);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    startAngle += slice;
  });

  // donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = cfg.bgColor;
  ctx.fill();

  // center text
  ctx.font = `bold ${r * 0.28}px Inter`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = rgba(cfg.primaryColor, Math.min(1, t * 2));
  ctx.fillText(Math.round(t * 100) + "%", cx, cy);
};

// ─── 14. PROGRESS RING ──────────────────────────────────────────────────────

const drawProgressRing: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.33 * cfg.size;
  const lineW = r * 0.14;
  const progress = Math.sin(t * Math.PI) * 0.85 + 0.05;
  const end = -Math.PI / 2 + progress * Math.PI * 2;

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = rgba(cfg.primaryColor, 0.12);
  ctx.lineWidth = lineW;
  ctx.stroke();

  // Fill
  ctx.save();
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, end);
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.strokeStyle = grad;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();

  // Dot at end
  const dotX = cx + r * Math.cos(end);
  const dotY = cy + r * Math.sin(end);
  ctx.beginPath();
  ctx.arc(dotX, dotY, lineW * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = cfg.secondaryColor;
  ctx.fill();

  // Percent
  ctx.font = `bold ${r * 0.38}px Inter`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 10;
  ctx.fillStyle = cfg.primaryColor;
  ctx.fillText(Math.round(progress * 100) + "%", cx, cy - r * 0.06);
  ctx.font = `${r * 0.15}px Inter`;
  ctx.fillStyle = rgba(cfg.primaryColor, 0.5);
  ctx.fillText(cfg.text || "PROGRESS", cx, cy + r * 0.35);
};

// ─── 15. TREND LINE ─────────────────────────────────────────────────────────

const drawTrendLine: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const pad = w * 0.1;
  const chartW = w - pad * 2;
  const chartH = h * 0.5;
  const baseY = h * 0.78;
  const points = 20;
  const data = Array.from({ length: points }, (_, i) => {
    const base = i / (points - 1);
    return 0.2 + base * 0.55 + Math.sin(i * 1.3) * 0.07 + rng(i * 3) * 0.08;
  });

  // Grid lines
  ctx.strokeStyle = rgba(cfg.primaryColor, 0.08);
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = baseY - (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
  }

  const drawnPoints = Math.floor(t * points * 1.1);

  // Fill area
  ctx.beginPath();
  ctx.moveTo(pad, baseY);
  for (let i = 0; i < Math.min(drawnPoints, points); i++) {
    ctx.lineTo(pad + (i / (points - 1)) * chartW, baseY - data[i] * chartH);
  }
  ctx.lineTo(pad + (Math.min(drawnPoints - 1, points - 1) / (points - 1)) * chartW, baseY);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, baseY - chartH, 0, baseY);
  areaGrad.addColorStop(0, rgba(cfg.primaryColor, 0.3));
  areaGrad.addColorStop(1, rgba(cfg.primaryColor, 0));
  ctx.fillStyle = areaGrad;
  ctx.fill();

  // Line
  ctx.save();
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = cfg.primaryColor;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < Math.min(drawnPoints, points); i++) {
    const x = pad + (i / (points - 1)) * chartW;
    const y = baseY - data[i] * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Current dot
  if (drawnPoints > 0 && drawnPoints <= points) {
    const li = Math.min(drawnPoints - 1, points - 1);
    const dx = pad + (li / (points - 1)) * chartW;
    const dy = baseY - data[li] * chartH;
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2);
    ctx.fillStyle = cfg.secondaryColor; ctx.fill();
  }

  ctx.font = `bold ${w * 0.038}px Inter`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.7);
  ctx.fillText(cfg.text || "GROWTH", w / 2, h * 0.1);
};

// ─── 16. AUDIO WAVE ─────────────────────────────────────────────────────────

const drawAudioWave: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const bars = 48;
  const barW = (w * 0.9) / bars;
  const maxH = h * 0.55 * cfg.size;
  const cx = w / 2, cy = h / 2;

  for (let i = 0; i < bars; i++) {
    const freq = i / bars;
    const amp =
      0.3 * Math.sin(freq * Math.PI * 3 + t * Math.PI * 6) +
      0.25 * Math.sin(freq * Math.PI * 7 + t * Math.PI * 4.3) +
      0.2 * Math.sin(freq * Math.PI * 13 + t * Math.PI * 7) +
      0.15 * Math.abs(Math.sin(freq * Math.PI * 2 + t * Math.PI * 2));
    const barH = Math.abs(amp) * maxH + 3;
    const x = cx - (bars / 2) * barW + i * barW;

    const alpha = 0.5 + Math.abs(amp) * 0.5;
    const [pr, pg, pb] = hex(cfg.primaryColor);
    const [sr, sg, sb] = hex(cfg.secondaryColor);
    const frac = i / bars;
    const r = Math.round(lerp(pr, sr, frac));
    const g = Math.round(lerp(pg, sg, frac));
    const b = Math.round(lerp(pb, sb, frac));

    ctx.save();
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.beginPath();
    ctx.roundRect(x + 1, cy - barH / 2, barW - 2, barH, 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.font = `600 ${w * 0.04}px Inter`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.6);
  ctx.fillText(cfg.text || "AUDIO", w / 2, h * 0.88);
};

// ─── 17. NOTIFICATION CARD ──────────────────────────────────────────────────

const drawNotification: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const cards = [
    { icon: "🔔", title: "New comment", sub: "alexdesign liked your animation", delay: 0 },
    { icon: "⚡", title: "Export ready", sub: "kinetic_title.webm is done", delay: 0.2 },
    { icon: "🎉", title: "100 downloads!", sub: "Your template hit a milestone", delay: 0.4 },
  ];
  const cardW = w * 0.78, cardH = h * 0.15;
  const pad = w * 0.11;

  cards.forEach((card, i) => {
    const localT = Math.max(0, (t - card.delay) / 0.35);
    const progress = Math.min(1, spring(localT, 1.5, 6));
    const xOff = (1 - progress) * w * 0.6;
    const y = h * 0.15 + i * (cardH + h * 0.04);

    ctx.save();
    ctx.translate(xOff, 0);
    ctx.globalAlpha = Math.min(1, progress * 1.5);

    // Card bg
    ctx.shadowColor = cfg.primaryColor;
    ctx.shadowBlur = 14 * progress;
    ctx.fillStyle = rgba(cfg.primaryColor, 0.08);
    ctx.beginPath();
    ctx.roundRect(pad, y, cardW, cardH, 10);
    ctx.fill();
    ctx.strokeStyle = rgba(cfg.primaryColor, 0.25);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Icon
    ctx.font = `${cardH * 0.45}px system-ui`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(card.icon, pad + cardW * 0.05, y + cardH / 2);

    // Text
    ctx.font = `bold ${w * 0.035}px Inter`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(card.title, pad + cardW * 0.18, y + cardH * 0.32);
    ctx.font = `${w * 0.026}px Inter`;
    ctx.fillStyle = rgba(cfg.primaryColor, 0.7);
    ctx.fillText(card.sub, pad + cardW * 0.18, y + cardH * 0.68);

    // Dot
    ctx.beginPath();
    ctx.arc(pad + cardW * 0.93, y + cardH * 0.28, 4, 0, Math.PI * 2);
    ctx.fillStyle = cfg.secondaryColor;
    ctx.fill();

    ctx.restore();
  });
};

// ─── 18. MESSAGE BUBBLES ────────────────────────────────────────────────────

const drawMessageBubbles: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const messages = [
    { text: "This animation is 🔥", side: "left",  delay: 0 },
    { text: "Made with Easy Motion", side: "right", delay: 0.2 },
    { text: "Export in WebM 🎬", side: "left",  delay: 0.4 },
    { text: "Let's go! 🚀", side: "right", delay: 0.6 },
  ];
  const fs = w * 0.035;
  const bPad = { h: w * 0.035, v: h * 0.025 };

  messages.forEach((msg, i) => {
    const localT = Math.max(0, (t - msg.delay) / 0.3);
    const progress = Math.min(1, spring(localT, 1.8, 7));
    if (progress <= 0) return;

    ctx.font = `${fs}px Inter`;
    const tw = ctx.measureText(msg.text).width;
    const bubW = tw + bPad.h * 2;
    const bubH = fs + bPad.v * 2;
    const isRight = msg.side === "right";
    const bx = isRight ? w * 0.9 - bubW : w * 0.1;
    const by = h * 0.1 + i * (bubH + h * 0.04);
    const scaleOrig = isRight ? 1 - (1 - progress) : -(1 - (1 - progress));

    ctx.save();
    ctx.translate(bx + (isRight ? bubW : 0), by + bubH / 2);
    ctx.scale(progress, progress);
    ctx.translate(-(isRight ? bubW : 0), -bubH / 2);

    ctx.shadowColor = isRight ? cfg.primaryColor : cfg.secondaryColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = isRight ? rgba(cfg.primaryColor, 0.85) : rgba(cfg.secondaryColor, 0.2);
    ctx.beginPath();
    ctx.roundRect(0, 0, bubW, bubH, 12);
    ctx.fill();
    ctx.strokeStyle = isRight ? "transparent" : rgba(cfg.secondaryColor, 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isRight ? "#ffffff" : "#ffffff";
    ctx.font = `${fs}px Inter`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 0;
    ctx.fillText(msg.text, bPad.h, bubH / 2);
    ctx.restore();
  });
};

// ─── 19. SPRING BOUNCE ──────────────────────────────────────────────────────

const drawSpringBounce: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const items = 5;
  const baseR = Math.min(w, h) * 0.07 * cfg.size;

  for (let i = 0; i < items; i++) {
    const delay = i / items * 0.4;
    const localT = Math.max(0, (t - delay)) * 2;
    const bounceT = localT % 1;
    const springY = spring(bounceT, 2.5, 4);
    const scaleY = 1 + 0.15 * Math.sin(bounceT * Math.PI * 5);
    const scaleX = 1 - 0.08 * Math.sin(bounceT * Math.PI * 5);

    const cx = w * (0.15 + i * 0.175);
    const cy = h * 0.65;
    const oy = -h * 0.3 * springY;
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;

    // Shadow on ground
    ctx.beginPath();
    ctx.ellipse(cx, cy + baseR * 0.3, baseR * (1.1 - springY * 0.3), baseR * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = rgba(color, 0.15 + springY * 0.1);
    ctx.fill();

    // Ball
    ctx.save();
    ctx.translate(cx, cy + oy);
    ctx.scale(scaleX, scaleY);
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    const grad = ctx.createRadialGradient(-baseR * 0.3, -baseR * 0.3, 0, 0, 0, baseR);
    grad.addColorStop(0, "#ffffff88");
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, rgba(color, 0.6));
    ctx.beginPath();
    ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  ctx.font = `bold ${w * 0.04}px Inter`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.5);
  ctx.fillText(cfg.text || "BOUNCE", w / 2, h * 0.1);
};

// ─── 20. VINYL RECORD ───────────────────────────────────────────────────────

const drawVinyl: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.38 * cfg.size;
  const rot = t * Math.PI * 4;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Vinyl body
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();

  // Grooves
  for (let i = 8; i >= 1; i--) {
    const gr = r * (0.35 + i * 0.065);
    const alpha = 0.08 + i * 0.02;
    ctx.beginPath();
    ctx.arc(0, 0, gr, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(cfg.primaryColor, alpha);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Color ring
  const ring = ctx.createConicGradient(0, 0, 0);
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const pos = i / steps;
    ring.addColorStop(pos, i % 2 === 0 ? rgba(cfg.primaryColor, 0.6) : rgba(cfg.secondaryColor, 0.6));
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();

  // Label
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = cfg.bgColor;
  ctx.fill();
  ctx.font = `bold ${r * 0.16}px Inter`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = cfg.primaryColor;
  ctx.fillText(cfg.text?.slice(0, 4) || "EASY", 0, -r * 0.04);
  ctx.font = `${r * 0.1}px Inter`;
  ctx.fillStyle = rgba(cfg.secondaryColor, 0.8);
  ctx.fillText("MOTION", 0, r * 0.1);

  // Center hole
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();

  ctx.restore();

  // Tonearm
  const armX = cx + r * 0.85;
  const armStartY = cy - r * 0.9;
  const armAngle = Math.sin(t * 0.5) * 0.15 - 0.1;
  ctx.save();
  ctx.translate(armX, armStartY);
  ctx.rotate(armAngle);
  ctx.strokeStyle = rgba(cfg.primaryColor, 0.5);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-r * 0.1, r * 1.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = rgba(cfg.primaryColor, 0.7);
  ctx.fill();
  ctx.restore();
};

// ─── 21. LINE DRAW ──────────────────────────────────────────────────────────

const drawLineDraw: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const paths = [
    { points: [[0.1, 0.5], [0.25, 0.25], [0.5, 0.7], [0.75, 0.2], [0.9, 0.5]], color: cfg.primaryColor },
    { points: [[0.1, 0.6], [0.3, 0.8], [0.5, 0.4], [0.7, 0.75], [0.9, 0.55]], color: cfg.secondaryColor },
  ];

  paths.forEach((path, pi) => {
    const delay = pi * 0.3;
    const progress = Math.min(1, easeOut(Math.max(0, (t - delay) / 0.6)));
    const pts = path.points.map(([px, py]) => [px * w, py * h]);
    const totalLen = pts.reduce((acc, p, i) => {
      if (i === 0) return 0;
      const dx = p[0] - pts[i - 1][0], dy = p[1] - pts[i - 1][1];
      return acc + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    let drawn = progress * totalLen;
    ctx.save();
    ctx.shadowColor = path.color;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = path.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);

    for (let i = 1; i < pts.length && drawn > 0; i++) {
      const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      const seg = Math.sqrt(dx * dx + dy * dy);
      if (drawn >= seg) {
        ctx.lineTo(pts[i][0], pts[i][1]);
        drawn -= seg;
      } else {
        const frac = drawn / seg;
        ctx.lineTo(pts[i - 1][0] + dx * frac, pts[i - 1][1] + dy * frac);
        drawn = 0;
      }
    }
    ctx.stroke();

    // Pen dot
    if (progress > 0 && progress < 1) {
      const ti = Math.min(progress * pts.length, pts.length - 1.001);
      const idx = Math.floor(ti);
      const frac = ti - idx;
      if (idx < pts.length - 1) {
        const px = lerp(pts[idx][0], pts[idx + 1][0], frac);
        const py = lerp(pts[idx][1], pts[idx + 1][1], frac);
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = path.color; ctx.fill();
      }
    }
    ctx.restore();
  });

  ctx.font = `bold ${w * 0.04}px Inter`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.5);
  ctx.fillText(cfg.text || "DRAW", w / 2, h * 0.93);
};

// ─── 22. PIXEL GRID WAVE ────────────────────────────────────────────────────

const drawPixelGrid: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cols = 18, rows = 10;
  const cellW = w / cols, cellH = h / rows;
  const [pr, pg, pb] = hex(cfg.primaryColor);
  const [sr, sg, sb] = hex(cfg.secondaryColor);

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const wave = Math.sin((col / cols) * Math.PI * 4 - t * Math.PI * 4) *
                   Math.cos((row / rows) * Math.PI * 2 + t * Math.PI * 2);
      const intensity = (wave + 1) / 2;
      const r = Math.round(lerp(pr, sr, intensity));
      const g = Math.round(lerp(pg, sg, intensity));
      const b = Math.round(lerp(pb, sb, intensity));
      const alpha = 0.1 + intensity * 0.85;
      const size = (cellW * 0.45 + intensity * cellW * 0.25) * cfg.size;

      ctx.save();
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.shadowBlur = intensity * 8;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.roundRect(
        col * cellW + cellW / 2 - size / 2,
        row * cellH + cellH / 2 - size / 2,
        size, size, size * 0.2
      );
      ctx.fill();
      ctx.restore();
    }
  }
};

// ─── 23. MORPH BLOCKS ───────────────────────────────────────────────────────

const drawMorphBlocks: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const count = 6;
  const maxR = Math.min(w, h) * 0.1 * cfg.size;
  const cx = w / 2, cy = h / 2;
  const spread = Math.min(w, h) * 0.32 * cfg.size;

  for (let i = 0; i < count; i++) {
    const phase = (t + i / count) % 1;
    const morphT = Math.abs(Math.sin(phase * Math.PI * 2));
    // 0 = square, 1 = circle
    const radius = morphT * maxR;
    const angle = (i / count) * Math.PI * 2 + t * Math.PI;
    const x = cx + Math.cos(angle) * spread;
    const y = cy + Math.sin(angle) * spread;
    const scale = 0.7 + morphT * 0.6;
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * Math.PI * 2 * (i % 2 === 0 ? 1 : -1));
    ctx.scale(scale, scale);
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = rgba(color, 0.75);
    ctx.beginPath();
    ctx.roundRect(-maxR, -maxR, maxR * 2, maxR * 2, radius);
    ctx.fill();
    ctx.restore();
  }
};

// ─── 24. ROTATING CUBE (3D projection) ──────────────────────────────────────

const drawRotatingCube: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const s = Math.min(w, h) * 0.22 * cfg.size;
  const cx = w / 2, cy = h / 2;
  const rx = t * Math.PI * 2;
  const ry = t * Math.PI * 1.3;

  const verts: [number, number, number][] = [
    [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
    [-s, -s, s],  [s, -s, s],  [s, s, s],  [-s, s, s],
  ];

  function project([x, y, z]: [number, number, number]): [number, number] {
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const y1 = y * cosX - z * sinX, z1 = y * sinX + z * cosX;
    const x2 = x * cosY + z1 * sinY, z2 = -x * sinY + z1 * cosY;
    const fov = 600;
    const d = fov / (fov + z2 + s * 2);
    return [cx + x2 * d, cy + y1 * d];
  }

  const faces = [
    [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
    [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5],
  ];
  const faceColors = [cfg.primaryColor, cfg.secondaryColor, cfg.primaryColor, cfg.secondaryColor, cfg.primaryColor, cfg.secondaryColor];

  const projected = verts.map(project);

  faces.forEach((face, fi) => {
    const ps = face.map((vi) => projected[vi]);
    const avgZ = face.reduce((sum, vi) => {
      const v = verts[vi];
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const y1 = v[1] * cosX - v[2] * sinX;
      const z1 = v[1] * sinX + v[2] * cosX;
      const z2 = -v[0] * sinY + z1 * cosY;
      return sum + z2;
    }, 0) / 4;
    const alpha = 0.15 + (avgZ / (s * 2) + 0.5) * 0.5;

    ctx.save();
    ctx.shadowColor = faceColors[fi];
    ctx.shadowBlur = 12;
    ctx.fillStyle = rgba(faceColors[fi], alpha);
    ctx.strokeStyle = rgba(faceColors[fi], 0.5);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ps[0][0], ps[0][1]);
    ps.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
};

// ─── 25. GLOW PULSE ─────────────────────────────────────────────────────────

const drawGlowPulse: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const maxR = Math.min(w, h) * 0.42 * cfg.size;

  // Rings
  for (let ring = 0; ring < 5; ring++) {
    const phase = (t + ring * 0.2) % 1;
    const r = maxR * phase;
    const alpha = (1 - phase) * 0.4;
    ctx.save();
    ctx.shadowColor = cfg.primaryColor;
    ctx.shadowBlur = 20 * (1 - phase);
    ctx.strokeStyle = rgba(cfg.primaryColor, alpha);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Star rays
  const rays = 8;
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + t * Math.PI;
    const len = maxR * (0.5 + 0.3 * Math.sin(t * Math.PI * 4 + i));
    ctx.save();
    ctx.shadowColor = cfg.secondaryColor;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = rgba(cfg.secondaryColor, 0.4);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
    ctx.restore();
  }

  // Core
  const pulse = 0.7 + 0.3 * Math.sin(t * Math.PI * 4);
  const coreR = maxR * 0.15 * pulse;
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2);
  coreGrad.addColorStop(0, "#ffffff");
  coreGrad.addColorStop(0.3, cfg.primaryColor);
  coreGrad.addColorStop(0.7, rgba(cfg.secondaryColor, 0.6));
  coreGrad.addColorStop(1, rgba(cfg.primaryColor, 0));
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 2, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();
};

// ─── 26. STAGGER GRID ───────────────────────────────────────────────────────

const drawStaggerGrid: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cols = 6, rows = 4;
  const cw = w / (cols + 2), ch = h / (rows + 2);
  const dotR = Math.min(cw, ch) * 0.28 * cfg.size;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const delay = (col + row) / (cols + rows) * 0.5;
      const localT = (t - delay + 1) % 1;
      const scale = Math.abs(Math.sin(localT * Math.PI));
      const x = (col + 1.5) * cw;
      const y = (row + 1.5) * ch;
      const color = (col + row) % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale * cfg.size, scale * cfg.size);
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 * scale;
      ctx.fillStyle = rgba(color, 0.8);
      ctx.beginPath();
      ctx.arc(0, 0, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
};

// ─── 27. LOGO LIQUID ────────────────────────────────────────────────────────

const drawLogoLiquid: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const s = Math.min(w, h) * 0.25 * cfg.size;
  const phase = easeInOut(Math.abs(Math.sin(t * Math.PI)));

  // Liquid drop
  ctx.save();
  ctx.shadowColor = cfg.primaryColor;
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.bezierCurveTo(
    cx + s * (0.8 + 0.2 * phase), cy - s * 0.2,
    cx + s * (0.9 + 0.1 * phase), cy + s * 0.5,
    cx, cy + s
  );
  ctx.bezierCurveTo(
    cx - s * (0.9 + 0.1 * phase), cy + s * 0.5,
    cx - s * (0.8 + 0.2 * phase), cy - s * 0.2,
    cx, cy - s
  );
  const grad = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Reflection
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.18, cy - s * 0.3, s * 0.15, s * 0.35, Math.PI / 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.restore();

  // Text
  ctx.font = `bold ${s * 0.38}px Inter`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(cfg.text?.slice(0, 2) || "EM", cx, cy);
};

// ─── 28. GLITCH ─────────────────────────────────────────────────────────────

const drawGlitch: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const text = cfg.text || "GLITCH";
  const fs = Math.min(w * 0.85 / Math.max(text.length, 1), Math.min(w, h) * 0.22) * cfg.size;
  ctx.font = `900 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const glitchIntensity = Math.pow(Math.sin(t * Math.PI * 7), 8) * 2 + Math.sin(t * Math.PI * 23) * 0.3;

  // RGB split
  const offsets = [
    { dx: -glitchIntensity * 8, dy: 0, color: "#ff0055", alpha: 0.7 },
    { dx: glitchIntensity * 6,  dy: -glitchIntensity * 2, color: "#00ffff", alpha: 0.7 },
    { dx: 0, dy: 0, color: cfg.primaryColor, alpha: 1 },
  ];

  offsets.forEach(({ dx, dy, color, alpha }) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillText(text, w / 2 + dx, h / 2 + dy);
    ctx.restore();
  });

  // Scan line glitches
  if (glitchIntensity > 0.5) {
    const numSlices = Math.floor(glitchIntensity * 4);
    for (let i = 0; i < numSlices; i++) {
      const sliceY = rng(t * 1000 + i) * h;
      const sliceH = rng(t * 500 + i) * fs * 0.4;
      const sliceOff = (rng(t * 200 + i) - 0.5) * 40;
      ctx.save();
      ctx.drawImage(ctx.canvas, 0, sliceY, w, sliceH, sliceOff, sliceY, w, sliceH);
      ctx.restore();
    }
  }
};

// ─── 29. CIRCLE PULSE (upgraded original) ───────────────────────────────────

const drawCirclePulse: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  subtleGrid(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  const maxR = Math.min(w, h) * 0.38 * cfg.size;

  for (let i = 4; i >= 0; i--) {
    const phase = (t + i * 0.2) % 1;
    const r = maxR * phase;
    const alpha = (1 - phase) * 0.5;
    ctx.save();
    ctx.shadowColor = cfg.primaryColor;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = rgba(cfg.primaryColor, alpha);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  const coreR = maxR * 0.2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fillStyle = grad; ctx.fill();

  const fs = Math.min(w, h) * 0.07 * cfg.size;
  ctx.font = `700 ${fs}px Inter`;
  ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.5 + Math.sin(t * Math.PI * 2) * 0.3);
  ctx.fillText(cfg.text, w / 2, h - h * 0.06);
};

// ─── 30. WAVEFORM (upgraded) ─────────────────────────────────────────────────

const drawWaveform: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  for (let l = 0; l < 4; l++) {
    const phase = t + l * 0.12;
    const amp = (h * 0.14 + l * 6) * cfg.size;
    const [r, g, b] = hex(l < 2 ? cfg.primaryColor : cfg.secondaryColor);
    const alpha = 0.3 + l * 0.2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = h / 2 +
        Math.sin((x / w) * Math.PI * 4 + phase * Math.PI * 2) * amp +
        Math.sin((x / w) * Math.PI * 7 + phase * Math.PI * 3.3) * amp * 0.3;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.save();
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 8 + l * 4;
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2 + l * 0.5;
    ctx.stroke();
    ctx.restore();
  }
  const fs = Math.min(w, h) * 0.07 * cfg.size;
  ctx.font = `700 ${fs}px Inter`;
  ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  ctx.fillStyle = rgba(cfg.primaryColor, 0.5);
  ctx.fillText(cfg.text, w / 2, h - h * 0.04);
};

// ─── 31. PARTICLES BURST ─────────────────────────────────────────────────────

const drawParticlesBurst: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * Math.PI * 0.5;
    const speed = 0.3 + rng(i * 5) * 0.7;
    const phase = (t * speed + rng(i * 3)) % 1;
    const dist = easeOut(phase) * Math.min(w, h) * 0.42 * cfg.size;
    const alpha = 1 - phase;
    const r = (2 + rng(i * 7) * 4) * cfg.size;
    const color = i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = rgba(color, alpha);
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r * (1 - phase * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

// ─── 32. GEOMETRIC (upgraded) ────────────────────────────────────────────────

const drawGeometric: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  const s = Math.min(w, h) * 0.3 * cfg.size;
  for (let layer = 0; layer < 4; layer++) {
    const angle = t * Math.PI * 2 * (layer % 2 === 0 ? 1 : -1) + (layer * Math.PI) / 4;
    const ls = s * (1 - layer * 0.18);
    const [r, g, b] = hex(layer < 2 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + layer * 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-ls / 2, -ls / 2, ls, ls); ctx.stroke();
    ctx.restore();
  }
};

// ─── 33. SQUARE BURST (upgraded) ─────────────────────────────────────────────

const drawSquareBurst: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < 5; i++) {
    const phase = (t + i / 5) % 1;
    const s = phase * Math.min(w, h) * 0.72 * cfg.size;
    const alpha = (1 - phase) * 0.7;
    const [r, g, b] = hex(i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.save();
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - s / 2, cy - s / 2, s, s, 8);
    ctx.stroke();
    ctx.restore();
  }
  const s2 = Math.min(w, h) * 0.1 * cfg.size;
  const grad = ctx.createLinearGradient(cx - s2, cy - s2, cx + s2, cy + s2);
  grad.addColorStop(0, cfg.primaryColor);
  grad.addColorStop(1, cfg.secondaryColor);
  ctx.beginPath(); ctx.roundRect(cx - s2, cy - s2, s2 * 2, s2 * 2, 6);
  ctx.fillStyle = grad; ctx.fill();
};

// ─── 34. LINES (upgraded) ────────────────────────────────────────────────────

const drawLines: DrawFn = (ctx, t, w, h, cfg) => {
  bg(ctx, w, h, cfg.bgColor);
  const count = 5;
  for (let i = 0; i < count; i++) {
    const progress = (t + i / count) % 1;
    const lineW = lerp(w * 0.08, w * 0.88, progress) * cfg.size;
    const yBase = h * 0.28 + i * (h * 0.11);
    const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
    const [r, g, b] = hex(i % 2 === 0 ? cfg.primaryColor : cfg.secondaryColor);
    ctx.save();
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 8;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.9})`;
    ctx.beginPath();
    ctx.roundRect(w / 2 - lineW / 2, yBase, lineW, 4 * cfg.size, 3);
    ctx.fill();
    ctx.restore();
  }
};

// ─── Text overlay ─────────────────────────────────────────────────────────────

function drawTextOverlay(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, cfg: AnimationConfig) {
  if (!cfg.text) return;
  const fs = Math.min(w, h) * 0.072 * cfg.size;
  ctx.font = `700 ${fs}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const a = 0.4 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.4;
  ctx.fillStyle = rgba(cfg.primaryColor, Math.max(0.15, a));
  ctx.fillText(cfg.text, w / 2, h - h * 0.07);
}

// ─── Shape renderer map ───────────────────────────────────────────────────────

export const SHAPE_RENDERERS: Record<string, DrawFn> = {
  // original
  circle:         drawCirclePulse,
  wave:           drawWaveform,
  dots:           drawParticlesBurst,
  lines:          drawLines,
  triangle:       drawGeometric,
  square:         drawSquareBurst,
  // text effects
  typewriter:     drawTypewriter,
  wiggle:         drawWiggle,
  scatter:        drawScatter,
  energy:         drawEnergy,
  spill:          drawSpill,
  reveal:         drawReveal,
  funnel:         drawFunnel,
  kinetic:        drawKinetic,
  // shapes/morph
  blob:           drawBlob,
  morph_blocks:   drawMorphBlocks,
  rotating_cube:  drawRotatingCube,
  logo_liquid:    drawLogoLiquid,
  // data
  bar_chart:      drawBarChart,
  pie_chart:      drawPieChart,
  progress_ring:  drawProgressRing,
  trend_line:     drawTrendLine,
  audio_wave:     drawAudioWave,
  // UI
  notification:   drawNotification,
  message_bubble: drawMessageBubbles,
  spring_bounce:  drawSpringBounce,
  // particles
  particles_rain: drawParticleRain,
  confetti:       drawConfetti,
  // special
  vinyl:          drawVinyl,
  line_draw:      drawLineDraw,
  pixel_grid:     drawPixelGrid,
  glow_pulse:     drawGlowPulse,
  stagger_grid:   drawStaggerGrid,
  glitch:         drawGlitch,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  shape: string,
  cfg: AnimationConfig,
) {
  const renderer = SHAPE_RENDERERS[shape] ?? drawCirclePulse;
  renderer(ctx, t, w, h, cfg);
}
