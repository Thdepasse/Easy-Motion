"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  FolderOpen,
  Users,
  BookOpen,
  Sparkles,
  Wand2,
  Type,
  Film,
  BarChart3,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";

const AI_TOOLS = [
  { icon: Sparkles, label: "AI Motion Designer", badge: "New" },
  { icon: Type,     label: "AI Typeface Anim.",  badge: null },
  { icon: Wand2,    label: "AI Text Animation",  badge: null },
  { icon: Film,     label: "AI Animator",        badge: "Beta" },
  { icon: BarChart3, label: "AI Motion Graphics", badge: null },
];

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Templates",  active: true },
  { icon: FolderOpen, label: "Projects",   active: false },
  { icon: Users,      label: "Community",  active: false },
  { icon: BookOpen,   label: "Tutorials",  active: false },
];

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-background flex flex-col h-full">
      {/* Navigation */}
      <div className="p-3 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div className="mx-3 border-t border-border" />

      {/* AI Tools section */}
      <div className="p-3 flex-1">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          AI Tools
        </p>
        <div className="space-y-0.5">
          {AI_TOOLS.map(({ icon: Icon, label, badge }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors group"
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-primary/70 group-hover:text-primary" />
              <span className="truncate flex-1 text-left">{label}</span>
              {badge ? (
                <Badge className="text-[9px] px-1 py-0 h-3.5 bg-primary/20 text-primary border-0">
                  {badge}
                </Badge>
              ) : (
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/20 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Go Pro</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Unlock unlimited exports, HD quality, and all AI tools.
          </p>
          <Button size="sm" className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
