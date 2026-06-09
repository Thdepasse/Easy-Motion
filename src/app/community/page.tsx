"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, Eye, Download, Trophy, Flame, Clock, Sparkles } from "lucide-react";

const GRADIENTS = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-red-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-fuchsia-500 to-pink-500",
  "from-blue-600 to-cyan-500",
  "from-lime-500 to-green-500",
];

const COMMUNITY_POSTS = [
  { id: "c1",  author: "alexdesign",    title: "Neon City Loop",       views: 12400, likes: 843,  downloads: 312,  tags: ["neon", "loop"],    gradient: GRADIENTS[0],  featured: true },
  { id: "c2",  author: "motionlab",     title: "Fluid Morph",          views: 9800,  likes: 621,  downloads: 204,  tags: ["fluid", "morph"],  gradient: GRADIENTS[1]  },
  { id: "c3",  author: "studiowave",    title: "Particle Storm",       views: 8200,  likes: 594,  downloads: 188,  tags: ["particles"],       gradient: GRADIENTS[2],  featured: true },
  { id: "c4",  author: "kreativ3",      title: "Type Explosion",       views: 7600,  likes: 502,  downloads: 167,  tags: ["text", "bold"],    gradient: GRADIENTS[3]  },
  { id: "c5",  author: "uxmotion",      title: "Smooth UI Kit",        views: 6900,  likes: 478,  downloads: 155,  tags: ["UI", "clean"],     gradient: GRADIENTS[4]  },
  { id: "c6",  author: "vibedesign",    title: "Retro Glitch",         views: 6300,  likes: 451,  downloads: 143,  tags: ["glitch", "retro"], gradient: GRADIENTS[5]  },
  { id: "c7",  author: "aftermotion",   title: "Golden Reveal",        views: 5800,  likes: 409,  downloads: 131,  tags: ["luxury"],          gradient: GRADIENTS[6],  featured: true },
  { id: "c8",  author: "pixelcraft",    title: "Bounce Pack",          views: 5200,  likes: 387,  downloads: 124,  tags: ["bounce", "fun"],   gradient: GRADIENTS[7]  },
  { id: "c9",  author: "signalstudio",  title: "Data Stream",          views: 4700,  likes: 356,  downloads: 109,  tags: ["data", "tech"],    gradient: GRADIENTS[8]  },
  { id: "c10", author: "formflow",      title: "Morph Shapes",         views: 4300,  likes: 334,  downloads: 102,  tags: ["morph", "geo"],    gradient: GRADIENTS[9]  },
  { id: "c11", author: "basecamp_d",    title: "Sky Drift",            views: 3900,  likes: 298,  downloads: 89,   tags: ["ambient"],         gradient: GRADIENTS[10] },
  { id: "c12", author: "motioneer",     title: "Spring Loop",          views: 3400,  likes: 267,  downloads: 81,   tags: ["spring", "loop"],  gradient: GRADIENTS[11] },
];

const FILTERS = ["Trending", "New", "Top all-time", "Following"] as const;
type Filter = typeof FILTERS[number];

function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function CommunityPage() {
  const [filter, setFilter] = useState<Filter>("Trending");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filtered = COMMUNITY_POSTS.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (filter === "New") return b.id.localeCompare(a.id);
    if (filter === "Top all-time") return b.downloads - a.downloads;
    return b.likes - a.likes;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">Community</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Discover animations created by the Easy Motion community.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Animations shared", value: "14,200+", icon: Sparkles },
              { label: "Community members", value: "3,800+",  icon: Trophy },
              { label: "Downloads this week", value: "9,100+", icon: Download },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter + Search */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {f === "Trending" && <Flame className="w-3 h-3" />}
                  {f === "New" && <Clock className="w-3 h-3" />}
                  {f}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search creators or titles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 w-56 bg-secondary border-border text-sm"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((post) => (
              <div key={post.id} className="group rounded-xl border border-border bg-card overflow-hidden card-hover cursor-pointer">
                <div className={`relative h-36 bg-gradient-to-br ${post.gradient}`}>
                  {post.featured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur text-yellow-400 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      <Trophy className="w-2.5 h-2.5" /> Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="h-7 text-xs bg-white text-black hover:bg-white/90 gap-1">
                      <Eye className="w-3 h-3" /> View
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">@{post.author}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <button
                      className={`flex items-center gap-1 transition-colors ${liked.has(post.id) ? "text-pink-500" : "hover:text-pink-400"}`}
                      onClick={() => setLiked((prev) => {
                        const next = new Set(prev);
                        next.has(post.id) ? next.delete(post.id) : next.add(post.id);
                        return next;
                      })}
                    >
                      <Heart className={`w-3 h-3 ${liked.has(post.id) ? "fill-current" : ""}`} />
                      {fmtNum(post.likes + (liked.has(post.id) ? 1 : 0))}
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />{fmtNum(post.views)}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Download className="w-3 h-3" />{fmtNum(post.downloads)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
