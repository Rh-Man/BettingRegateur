"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { listKycUsers, type KycUser } from "@/lib/domain-api";
import { formatDateTime } from "@/lib/format";

export function KycList({ pending = false }: { pending?: boolean }) {
  const session = useSession();
  const [users, setUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    listKycUsers(session, pending, controller.signal)
      .then((response) => setUsers(response.data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [pending, session]);

  return <div>
    <PageHeader
      title={pending ? "KYC en attente" : "KYC"}
      description={`${users.length} dossier(s) réel(s)`}
    />
    {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
    <Card><CardContent className="p-0">
      {loading ? <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        : users.length ? <Table>
          <TableHeader><TableRow><TableHead>Référence</TableHead><TableHead>Opérateur</TableHead><TableHead>Téléphone</TableHead><TableHead>KYC</TableHead><TableHead>Risque</TableHead><TableHead>Dernière activité</TableHead></TableRow></TableHeader>
          <TableBody>{users.map((user) => <TableRow key={user.id}>
            <TableCell><Link href={`/dashboard/kyc/${user.id}`} className="font-mono text-xs text-primary hover:underline">{user.external_user_ref}</Link></TableCell>
            <TableCell>{user.societe_code}</TableCell>
            <TableCell>{user.phone || "Non renseigné"}</TableCell>
            <TableCell><StatusBadge status={user.kyc_status || (pending ? "pending" : user.status)} /></TableCell>
            <TableCell><StatusBadge status={user.risk_level || "low"} /></TableCell>
            <TableCell className="text-xs">{user.last_tx_at ? formatDateTime(user.last_tx_at) : "Aucune"}</TableCell>
          </TableRow>)}</TableBody>
        </Table> : <EmptyState title="Aucun dossier KYC" description="Aucun dossier réel n’est disponible." />}
    </CardContent></Card>
  </div>;
}
