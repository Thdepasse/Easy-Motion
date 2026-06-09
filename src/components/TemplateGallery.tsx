"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { CATEGORIES, TEMPLATES, type Category } from "@/lib/templates";

export function TemplateGallery() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Hero banner */}
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-pink-500/5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Animation Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {TEMPLATES.length} professional templates — powered by AI
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-9">
            <Sparkles className="w-3.5 h-3.5" />
            Create with AI
          </Button>
        </div>

        {/* Search + filter bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 bg-secondary border-border text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border text-muted-foreground hover:text-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const count = cat === "All" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
              <Badge
                className={`text-[10px] px-1 py-0 h-4 border-0 ${
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <Search className="w-8 h-8 opacity-40" />
            <p className="text-sm">No templates found for &quot;{search}&quot;</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
