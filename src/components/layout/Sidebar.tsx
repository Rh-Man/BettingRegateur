"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Dices,
  CreditCard,
  ShieldCheck,
  Receipt,
  ClipboardList,
  Bell,
  FileBarChart,
  FolderOpen,
  Settings,
  UserCircle,
  ChevronDown,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/hooks/use-session";
import { canAccessProject, canWrite } from "@/lib/access";
import { clearSession } from "@/lib/session";
import type { ProjectType } from "@/types/auth";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { to: string; label: string }[];
  project?: ProjectType;
  bettingOnly?: boolean;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/dashboard/betting/dashboard",
    label: "Paris",
    icon: Dices,
    project: "betting",
    children: [
      { to: "/dashboard/betting/dashboard", label: "Vue d'ensemble" },
      { to: "/dashboard/betting/history", label: "Historique" },
    ],
  },
  {
    to: "/dashboard/payments/dashboard",
    label: "Paiements",
    icon: CreditCard,
    project: "payment",
    children: [
      { to: "/dashboard/payments/dashboard", label: "Vue d'ensemble" },
      { to: "/dashboard/payments/history", label: "Historique" },
      { to: "/dashboard/payments/settlements", label: "Règlements" },
      { to: "/dashboard/payments/wallets", label: "Portefeuilles" },
    ],
  },
  {
    to: "/dashboard/kyc/all",
    label: "KYC",
    icon: ShieldCheck,
    bettingOnly: true,
    children: [
      { to: "/dashboard/kyc/all", label: "Tous les utilisateurs" },
      { to: "/dashboard/kyc/pending", label: "En attente" },
    ],
  },
  {
    to: "/dashboard/taxes",
    label: "Taxes",
    icon: Receipt,
    bettingOnly: true,
    children: [
      { to: "/dashboard/taxes", label: "Dashboard" },
      { to: "/dashboard/taxes/liste", label: "Factures" },
      { to: "/dashboard/taxes/reversements", label: "Reversements" },
    ],
  },
  { to: "/dashboard/audit/logs", label: "Audit", icon: ClipboardList },
  { to: "/dashboard/alerts", label: "Alertes", icon: Bell, project: "monitoring" },
  { to: "/dashboard/reports", label: "Rapports", icon: FileBarChart },
  { to: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const session = useSession();
  const visibleNav = NAV.filter((item) => {
    if (!session) return item.to === "/dashboard";
    if (item.project && !canAccessProject(session.role, item.project)) return false;
    if (item.bettingOnly && !canAccessProject(session.role, "betting")) return false;
    if (item.adminOnly && !canWrite(session.role)) return false;
    return true;
  });
  const userName = [session?.prenom, session?.nom].filter(Boolean).join(" ") || "Régulateur";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel =
    session?.role.access_level === "viewer" ? "Viewer · Lecture seule" : "Administrateur";

  const isActive = (to: string) => {
    // Pour le dashboard principal, vérifier l'égalité exacte
    if (to === "/dashboard") {
      return pathname === "/dashboard";
    }
    // Pour les autres routes, vérifier si le pathname commence par la route
    return pathname === to || pathname.startsWith(to + "/");
  };

  const isParentActive = (item: NavItem) => {
    // Si l'item a des enfants, vérifier si un des enfants est actif
    if (item.children && item.children.length > 0) {
      return item.children.some(child => pathname === child.to);
    }
    return isActive(item.to);
  };

  const handleLogout = () => {
    clearSession();
    router.replace("/auth/login");
  };

  return (
    <>
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-1 overflow-x-auto rounded-2xl border border-sidebar-border/40 bg-sidebar/95 p-2 text-sidebar-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl md:hidden">
      {visibleNav.map((item) => {
        const Icon = item.icon;
        const active = isParentActive(item);

        return (
          <Link
            key={item.label}
            href={item.to}
            className={cn(
              "flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
              active
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/dashboard/profil"
        className={cn(
          "flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
          pathname === "/dashboard/profil"
            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        <UserCircle className="h-5 w-5" />
        <span className="max-w-full truncate">Profil</span>
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <LogOut className="h-5 w-5" />
        <span className="max-w-full truncate">Sortir</span>
      </button>
    </nav>

    <div className="relative p-6 pr-0 h-screen hidden md:block">
      <aside 
        className={cn(
          "flex shrink-0 flex-col bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground border border-sidebar-border/50 shadow-2xl shadow-primary/5 rounded-2xl h-[calc(100vh-3rem)] sticky top-6 transition-all duration-300 overflow-visible",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button - Floating Arrow */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-8 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-primary/20 hover:text-primary focus:outline-none"
          title={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

      {/* Header - Fixed */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/50 shrink-0">
        {!collapsed && (
          <>
            <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden shadow-inner bg-background">
              <Image
                src="/logo-small.png"
                alt="Monitrix Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Monitrix</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
                Régulation
              </p>
            </div>
          </>
        )}
        {collapsed && (
          <div className="relative h-10 w-10 shrink-0 mx-auto rounded-xl overflow-hidden shadow-inner bg-background">
            <Image
              src="/logo-small.png"
              alt="Monitrix Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = isParentActive(item);
            const hasChildren = !!item.children?.length;
            const expanded = open[item.label] ?? active;
            
            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => setOpen((p) => ({ ...p, [item.label]: !expanded }))}
                        className={cn(
                          "flex w-full items-center justify-center rounded-xl p-3 text-sm font-medium transition-all duration-300",
                          active
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-105",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ) : (
                      <Link
                        href={item.to}
                        className={cn(
                          "flex items-center justify-center rounded-xl p-3 text-sm font-medium transition-all duration-300",
                          active
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-105",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold px-3 py-1.5 ml-2 border-border/50 shadow-xl">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.label} className="mb-1">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setOpen((p) => ({ ...p, [item.label]: !expanded }))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                      active
                        ? "text-primary-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    {active && <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100" />}
                    {!active && <div className="absolute inset-0 bg-sidebar-accent opacity-0 group-hover:opacity-50 transition-opacity" />}
                    <Icon className="h-5 w-5 shrink-0 relative z-10" />
                    <span className="flex-1 text-left truncate relative z-10">{item.label}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 transition-transform duration-300 relative z-10", expanded && "rotate-180")}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                      active
                        ? "text-primary-foreground shadow-md scale-[1.02]"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:scale-[1.02]",
                    )}
                  >
                    {active && <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100" />}
                    {!active && <div className="absolute inset-0 bg-sidebar-accent opacity-0 group-hover:opacity-50 transition-opacity" />}
                    <Icon className="h-5 w-5 shrink-0 relative z-10" />
                    <span className="truncate relative z-10">{item.label}</span>
                  </Link>
                )}
                {hasChildren && expanded && (
                  <div className="mt-1.5 ml-5 pl-4 border-l-2 border-primary/20 space-y-1 relative">
                    {item.children!.map((c) => {
                      const a = pathname === c.to;
                      return (
                         <div key={c.to} className="relative">
                          {a && <div className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />}
                          <Link
                            href={c.to}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                              a
                                ? "text-primary font-bold bg-primary/5"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 font-medium",
                            )}
                          >
                            {c.label}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* User Section - Fixed at bottom */}
      <div className="p-4 shrink-0 mt-auto border-t border-sidebar-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-xl p-2 transition-all duration-300 hover:bg-sidebar-accent focus:outline-none ring-2 ring-transparent hover:ring-primary/20"
              >
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-sidebar">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold shadow-inner">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all duration-300 hover:bg-sidebar-accent focus:outline-none ring-2 ring-transparent hover:ring-primary/20 group"
              >
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-sidebar transition-all group-hover:ring-primary/50">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold shadow-inner">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-sidebar-foreground group-hover:text-primary transition-colors">{userName}</p>
                  <p className="truncate text-xs font-medium text-sidebar-foreground/50">{roleLabel}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0 transition-transform group-hover:text-sidebar-foreground" />
              </button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-64 rounded-xl border-border/50 shadow-xl glass-card z-50">
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {session?.email || "-"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="p-2.5 cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:text-primary">
              <Link href="/dashboard/profil">
                <User className="h-4 w-4 mr-2" />
                <span className="font-semibold">Mon compte</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              className="text-destructive p-2.5 cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors focus:bg-destructive/10 focus:text-destructive font-semibold"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </aside>
    </div>
    </>
  );
}
