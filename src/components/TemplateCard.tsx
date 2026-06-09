"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Heart, Clock } from "lucide-react";
import type { Template } from "@/lib/templates";
import { AnimationThumbnail } from "./AnimationThumbnail";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl border border-border bg-card overflow-hidden card-hover cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Live canvas thumbnail */}
      <div className="relative h-40 overflow-hidden bg-[#0a0a0a]">
        <AnimationThumbnail template={template} hovered={hovered} />

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
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
