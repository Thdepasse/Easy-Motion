"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap, ChevronDown, Plus, User, FolderOpen,
  Settings, LogOut, Crown, Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "./AuthDialog";

const NAV_LINKS = [
  { label: "Templates",  href: "/" },
  { label: "Projects",   href: "/projects" },
  { label: "Community",  href: "/community" },
  { label: "Tutorials",  href: "/tutorials" },
];

const AI_TOOLS = [
  { label: "AI Motion Designer",   href: "/?tool=motion-designer",   badge: "New" },
  { label: "AI Typeface Animation", href: "/?tool=typeface",          badge: null },
  { label: "AI Text Animation",     href: "/?tool=text-animation",    badge: null },
  { label: "AI Animator",           href: "/?tool=animator",          badge: "Beta" },
  { label: "AI Motion Graphics",    href: "/?tool=motion-graphics",   badge: null },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openLogin = () => { setAuthTab("login"); setAuthOpen(true); };
  const openSignup = () => { setAuthTab("signup"); setAuthOpen(true); };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50 flex items-center px-4 gap-1">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-3 min-w-max">
          <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
            <Zap className="w-4 h-4 text-purple-300" />
          </div>
          <span className="font-bold text-base tracking-tight gradient-text">Easy Motion</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm h-8 ${
                  isActive(href)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Button>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 h-8 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
              Tools <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
              {AI_TOOLS.map(({ label, href, badge }) => (
                <DropdownMenuItem key={label} className="p-0">
                  <Link href={href} className="flex items-center justify-between w-full px-2 py-1.5 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                      {label}
                    </span>
                    {badge && (
                      <Badge className="text-[9px] px-1 py-0 h-3.5 bg-primary/20 text-primary border-0">
                        {badge}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/editor/t1">
            <Button size="sm" className="h-8 text-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 hidden sm:flex">
              <Plus className="w-3.5 h-3.5" />
              Create
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-secondary transition-colors">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px] font-bold bg-primary/20 text-primary">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block max-w-24 truncate">{user.name}</span>
                {user.plan === "pro" && (
                  <Crown className="w-3 h-3 text-yellow-400 hidden sm:block" />
                )}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-popover border-border">
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <Badge className={`mt-1.5 text-[10px] px-1.5 py-0 h-4 border-0 ${
                    user.plan === "pro"
                      ? "bg-yellow-400/20 text-yellow-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {user.plan === "pro" ? "✦ Pro" : "Free plan"}
                  </Badge>
                </div>
                <DropdownMenuItem className="p-0">
                  <Link href="/account" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <User className="w-3.5 h-3.5" /> My account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/projects" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <FolderOpen className="w-3.5 h-3.5" /> My projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/account/settings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </Link>
                </DropdownMenuItem>
                {user.plan === "free" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer text-primary focus:text-primary focus:bg-primary/10">
                      <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="gap-2 cursor-pointer text-muted-foreground focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="h-8 text-sm text-muted-foreground hover:text-foreground" onClick={openLogin}>
                Sign in
              </Button>
              <Button size="sm" className="h-8 text-sm bg-primary hover:bg-primary/90 text-primary-foreground" onClick={openSignup}>
                Sign up free
              </Button>
            </>
          )}
        </div>
      </header>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
