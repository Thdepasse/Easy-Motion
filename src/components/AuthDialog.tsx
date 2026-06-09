"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthDialog({ open, onClose, defaultTab = "login" }: AuthDialogProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  const reset = () => { setName(""); setEmail(""); setPassword(""); setError(""); setLoading(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (tab === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (tab === "login") await login(email, password);
      else await signup(name, email, password);
      reset();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const switchTab = (t: "login" | "signup") => { setTab(t); setError(""); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[380px] bg-card border-border p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-300" />
            </div>
            <span className="font-bold text-base gradient-text">Easy Motion</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "login"
                ? "Sign in to access your projects and exports."
                : "Start creating animations for free."}
            </p>
          </DialogHeader>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-9 bg-secondary border-border text-sm"
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9 bg-secondary border-border text-sm"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 bg-secondary border-border text-sm pr-9"
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-sm mt-1"
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />Please wait…</>
            ) : tab === "login" ? "Sign in" : "Create account"}
          </Button>

          {tab === "signup" && (
            <p className="text-[11px] text-muted-foreground text-center">
              By signing up, you agree to our{" "}
              <span className="text-foreground cursor-pointer hover:underline">Terms</span> and{" "}
              <span className="text-foreground cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
