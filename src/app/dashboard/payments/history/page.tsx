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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { formatDateTime, formatXOF } from "@/lib/format";
import {
  getRegulatorTransactions,
  type RegulatorTransaction,
} from "@/lib/regulator-dashboard-api";

export default function PaymentsHistory() {
  const session = useSession();
  const [transactions, setTransactions] = useState<RegulatorTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getRegulatorTransactions(
      session,
      {
        limit: 100,
        status: status === "all" ? undefined : status,
        transactionType: type === "all" ? undefined : type,
      },
      controller.signal,
    )
      .then((response) => {
        setTransactions(response.data);
        setTotal(response.total);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setTransactions([]);
        setTotal(0);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Impossible de charger les transactions.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [session, status, type]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return transactions;
    return transactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(normalized) ||
        transaction.societe.toLowerCase().includes(normalized),
    );
  }, [query, transactions]);

  const transactionTypes = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.transaction_type))).sort(),
    [transactions],
  );

  return (
    <div>
      <PageHeader
        title="Historique des paiements"
        description={`${total} transaction${total > 1 ? "s" : ""}`}
      />

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ID transaction, code opérateur..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {transactionTypes.map((transactionType) => (
                <SelectItem key={transactionType} value={transactionType}>
                  {transactionType.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="processed">Traitées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échouées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Données indisponibles</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Opérateur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Taxe</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((transaction) => (
                  <TableRow key={`${transaction.societe}-${transaction.id}`}>
                    <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(transaction.date)}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.societe}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className="capitalize">
                      {transaction.transaction_type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatXOF(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">{formatXOF(transaction.tax)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link
                          href={`/dashboard/payments/transactions/${encodeURIComponent(transaction.id)}?societe=${encodeURIComponent(transaction.societe)}`}
                          aria-label={`Voir la transaction ${transaction.id}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="Aucune transaction"
              description="Aucune transaction réelle ne correspond aux filtres sélectionnés."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
