"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { listDocuments, type DocumentRecord } from "@/lib/domain-api";
import { formatDate } from "@/lib/format";

export default function DocumentsPage() {
  const session = useSession();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    listDocuments(session, controller.signal).then((response) => setDocuments(response.data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Chargement impossible.");
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [session]);

  return <div>
    <PageHeader title="Documents" description={`${documents.length} document(s) réel(s)`} />
    {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
    <Card><CardContent className="p-0">
      {loading ? <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        : documents.length ? <Table><TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Opérateur</TableHead><TableHead>Type</TableHead><TableHead>Taille</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>{documents.map((document) => <TableRow key={document.id}>
            <TableCell><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span>{document.name || document.path}</span></div></TableCell>
            <TableCell>{document.raison_sociale}<p className="font-mono text-xs text-muted-foreground">{document.societe_code}</p></TableCell>
            <TableCell>{document.type}</TableCell>
            <TableCell>{document.file_size ? `${Math.round(document.file_size / 1024)} Ko` : "Non renseignée"}</TableCell>
            <TableCell>{formatDate(document.uploaded_at)}</TableCell>
          </TableRow>)}</TableBody></Table>
          : <EmptyState title="Aucun document" description="Aucun document réel n’a été transmis." />}
    </CardContent></Card>
  </div>;
}
