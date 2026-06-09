"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { renderFrame, DEFAULT_CONFIG } from "@/lib/animations";
import type { Template } from "@/lib/templates";

// Extract dominant color from gradient class
function gradientToColors(gradient: string): { primary: string; secondary: string } {
  const colorMap: Record<string, string> = {
    "purple-500": "#a855f7", "purple-600": "#9333ea",
    "pink-500": "#ec4899",  "pink-600": "#db2777",
    "rose-500": "#f43f5e",  "rose-600": "#e11d48",
    "fuchsia-500": "#d946ef",
    "violet-500": "#8b5cf6",
    "indigo-500": "#6366f1",
    "blue-500": "#3b82f6",  "blue-600": "#2563eb",
    "sky-400": "#38bdf8",   "sky-500": "#0ea5e9",
    "cyan-500": "#06b6d4",
    "teal-500": "#14b8a6",
    "emerald-500": "#10b981",
    "green-500": "#22c55e",
    "lime-500": "#84cc16",
    "yellow-400": "#facc15", "yellow-500": "#eab308",
    "amber-500": "#f59e0b",
    "orange-400": "#fb923c", "orange-500": "#f97316",
    "red-500": "#ef4444",   "red-600": "#dc2626",
    "gray-600": "#4b5563",  "zinc-500": "#71717a",
  };

  const parts = gradient.replace("from-", "").replace("to-", "").trim().split(" ");
  const [fromRaw, toRaw] = parts;
  const from = fromRaw?.replace("from-", "") ?? "purple-500";
  const to   = toRaw?.replace("to-", "")   ?? "pink-500";
  return {
    primary:   colorMap[from] ?? "#a855f7",
    secondary: colorMap[to]   ?? "#ec4899",
  };
}

interface AnimationThumbnailProps {
  template: Template;
  hovered: boolean;
}

export function AnimationThumbnail({ template, hovered }: AnimationThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const startRef  = useRef<number>(0);
  const { primary, secondary } = gradientToColors(template.gradient);

  const cfg = {
    ...DEFAULT_CONFIG,
    text: template.title.toUpperCase(),
    primaryColor: primary,
    secondaryColor: secondary,
    bgColor: "#0a0a0a",
    speed: 0.7,
    size: 0.85,
  };

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderFrame(ctx, 0.25, canvas.width, canvas.height, template.shape, cfg);
  }, [template.shape, primary, secondary]);

  const animate = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const t = ((ts - startRef.current) / 1000 * cfg.speed) % 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderFrame(ctx, t, canvas.width, canvas.height, template.shape, cfg);
    rafRef.current = requestAnimationFrame(animate);
  }, [template.shape, primary, secondary]);

  useEffect(() => {
    if (hovered) {
      startRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
      drawStatic();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered, animate, drawStatic]);

  // Draw static frame on mount
  useEffect(() => { drawStatic(); }, [drawStatic]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={180}
      className="w-full h-full object-cover"
    />
  );
}
