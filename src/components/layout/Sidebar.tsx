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

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { to: string; label: string }[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/dashboard/betting/dashboard",
    label: "Paris",
    icon: Dices,
    children: [
      { to: "/dashboard/betting/dashboard", label: "Vue d'ensemble" },
      { to: "/dashboard/betting/history", label: "Historique" },
    ],
  },
  {
    to: "/dashboard/payments/dashboard",
    label: "Paiements",
    icon: CreditCard,
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
    children: [
      { to: "/dashboard/kyc/all", label: "Tous les utilisateurs" },
      { to: "/dashboard/kyc/pending", label: "En attente" },
    ],
  },
  {
    to: "/dashboard/taxes",
    label: "Taxes",
    icon: Receipt,
    children: [
      { to: "/dashboard/taxes", label: "Dashboard" },
      { to: "/dashboard/taxes/liste", label: "Factures" },
      { to: "/dashboard/taxes/reversements", label: "Reversements" },
    ],
  },
  { to: "/dashboard/audit/logs", label: "Audit", icon: ClipboardList },
  { to: "/dashboard/alerts", label: "Alertes", icon: Bell },
  { to: "/dashboard/reports", label: "Rapports", icon: FileBarChart },
  { to: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings },
  { to: "/dashboard/profil", label: "Profil", icon: UserCircle },
];

const CURRENT_USER = {
  name: "Aminata Diallo",
  email: "a.diallo@lonase.sn",
  role: "Administratrice",
  initials: "AD",
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

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
    router.push("/auth/login");
  };

  return (
    <div className="relative">
      <aside 
        className={cn(
          "hidden md:flex shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl shadow-slate-950/10 h-screen sticky top-0 transition-all duration-300",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Toggle Button - Floating Arrow */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-[100] flex h-10 w-10 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground shadow-xl transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110"
          title={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>

      {/* Header - Fixed */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <>
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/logo-small.png"
                alt="Monitrix Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold tracking-tight truncate">Monitrix</p>
              <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Régulation
              </p>
            </div>
          </>
        )}
        {collapsed && (
          <div className="relative h-10 w-10 shrink-0 mx-auto">
            <Image
              src="/logo-small.png"
              alt="Monitrix Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          {NAV.map((item) => {
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
                          "flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href={item.to}
                        className={cn(
                          "flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setOpen((p) => ({ ...p, [item.label]: !expanded }))}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
                {hasChildren && expanded && (
                  <div className="mt-1 ml-6 space-y-0.5 border-l-2 border-sidebar-border pl-3 py-1">
                    {item.children!.map((c) => {
                      const a = pathname === c.to;
                      return (
                        <Link
                          key={c.to}
                          href={c.to}
                          className={cn(
                            "block rounded-md px-2.5 py-1.5 text-xs transition-all duration-200",
                            a
                              ? "bg-sidebar-primary/15 text-sidebar-primary-foreground font-medium"
                              : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50",
                          )}
                        >
                          {c.label}
                        </Link>
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
      <div className="border-t border-sidebar-border p-3 shrink-0 bg-sidebar">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-lg px-2.5 py-2 text-left transition-all duration-200 hover:bg-sidebar-accent/60"
              >
                <Avatar className="h-9 w-9 border border-sidebar-border shrink-0">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                    {CURRENT_USER.initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-200 hover:bg-sidebar-accent/60"
              >
                <Avatar className="h-9 w-9 border border-sidebar-border shrink-0">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                    {CURRENT_USER.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{CURRENT_USER.name}</p>
                  <p className="truncate text-xs text-sidebar-foreground/55">{CURRENT_USER.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0" />
              </button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-64">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">{CURRENT_USER.name}</p>
                <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                  {CURRENT_USER.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profil" className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Mon compte
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
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
  );
}
