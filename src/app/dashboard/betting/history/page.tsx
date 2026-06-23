"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { listBets, type Bet } from "@/lib/domain-api";
import { formatDateTime, formatXOF } from "@/lib/format";

export default function BettingHistoryPage() {
  const session = useSession();
  const [bets, setBets] = useState<Bet[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    listBets(session, controller.signal)
      .then((response) => setBets(response.data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [session]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return bets;
    return bets.filter((bet) =>
      [bet.id, bet.societe_code, bet.customer_ref].some((field) =>
        field?.toLowerCase().includes(value),
      ),
    );
  }, [bets, query]);

  return (
    <div>
      <PageHeader title="Historique des paris" description={`${bets.length} pari(s)`} />
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Transaction, opérateur ou client..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>
      {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      <Card><CardContent className="p-0">
        {loading ? <LoadingRows /> : filtered.length ? (
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Opérateur</TableHead>
              <TableHead>Client</TableHead><TableHead>Type</TableHead><TableHead>Statut</TableHead>
              <TableHead className="text-right">Mise</TableHead><TableHead className="text-right">Taxe</TableHead><TableHead />
            </TableRow></TableHeader>
            <TableBody>{filtered.map((bet) => (
              <TableRow key={`${bet.societe_code}-${bet.id}`}>
                <TableCell className="font-mono text-xs">{bet.id}</TableCell>
                <TableCell className="text-xs">{formatDateTime(bet.date)}</TableCell>
                <TableCell>{bet.societe_code}</TableCell>
                <TableCell className="font-mono text-xs">{bet.customer_ref || "Non renseigné"}</TableCell>
                <TableCell className="capitalize">{bet.transaction_type.replace(/_/g, " ")}</TableCell>
                <TableCell><StatusBadge status={bet.status} /></TableCell>
                <TableCell className="text-right">{formatXOF(bet.amount)}</TableCell>
                <TableCell className="text-right">{formatXOF(bet.tax)}</TableCell>
                <TableCell><Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/betting/details/${encodeURIComponent(bet.id)}?societe=${encodeURIComponent(bet.societe_code)}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        ) : <EmptyState title="Aucun pari réel" description="Aucun pari ne correspond à cette recherche." />}
      </CardContent></Card>
    </div>
  );
}

function LoadingRows() {
  return <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-12" />)}</div>;
}
