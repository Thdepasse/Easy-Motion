"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Heart, Clock } from "lucide-react";
import type { Template } from "@/lib/templates";

interface TemplateCardProps {
  template: Template;
}

const SHAPES: Record<Template["shape"], React.ReactNode> = {
  circle: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <circle cx="60" cy="40" r="28" fill="currentColor" opacity="0.3" />
      <circle cx="60" cy="40" r="18" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="40" r="8" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <rect x="30" y="18" width="60" height="44" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="40" y="26" width="40" height="28" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="50" y="34" width="20" height="12" rx="2" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <polygon points="60,8 110,72 10,72" fill="currentColor" opacity="0.2" />
      <polygon points="60,20 95,68 25,68" fill="currentColor" opacity="0.4" />
      <polygon points="60,34 82,64 38,64" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <path d="M0 50 Q20 30 40 50 Q60 70 80 50 Q100 30 120 50" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
      <path d="M0 40 Q20 20 40 40 Q60 60 80 40 Q100 20 120 40" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6" />
      <path d="M0 30 Q20 10 40 30 Q60 50 80 30 Q100 10 120 30" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.9" />
    </svg>
  ),
  dots: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {[20, 40, 60, 80, 100].flatMap((x) =>
        [20, 40, 60].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y}
            r={x === 60 && y === 40 ? 5 : 3}
            fill="currentColor"
            opacity={x === 60 && y === 40 ? 0.9 : 0.45}
          />
        ))
      )}
    </svg>
  ),
  lines: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {[16, 28, 40, 52, 64].map((y, i) => (
        <rect key={y} x={10 + i * 4} y={y} width={100 - i * 8} height="4" rx="2"
          fill="currentColor" opacity={0.3 + i * 0.15} />
      ))}
    </svg>
  ),
};

export function TemplateCard({ template }: TemplateCardProps) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl border border-border bg-card overflow-hidden card-hover cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center text-white/80">
          {SHAPES[template.shape]}
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" />
          {template.duration}
        </div>

        {template.featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded">
            FEATURED
          </div>
        )}

        {/* Hover overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Link href={`/editor/${template.id}`}>
              <Button size="sm" className="h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                <Pencil className="w-3.5 h-3.5" />
                Edit &amp; Export
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{template.title}</p>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {template.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`mt-0.5 flex-shrink-0 transition-colors ${liked ? "text-pink-500" : "text-muted-foreground hover:text-pink-400"}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
