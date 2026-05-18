"use client";

import Link from "next/link";
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
  Shield,
  LogOut,
  User,
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

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");
  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl shadow-slate-950/10">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight">Monitrix</p>
          <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
            Régulation
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          const hasChildren = !!item.children?.length;
          const expanded = open[item.label] ?? active;
          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => setOpen((p) => ({ ...p, [item.label]: !expanded }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                  />
                </button>
              ) : (
                <Link
                  href={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )}
              {hasChildren && expanded && (
                <div className="mt-0.5 ml-7 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children!.map((c) => {
                    const a = pathname === c.to;
                    return (
                      <Link
                        key={c.to}
                        href={c.to}
                        className={cn(
                          "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
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
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-sidebar-accent/60"
            >
              <Avatar className="h-9 w-9 border border-sidebar-border">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                  {CURRENT_USER.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{CURRENT_USER.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/55">{CURRENT_USER.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
            </button>
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
              <Link href="/dashboard/profil">
                <User className="h-4 w-4" />
                Mon compte
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
