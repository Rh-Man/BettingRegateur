"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { formatDateTime, formatXOF } from "@/lib/format";
import {
  getRegulatorTransaction,
  type RegulatorTransaction,
} from "@/lib/regulator-dashboard-api";

export default function TransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const session = useSession();
  const societeCode = searchParams.get("societe");
  const [transaction, setTransaction] = useState<RegulatorTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    if (!societeCode) {
      setLoading(false);
      setError("Le code de la société est requis pour consulter cette transaction.");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getRegulatorTransaction(session, id, societeCode, controller.signal)
      .then(setTransaction)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setTransaction(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Impossible de charger la transaction.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, session, societeCode]);

  return (
    <div>
      <Link
        href="/dashboard/payments/history"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Link>

      {loading ? (
        <Skeleton className="h-80 w-full" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Transaction indisponible</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : transaction ? (
        <>
          <PageHeader
            title={`Transaction ${transaction.id}`}
            description={transaction.societe}
          />
          <Card>
            <CardHeader>
              <CardTitle>Informations transmises</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Statut" value={<StatusBadge status={transaction.status} />} />
              <Info label="Date" value={formatDateTime(transaction.date)} />
              <Info label="Opérateur" value={transaction.societe} />
              <Info
                label="Montant"
                value={<span className="font-semibold">{formatXOF(transaction.amount)}</span>}
              />
              <Info label="Taxe" value={formatXOF(transaction.tax)} />
              <Info
                label="Type"
                value={transaction.transaction_type.replace(/_/g, " ")}
              />
              <Info label="Région" value={transaction.region || "Non renseignée"} />
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyState title="Transaction introuvable" />
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 capitalize">{value}</div>
    </div>
  );
}
