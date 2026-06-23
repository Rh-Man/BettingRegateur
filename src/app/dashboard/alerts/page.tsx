"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { listMonitoringAlerts, updateMonitoringAlert, type MonitoringAlert } from "@/lib/domain-api";
import { formatDateTime } from "@/lib/format";

export default function AlertsPage() {
  const session = useSession();
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    listMonitoringAlerts(session, controller.signal).then((response) => setAlerts(response.data.alerts))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refresh, session]);

  const act = async (alert: MonitoringAlert, action: "acknowledge" | "close") => {
    if (!session) return;
    try {
      await updateMonitoringAlert(session, alert.id, action);
      toast.success(action === "acknowledge" ? "Alerte prise en charge" : "Alerte fermée");
      setRefresh((value) => value + 1);
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Action impossible"); }
  };

  return <div>
    <PageHeader title="Alertes" description={`${alerts.length} alerte(s) réelle(s)`} />
    {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
    {loading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      : alerts.length ? <div className="space-y-3">{alerts.map((item) => <Card key={item.id}><CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/10 text-warning"><AlertTriangle className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-2"><span className="font-mono text-xs">#{item.id}</span><StatusBadge status={item.severity} /><StatusBadge status={item.state} /></div>
          <p className="font-medium capitalize">{item.type.replace(/_/g, " ")}</p>
          <p className="text-sm text-muted-foreground">{item.raison_sociale || item.societe_code || "Périmètre régulateur"} · {formatDateTime(item.created_at)}</p>
        </div>
        <div className="flex gap-2"><Button size="sm" variant="outline" disabled={item.state !== "open"} onClick={() => act(item, "acknowledge")}>Prendre en charge</Button><Button size="sm" disabled={item.state === "closed"} onClick={() => act(item, "close")}>Fermer</Button></div>
      </CardContent></Card>)}</div>
      : <EmptyState title="Aucune alerte" description="Aucune alerte réelle n’est ouverte." />}
  </div>;
}
