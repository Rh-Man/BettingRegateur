"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { getBet } from "@/lib/domain-api";
import { formatDateTime, formatXOF } from "@/lib/format";

export default function BettingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const society = useSearchParams().get("societe");
  const session = useSession();
  const [data, setData] = useState<Awaited<ReturnType<typeof getBet>>["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !society) return;
    const controller = new AbortController();
    getBet(session, id, society, controller.signal)
      .then((response) => setData(response.data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      });
    return () => controller.abort();
  }, [id, session, society]);

  return <div>
    <Link href="/dashboard/betting/history" className="mb-4 inline-flex items-center text-sm text-muted-foreground"><ArrowLeft className="mr-1 h-4 w-4" />Retour</Link>
    {error ? <Alert variant="destructive"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      : !data ? <Skeleton className="h-72" />
      : <>
        <PageHeader title={`Pari ${data.bet.id}`} description={data.bet.societe_code} />
        <Card><CardHeader><CardTitle>Informations réelles</CardTitle></CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Statut"><StatusBadge status={data.bet.status} /></Info>
            <Info label="Date">{formatDateTime(data.bet.date)}</Info>
            <Info label="Type">{data.bet.transaction_type}</Info>
            <Info label="Mise">{formatXOF(data.bet.amount)}</Info>
            <Info label="Taxe">{formatXOF(data.bet.tax)}</Info>
            <Info label="Région">{data.bet.region || "Non renseignée"}</Info>
          </CardContent>
        </Card>
      </>}
  </div>;
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 capitalize">{children}</div></div>;
}
