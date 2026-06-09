"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Zap, Maximize, RotateCcw } from "lucide-react";
import type { AnimationConfig } from "@/lib/animations";
import { DEFAULT_CONFIG } from "@/lib/animations";

interface EditorControlsProps {
  config: AnimationConfig;
  onChange: (cfg: AnimationConfig) => void;
}

function Slider({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="text-xs font-mono text-foreground tabular-nums">{value.toFixed(1)}x</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-secondary [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}x</span><span>{max}x</span>
      </div>
    </div>
  );
}

function ColorPicker({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-muted-foreground flex-1">{label}</label>
      <div className="relative">
        <input
          type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-16">{value}</span>
    </div>
  );
}

export function EditorControls({ config, onChange }: EditorControlsProps) {
  const update = <K extends keyof AnimationConfig>(key: K, val: AnimationConfig[K]) =>
    onChange({ ...config, [key]: val });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Text */}
      <section className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text</span>
        </div>
        <Input
          value={config.text}
          onChange={(e) => update("text", e.target.value.toUpperCase())}
          placeholder="Animation text…"
          className="h-8 text-sm bg-secondary border-border uppercase tracking-widest"
          maxLength={20}
        />
        <p className="text-[10px] text-muted-foreground mt-1.5">{config.text.length}/20 characters</p>
      </section>

      {/* Colors */}
      <section className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</span>
        </div>
        <div className="space-y-2.5">
          <ColorPicker label="Primary"    value={config.primaryColor}   onChange={(v) => update("primaryColor", v)} />
          <ColorPicker label="Secondary"  value={config.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
          <ColorPicker label="Background" value={config.bgColor}        onChange={(v) => update("bgColor", v)} />
        </div>

        {/* Preset palettes */}
        <p className="text-[10px] text-muted-foreground mt-3 mb-2">Presets</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: "Purple",  p: "#a855f7", s: "#ec4899", bg: "#0d0d0d" },
            { name: "Cyan",    p: "#06b6d4", s: "#3b82f6", bg: "#030f1a" },
            { name: "Orange",  p: "#f97316", s: "#ef4444", bg: "#0f0800" },
            { name: "Green",   p: "#22c55e", s: "#10b981", bg: "#021008" },
            { name: "White",   p: "#ffffff", s: "#a1a1aa", bg: "#000000" },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange({ ...config, primaryColor: preset.p, secondaryColor: preset.s, bgColor: preset.bg })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border hover:border-primary/50 transition-colors text-[11px] text-muted-foreground hover:text-foreground"
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${preset.p}, ${preset.s})` }} />
              {preset.name}
            </button>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Speed</span>
        </div>
        <Slider label="Animation speed" value={config.speed} min={0.2} max={3} step={0.1}
          onChange={(v) => update("speed", v)} />
      </section>

      {/* Size */}
      <section className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Maximize className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scale</span>
        </div>
        <Slider label="Element size" value={config.size} min={0.4} max={1.6} step={0.05}
          onChange={(v) => update("size", v)} />
      </section>

      {/* Reset */}
      <div className="p-4 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 gap-2 text-xs border-border text-muted-foreground hover:text-foreground"
          onClick={() => onChange({ ...DEFAULT_CONFIG, text: config.text })}
        >
          <RotateCcw className="w-3 h-3" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
