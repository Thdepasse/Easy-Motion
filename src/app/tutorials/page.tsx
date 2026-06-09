"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Clock, Play, ChevronRight } from "lucide-react";

type Level = "All" | "Beginner" | "Intermediate" | "Advanced";
type Category = "All" | "Basics" | "Text" | "Logos" | "Export" | "AI Tools";

const TUTORIALS = [
  { id: "tu1",  title: "Getting Started with Easy Motion",     level: "Beginner",     category: "Basics",    duration: "5 min",  views: 8400,  description: "Learn the interface, templates, and how to export your first animation." },
  { id: "tu2",  title: "Create Your First Text Animation",     level: "Beginner",     category: "Text",      duration: "8 min",  views: 6200,  description: "Step-by-step guide to kinetic typography using the text editor." },
  { id: "tu3",  title: "Logo Reveal in 60 Seconds",            level: "Beginner",     category: "Logos",     duration: "7 min",  views: 5900,  description: "Build a clean liquid logo reveal from scratch." },
  { id: "tu4",  title: "Exporting as WebM for Social Media",   level: "Beginner",     category: "Export",    duration: "4 min",  views: 5100,  description: "Best settings for Instagram, TikTok, and YouTube exports." },
  { id: "tu5",  title: "Mastering Color Palettes",             level: "Intermediate", category: "Basics",    duration: "10 min", views: 4700,  description: "How to use primary, secondary and background colors for professional results." },
  { id: "tu6",  title: "Advanced Particle Effects",            level: "Intermediate", category: "Basics",    duration: "14 min", views: 4200,  description: "Control particle density, speed, and orbits to create stunning visuals." },
  { id: "tu7",  title: "Animated Lower Thirds for YouTube",    level: "Intermediate", category: "Text",      duration: "12 min", views: 3900,  description: "Create broadcast-quality lower thirds that stand out." },
  { id: "tu8",  title: "Using AI Motion Designer",             level: "Intermediate", category: "AI Tools",  duration: "9 min",  views: 3600,  description: "How to give the AI a brief and iterate on the result." },
  { id: "tu9",  title: "AI Typeface Animation Deep Dive",      level: "Advanced",     category: "AI Tools",  duration: "18 min", views: 3100,  description: "Unlock advanced kinetic typography with AI-generated character paths." },
  { id: "tu10", title: "Building a Full Brand Kit",            level: "Advanced",     category: "Logos",     duration: "22 min", views: 2800,  description: "Combine logo, lower third, transition, and outro into a cohesive package." },
  { id: "tu11", title: "Frame-Perfect PNG Exports",            level: "Advanced",     category: "Export",    duration: "11 min", views: 2400,  description: "Use the frame capture tool for high-res thumbnails and print assets." },
  { id: "tu12", title: "Sync Animations to a Beat",            level: "Advanced",     category: "Basics",    duration: "16 min", views: 2100,  description: "Match animation speed and keyframes to audio timing." },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "bg-green-500/15 text-green-400",
  Intermediate: "bg-yellow-500/15 text-yellow-400",
  Advanced:     "bg-red-500/15 text-red-400",
};

const LEVELS: Level[] = ["All", "Beginner", "Intermediate", "Advanced"];
const CATEGORIES: Category[] = ["All", "Basics", "Text", "Logos", "Export", "AI Tools"];

export default function TutorialsPage() {
  const [level, setLevel] = useState<Level>("All");
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = TUTORIALS.filter((t) => {
    const matchLevel = level === "All" || t.level === level;
    const matchCat = category === "All" || t.category === category;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">Tutorials</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Learn to create professional animations, from beginner to advanced.
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    level === l
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {l}
                </button>
              ))}
              <div className="relative ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 w-52 bg-secondary border-border text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    category === c
                      ? "bg-secondary text-foreground font-medium border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial list */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No tutorials found for those filters.
              </div>
            ) : (
              filtered.map((tut, i) => (
                <div
                  key={tut.id}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all cursor-pointer card-hover"
                >
                  {/* Number */}
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-mono text-muted-foreground flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Play button */}
                  <div className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Play className="w-4 h-4 text-primary fill-current" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{tut.title}</p>
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 border-0 ${LEVEL_COLORS[tut.level]}`}>
                        {tut.level}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground">
                        {tut.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{tut.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{tut.duration}
                    </span>
                    <span>{(tut.views / 1000).toFixed(1)}k views</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
