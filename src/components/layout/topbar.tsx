import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouterState } from "@tanstack/react-router";

export function Topbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/90 backdrop-blur px-6">
      <div className="flex-1 min-w-0">
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>Monitrix</span>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span>/</span>
              <span className={i === crumbs.length - 1 ? "text-foreground font-medium capitalize" : "capitalize"}>{c.replace(/-/g, " ")}</span>
            </span>
          ))}
        </nav>
      </div>
      <div className="relative hidden md:block w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9 h-9 bg-muted/40 border-border/60" />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>
      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">AD</AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium leading-none">Aminata Diallo</p>
          <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
        </div>
      </div>
    </header>
  );
}
