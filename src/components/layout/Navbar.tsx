"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/hooks/use-session";

export function Navbar() {
  const session = useSession();
  const name = [session?.prenom, session?.nom].filter(Boolean).join(" ") || "Régulateur";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="sticky top-0 z-20 px-6 pt-6 pb-2">
      <header className="flex h-16 items-center gap-4 rounded-2xl glass-card px-4 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <Breadcrumbs />
        </div>
        <div className="relative hidden md:block w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 h-10 bg-background/50 border-border/50 shadow-inner rounded-xl focus-visible:ring-primary/50 transition-all"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive live-pulse" />
        </Button>
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all hover:ring-primary/50">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold shadow-inner">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block cursor-pointer group">
            <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{name}</p>
            <p className="text-xs capitalize text-muted-foreground mt-1">
              {session?.role.project_type || "Régulateur"} · {session?.role.access_level || "-"}
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
