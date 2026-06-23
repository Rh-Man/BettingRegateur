"use client";

import { useEffect, useState } from "react";
import { Coins, Percent, Receipt, Rows3 } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { getTaxKpis, type TaxKpis } from "@/lib/domain-api";
import { formatNumber, formatPercent, formatXOF } from "@/lib/format";

export default function TaxesDashboardPage() {
  const session = useSession();
  const [data, setData] = useState<TaxKpis | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    getTaxKpis(session, controller.signal).then((response) => setData(response.data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      });
    return () => controller.abort();
  }, [session]);
  return <div>
    <PageHeader title="Taxes" description="Taxes réelles évaluées auprès des opérateurs." />
    {error ? <Alert variant="destructive"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      : !data ? <Skeleton className="h-64" />
      : <>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Taxes totales" value={formatXOF(data.kpis.total_tax)} icon={Coins} />
          <KPICard title="Transactions" value={formatNumber(data.kpis.transaction_count)} icon={Rows3} accent="info" />
          <KPICard title="Taux moyen" value={formatPercent(data.kpis.avg_tax_rate)} icon={Percent} accent="warning" />
          <KPICard title="Efficacité" value={formatPercent(data.kpis.collection_efficiency)} icon={Receipt} accent="success" />
        </div>
        <Card><CardHeader><CardTitle>Taxes par opérateur</CardTitle></CardHeader><CardContent className="p-0">
          {data.by_operator.length ? <Table><TableHeader><TableRow><TableHead>Opérateur</TableHead><TableHead className="text-right">Transactions</TableHead><TableHead className="text-right">Taxes</TableHead></TableRow></TableHeader>
            <TableBody>{data.by_operator.map((item) => <TableRow key={item.societe_code}><TableCell>{item.raison_sociale}<p className="font-mono text-xs">{item.societe_code}</p></TableCell><TableCell className="text-right">{formatNumber(item.transaction_count)}</TableCell><TableCell className="text-right">{formatXOF(item.total_tax)}</TableCell></TableRow>)}</TableBody></Table>
            : <EmptyState title="Aucune taxe" description="Aucune taxe réelle n’est disponible." />}
        </CardContent></Card>
      </>}
  </div>;
}
