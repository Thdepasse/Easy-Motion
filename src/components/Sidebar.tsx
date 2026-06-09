"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid, FolderOpen, Users, BookOpen,
  Sparkles, Wand2, Type, Film, BarChart3,
  ChevronRight, ChevronDown, Zap, Plus,
  User, Settings, LogOut, Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "./AuthDialog";

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Templates",  href: "/" },
  { icon: FolderOpen, label: "Projects",   href: "/projects" },
  { icon: Users,      label: "Community",  href: "/community" },
  { icon: BookOpen,   label: "Tutorials",  href: "/tutorials" },
];

const AI_TOOLS = [
  { icon: Sparkles, label: "AI Motion Designer",  badge: "New"  },
  { icon: Type,     label: "AI Typeface Anim.",   badge: null   },
  { icon: Wand2,    label: "AI Text Animation",   badge: null   },
  { icon: Film,     label: "AI Animator",         badge: "Beta" },
  { icon: BarChart3, label: "AI Motion Graphics", badge: null   },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <aside className="w-56 flex-shrink-0 border-r border-border bg-background flex flex-col h-full">

        {/* ── Logo ─────────────────────────────────────────── */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-300" />
            </div>
            <span className="font-bold text-base tracking-tight gradient-text">Easy Motion</span>
          </Link>
          <Link href="/editor/t1">
            <Button size="icon" className="w-7 h-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* ── Main nav ─────────────────────────────────────── */}
        <nav className="p-3 space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            </Link>
          ))}
        </nav>

        <div className="mx-3 border-t border-border" />

        {/* ── AI Tools ─────────────────────────────────────── */}
        <div className="p-3 flex-1 overflow-y-auto">
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

        {/* ── Upgrade CTA (free users) ──────────────────────── */}
        {(!user || user.plan === "free") && (
          <div className="px-3 pb-3">
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/20 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold">Go Pro</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unlimited exports, HD quality, all AI tools.
              </p>
              <Button size="sm" className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* ── Account ──────────────────────────────────────── */}
        <div className="px-3 pb-3 border-t border-border pt-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="text-[10px] font-bold bg-primary/20 text-primary">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.plan === "pro" ? "✦ Pro" : "Free plan"}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-52 bg-popover border-border mb-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem className="p-0">
                  <Link href="/account" className="flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer">
                    <User className="w-3.5 h-3.5" /> My account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/projects" className="flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer">
                    <FolderOpen className="w-3.5 h-3.5" /> My projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/account/settings" className="flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer">
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </Link>
                </DropdownMenuItem>
                {user.plan === "free" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer text-primary focus:text-primary focus:bg-primary/10 text-sm">
                      <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="gap-2 cursor-pointer text-muted-foreground focus:text-destructive focus:bg-destructive/10 text-sm"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs border-border text-muted-foreground hover:text-foreground"
                onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </aside>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
