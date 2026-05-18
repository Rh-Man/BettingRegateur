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
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm shadow-slate-200/70 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                accentMap[accent],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "mt-3 flex items-center gap-1 text-xs font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)} % vs période précédente
          </div>
        )}
      </CardContent>
    </Card>
  );
}
