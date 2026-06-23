"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { getKycUser, updateKycStatus } from "@/lib/domain-api";

export default function KycDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const [data, setData] = useState<Awaited<ReturnType<typeof getKycUser>>["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!session) return;
    getKycUser(session, id).then((response) => setData(response.data)).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Chargement impossible."));
  };
  useEffect(load, [id, session]);

  const act = async (action: "approve" | "reject") => {
    if (!session) return;
    setSaving(true);
    try {
      await updateKycStatus(session, id, action);
      toast.success(action === "approve" ? "KYC approuvé" : "KYC rejeté");
      load();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Action impossible");
    } finally { setSaving(false); }
  };

  if (error) return <Alert variant="destructive"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  if (!data) return <Skeleton className="h-72" />;
  return <div>
    <PageHeader title={`Dossier ${data.external_user_ref}`} description={data.raison_sociale} actions={<><Button variant="outline" disabled={saving} onClick={() => act("reject")}>Rejeter</Button><Button disabled={saving} onClick={() => act("approve")}>Approuver</Button></>} />
    <Card><CardHeader><CardTitle>Informations disponibles</CardTitle></CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Opérateur">{data.societe_code}</Info>
        <Info label="Statut"><StatusBadge status={data.status} /></Info>
        <Info label="Risque"><StatusBadge status={data.risk_level} /></Info>
        <Info label="Score">{data.risk_score ?? 0}</Info>
        <Info label="Comptes mobile money">{data.mm_accounts.length}</Info>
        <Info label="Téléphones">{data.phones.length}</Info>
      </CardContent>
    </Card>
  </div>;
}
function Info({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1">{children}</div></div>; }
