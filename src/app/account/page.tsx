"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";
import { User, Crown, FolderOpen, Download, Pencil, Zap } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, projects } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name ?? "");

  if (!user) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
            <User className="w-7 h-7 text-purple-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your account</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
              Sign in to manage your profile, projects and exports.
            </p>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setAuthOpen(true)}>
            Sign in or create account
          </Button>
        </div>
        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
      </div>
    );
  }

  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Profile card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-8 w-48 text-sm bg-secondary border-border"
                      autoFocus
                    />
                    <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setEditing(false)}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setDisplayName(user.name); setEditing(false); }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold">{displayName || user.name}</h1>
                    <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs px-2 py-0.5 border-0 ${user.plan === "pro" ? "bg-yellow-400/20 text-yellow-400" : "bg-muted text-muted-foreground"}`}>
                    {user.plan === "pro" ? "✦ Pro" : "Free plan"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Member since {joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: FolderOpen, label: "Saved projects", value: projects.length },
              { icon: Download,   label: "Total exports",  value: projects.length * 2 },
              { icon: Zap,        label: "Animations made", value: projects.length + 3 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Plan */}
          {user.plan === "free" && (
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-pink-500/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">Upgrade to Pro</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    {["Unlimited exports (HD quality)", "All AI tools unlocked", "Priority rendering", "No watermarks"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-primary">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold">$9<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                  <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                    Upgrade now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {[
              { label: "My Projects",  sub: `${projects.length} saved animations`, href: "/projects", icon: FolderOpen },
              { label: "Settings",     sub: "Email, password, notifications",       href: "/account/settings", icon: User },
            ].map(({ label, sub, href, icon: Icon }) => (
              <Link key={label} href={href} className="flex items-center gap-4 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <span className="text-muted-foreground text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
