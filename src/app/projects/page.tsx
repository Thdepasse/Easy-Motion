"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Trash2, Pencil, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthDialog } from "@/components/AuthDialog";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

export default function ProjectsPage() {
  const { user, projects, removeProject } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
            <FolderOpen className="w-7 h-7 text-purple-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your projects</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
              Sign in to save your animations and access them from anywhere.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-border" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setAuthOpen(true)}>
              Create free account
            </Button>
          </div>
        </div>
        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Projects</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {projects.length} saved animation{projects.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link href="/">
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-3.5 h-3.5" />
                New animation
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-border gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Zap className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium">No saved projects yet</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Edit a template and save it to find it here.
                </p>
              </div>
              <Link href="/">
                <Button size="sm" variant="outline" className="border-border">
                  Browse templates
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="group rounded-xl border border-border bg-card overflow-hidden card-hover">
                  <div className={`h-36 bg-gradient-to-br ${project.templateGradient} relative flex items-center justify-center`}>
                    <div className="text-white/70 text-xs font-mono uppercase tracking-widest">
                      {project.templateShape}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Link href={`/editor/${project.templateId}`}>
                        <Button size="sm" className="h-7 gap-1 bg-white text-black hover:bg-white/90 text-xs">
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 w-7 p-0"
                        onClick={() => removeProject(project.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground">
                        {project.templateTitle}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(project.savedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
