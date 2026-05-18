"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { alerts, OPERATORS } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { Search, AlertTriangle, ShieldAlert, AlertOctagon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ICONS = {
  suspicious_betting_pattern: AlertTriangle,
  underage_gambling_attempt: ShieldAlert,
  money_laundering_suspicion: AlertOctagon,
} as const;

export default function AlertsPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [st, setSt] = useState("all");

  const filtered = useMemo(
    () =>
      alerts.filter(
        (a) =>
          (q === "" ||
            a.id.toLowerCase().includes(q.toLowerCase()) ||
            a.description.toLowerCase().includes(q.toLowerCase())) &&
          (sev === "all" || a.severity === sev) &&
          (st === "all" || a.state === st),
      ),
    [q, sev, st],
  );

  return (
    <div>
      <PageHeader title="Alertes" description={`${filtered.length} alertes`} />
      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="État" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous états</SelectItem>
              <SelectItem value="open">Ouvert</SelectItem>
              <SelectItem value="acknowledged">Pris en charge</SelectItem>
              <SelectItem value="closed">Clôturé</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((a) => {
          const Icon = ICONS[a.type];
          return (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    a.severity === "critical"
                      ? "bg-destructive/15 text-destructive"
                      : a.severity === "high"
                        ? "bg-warning/15 text-warning"
                        : a.severity === "medium"
                          ? "bg-info/15 text-info"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                    <StatusBadge status={a.severity} />
                    <StatusBadge status={a.state} />
                    <div className="flex items-center gap-1.5 ml-2">
                      <OperatorLogo name={a.operator.name} color={a.operator.color} size={16} />
                      <span className="text-xs">{a.operator.name}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{a.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(a.date)} · Client {a.clientId}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(`${a.id} : accusé de réception`)}
                  >
                    Accuser réception
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toast.success(`${a.id} fermé`)}
                  >
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
