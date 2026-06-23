"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { listInvoices, type Invoice } from "@/lib/domain-api";
import { formatDate, formatXOF } from "@/lib/format";

export default function TaxInvoicesPage() {
  const session = useSession();
  const [items, setItems] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    listInvoices(session, controller.signal).then((response) => setItems(response.data.invoices))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [session]);
  return <div>
    <PageHeader title="Factures fiscales" description={`${items.length} facture(s) réelle(s)`} />
    {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
    <Card><CardContent className="p-0">
      {loading ? <div className="p-4"><Skeleton className="h-60" /></div>
        : items.length ? <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Opérateur</TableHead><TableHead>Période</TableHead><TableHead>Échéance</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Facturé</TableHead><TableHead className="text-right">Payé</TableHead></TableRow></TableHeader>
          <TableBody>{items.map((item) => <TableRow key={item.id}><TableCell className="font-mono text-xs">{item.id}</TableCell><TableCell>{item.raison_sociale}<p className="font-mono text-xs">{item.societe_code}</p></TableCell><TableCell>{item.period}</TableCell><TableCell>{formatDate(item.due_date)}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell><TableCell className="text-right">{formatXOF(item.amount_due)}</TableCell><TableCell className="text-right">{formatXOF(item.amount_paid)}</TableCell></TableRow>)}</TableBody></Table>
          : <EmptyState title="Aucune facture" description="Aucune facture réelle n’est enregistrée." />}
    </CardContent></Card>
  </div>;
}
