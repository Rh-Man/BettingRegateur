import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Dices, CreditCard, ShieldCheck, Receipt, ClipboardList,
  Bell, FileBarChart, FolderOpen, Settings, UserCircle, ChevronDown, Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { to: string; label: string }[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/betting/dashboard", label: "Paris", icon: Dices, children: [
    { to: "/betting/dashboard", label: "Vue d'ensemble" },
    { to: "/betting/history", label: "Historique" },
  ]},
  { to: "/payments/dashboard", label: "Paiements", icon: CreditCard, children: [
    { to: "/payments/dashboard", label: "Vue d'ensemble" },
    { to: "/payments/history", label: "Historique" },
    { to: "/payments/settlements", label: "Règlements" },
    { to: "/payments/wallets", label: "Portefeuilles" },
  ]},
  { to: "/kyc/all", label: "KYC", icon: ShieldCheck, children: [
    { to: "/kyc/all", label: "Tous les utilisateurs" },
    { to: "/kyc/pending", label: "En attente" },
  ]},
  { to: "/taxes", label: "Taxes", icon: Receipt, children: [
    { to: "/taxes", label: "Dashboard" },
    { to: "/taxes/liste", label: "Factures" },
    { to: "/taxes/reversements", label: "Reversements" },
  ]},
  { to: "/audit/logs", label: "Audit", icon: ClipboardList },
  { to: "/alerts", label: "Alertes", icon: Bell },
  { to: "/reports", label: "Rapports", icon: FileBarChart },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/settings", label: "Paramètres", icon: Settings },
  { to: "/profil", label: "Profil", icon: UserCircle },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight">Monitrix</p>
          <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Régulation</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
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
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
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
                        to={c.to}
                        className={cn(
                          "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
                          a ? "bg-sidebar-primary/15 text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
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
      <div className="px-5 py-4 border-t border-sidebar-border text-[11px] text-sidebar-foreground/50">
        © 2025 LONASE · Monitrix v1.0
      </div>
    </aside>
  );
}
