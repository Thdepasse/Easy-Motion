"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimationCanvas } from "@/components/AnimationCanvas";
import { EditorControls } from "@/components/EditorControls";
import { DEFAULT_CONFIG, type AnimationConfig, renderFrame } from "@/lib/animations";
import {
  Download, Play, Pause, ArrowLeft, Loader2,
  Video, FileImage, Zap,
} from "lucide-react";
import Link from "next/link";
import type { Template } from "@/lib/templates";

interface EditorClientProps {
  template: Template;
}

export function EditorClient({ template }: EditorClientProps) {
  const [config, setConfig] = useState<AnimationConfig>({
    ...DEFAULT_CONFIG,
    text: template.title.toUpperCase(),
  });
  const [playing, setPlaying] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"webm" | "gif">("webm");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Export as WebM via MediaRecorder ──────────────────────────────────────
  const exportWebM = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 2_500_000,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.title.toLowerCase().replace(/\s+/g, "-")}-easymotion.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    };

    const duration = (1 / config.speed) * 1000; // one cycle
    recorder.start();
    setTimeout(() => recorder.stop(), Math.max(1000, Math.min(duration, 4000)));
  }, [config.speed, template.title]);

  // ── Export as PNG sequence (one frame) ────────────────────────────────────
  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderFrame(ctx, 0, canvas.width, canvas.height, template.shape, config);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.title.toLowerCase().replace(/\s+/g, "-")}-easymotion.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [template.shape, template.title, config]);

  const handleExport = () => {
    if (exportFormat === "webm") exportWebM();
    else exportPNG();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center px-4 gap-3 bg-background/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded gradient-bg flex items-center justify-center">
            <Zap className="w-3 h-3 text-purple-300" />
          </div>
          <span className="font-semibold text-sm gradient-text">Easy Motion</span>
        </div>
        <span className="text-muted-foreground text-sm">/ Editor</span>
        <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground ml-1">
          {template.category}
        </Badge>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs border-border text-muted-foreground"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? "Pause" : "Play"}
          </Button>

          {/* Format toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["webm", "gif"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  exportFormat === fmt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {fmt === "webm" ? (
                  <span className="flex items-center gap-1"><Video className="w-3 h-3" />WebM</span>
                ) : (
                  <span className="flex items-center gap-1"><FileImage className="w-3 h-3" />PNG</span>
                )}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <><Loader2 className="w-3 h-3 animate-spin" />Recording…</>
            ) : (
              <><Download className="w-3 h-3" />Export</>
            )}
          </Button>
        </div>
      </header>

      {/* Editor layout */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center bg-[#060606] relative overflow-hidden">
          {/* Checkerboard bg hint */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, transparent 0% 50%)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative shadow-2xl rounded-xl overflow-hidden">
            {playing ? (
              <AnimationCanvas
                shape={template.shape}
                config={config}
                width={640}
                height={360}
                canvasRef={canvasRef}
                className="block"
              />
            ) : (
              <AnimationCanvas
                shape={template.shape}
                config={{ ...config, speed: 0 }}
                width={640}
                height={360}
                canvasRef={canvasRef}
                className="block"
              />
            )}
          </div>

          {/* Size indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur text-muted-foreground text-[11px] px-3 py-1 rounded-full">
            640 × 360 px
          </div>
        </div>

        {/* Controls panel */}
        <aside className="w-64 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-foreground">{template.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Customize your animation</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <EditorControls config={config} onChange={setConfig} />
          </div>
        </aside>
      </div>

      {exporting && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3 shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="font-medium text-sm">Recording animation…</p>
            <p className="text-xs text-muted-foreground">Capturing one full cycle</p>
          </div>
        </div>
      )}
    </div>
  );
}
