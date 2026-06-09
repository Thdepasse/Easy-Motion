"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";
import { Settings, Bell, Shield, Trash2, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ community: true, exports: true, tips: false });

  if (!user) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Button onClick={() => setAuthOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign in to access settings
          </Button>
        </div>
        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
          </div>

          {/* Profile settings */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold">Profile</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Display name</label>
                <Input defaultValue={user.name} className="h-9 bg-secondary border-border text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input defaultValue={user.email} type="email" className="h-9 bg-secondary border-border text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">New password</label>
              <Input placeholder="Leave blank to keep current" type="password" className="h-9 bg-secondary border-border text-sm" />
            </div>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              onClick={handleSave}
            >
              {saved ? <><Check className="w-3 h-3" />Saved!</> : "Save changes"}
            </Button>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Notifications</h2>
            </div>
            {[
              { key: "community" as const, label: "Community activity", sub: "Likes and comments on your animations" },
              { key: "exports"   as const, label: "Export ready",       sub: "When your animation export is complete" },
              { key: "tips"      as const, label: "Tips & tutorials",   sub: "Weekly design tips and new tutorials" },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between py-2 border-t border-border first:border-t-0">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${notifications[key] ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </section>

          {/* Privacy */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Privacy & Security</h2>
            </div>
            {[
              { label: "Public profile",         sub: "Allow others to view your profile and animations", on: true },
              { label: "Show in community feed",  sub: "Your exports can appear in the community gallery", on: false },
            ].map(({ label, sub, on }, i) => {
              const [active, setActive] = useState(on);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-t border-border first:border-t-0">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <button
                    onClick={() => setActive(!active)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${active ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </section>

          {/* Danger zone */}
          <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Trash2 className="w-4 h-4 text-destructive" />
              <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out everywhere</p>
                <p className="text-xs text-muted-foreground">End all active sessions</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10" onClick={logout}>
                Sign out
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-destructive/20 pt-3">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your data</p>
              </div>
              <Button size="sm" variant="destructive" className="h-8 text-xs opacity-70 hover:opacity-100">
                Delete
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
