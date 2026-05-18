import { Bell, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/70 bg-background/85 backdrop-blur-xl px-6">
      <div className="flex-1 min-w-0">
        <Breadcrumbs />
      </div>
      <div className="relative hidden md:block w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-9 h-9 bg-card/80 border-border/70 shadow-none"
        />
      </div>
      <Button variant="ghost" size="icon" className="relative rounded-md">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>
      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            AD
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium leading-none">Aminata Diallo</p>
          <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
        </div>
      </div>
    </header>
  );
}
