import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  change?: number;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "info";
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function KPICard({
  title,
  value,
  icon: Icon,
  change,
  hint,
  accent = "primary",
}: KPICardProps) {
  const positive = (change ?? 0) >= 0;
  
  const accentGradients = {
    primary: "from-primary/5 to-transparent",
    success: "from-success/5 to-transparent",
    warning: "from-warning/5 to-transparent",
    destructive: "from-destructive/5 to-transparent",
    info: "from-info/5 to-transparent",
  };

  return (
    <Card className={cn("relative overflow-hidden glass-card glow-hover border-border/50", "group")}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", accentGradients[accent])} />
      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">{title}</p>
            <p className="break-words text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">{value}</p>
            {hint && <p className="text-xs font-medium text-muted-foreground">{hint}</p>}
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner transition-transform group-hover:scale-110 sm:h-12 sm:w-12",
                accentMap[accent],
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "mt-4 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit shadow-sm",
              positive 
                ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                : "bg-rose-100/80 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
            )}
          >
            {positive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
            {Math.abs(change).toFixed(1)} % <span className="font-semibold opacity-70">vs période précédente</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
