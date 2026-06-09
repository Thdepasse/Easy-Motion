"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Zap, Bell, ChevronDown, Plus } from "lucide-react";

export function Navbar() {
  const [isLoggedIn] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
          <Zap className="w-4 h-4 text-purple-300" />
        </div>
        <span className="font-bold text-lg tracking-tight gradient-text">Easy Motion</span>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {["Templates", "Projects", "Community", "Tutorials"].map((item) => (
          <Button key={item} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            {item}
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
            Tools <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 bg-popover border-border">
            {[
              "AI Motion Designer",
              "AI Typeface Animation",
              "AI Text Animation",
              "AI Animator",
              "AI Motion Graphics",
            ].map((tool) => (
              <DropdownMenuItem key={tool} className="text-sm cursor-pointer">
                {tool}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">JD</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              Log in
            </Button>
            <Button
              size="sm"
              className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 pulse-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Animation
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
