"use client";

import { useRef, useEffect, useCallback } from "react";
import { renderFrame, type AnimationConfig } from "@/lib/animations";

interface AnimationCanvasProps {
  shape: string;
  config: AnimationConfig;
  width?: number;
  height?: number;
  className?: string;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function AnimationCanvas({
  shape,
  config,
  width = 640,
  height = 360,
  className,
  canvasRef: externalRef,
}: AnimationCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalRef ?? internalRef;
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const animate = useCallback(
    (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const t = (elapsed * config.speed) % 1;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      renderFrame(ctx, t, width, height, shape, config);
      rafRef.current = requestAnimationFrame(animate);
    },
    [shape, config, width, height, canvasRef],
  );

  useEffect(() => {
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      width={width}
      height={height}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
