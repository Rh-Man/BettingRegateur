import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { OperatorLogo } from "@/components/operator-logo";
import { payments, OPERATORS, PAYMENT_PLATFORMS } from "@/lib/mock-data";
import { formatXOF, formatDateTime } from "@/lib/format";
import { Search, Download, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/payments/history")({
  component: PaymentsHistory,
  head: () => ({ meta: [{ title: "Historique paiements" }] }),
});

function PaymentsHistory() {
  const [q, setQ] = useState("");
  const [op, setOp] = useState("all");
  const [pl, setPl] = useState("all");
  const [st, setSt] = useState("all");

  const filtered = useMemo(() => payments.filter((p) =>
    (q === "" || p.id.toLowerCase().includes(q.toLowerCase()) || p.clientId.toLowerCase().includes(q.toLowerCase())) &&
    (op === "all" || p.operator.id === op) &&
    (pl === "all" || p.platform.id === pl) &&
    (st === "all" || p.status === st)
  ), [q, op, pl, st]);

  return (
    <div>
      <PageHeader title="Historique des paiements" description={`${filtered.length} transactions`}
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Exporter</Button>} />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ID transaction, client..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={op} onValueChange={setOp}><SelectTrigger className="w-40"><SelectValue placeholder="Opérateur" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous opérateurs</SelectItem>{OPERATORS.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={pl} onValueChange={setPl}><SelectTrigger className="w-40"><SelectValue placeholder="Plateforme" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Toutes plateformes</SelectItem>{PAYMENT_PLATFORMS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={st} onValueChange={setSt}><SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous statuts</SelectItem>{["Réussie","Échouée","En attente","Annulée"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Client</TableHead>
              <TableHead>Opérateur</TableHead><TableHead>Plateforme</TableHead>
              <TableHead>Statut</TableHead><TableHead>Type</TableHead>
              <TableHead className="text-right">Montant</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(p.date)}</TableCell>
                  <TableCell className="text-xs font-mono">{p.clientId}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><OperatorLogo name={p.operator.name} color={p.operator.color} size={20} /><span className="text-sm">{p.operator.name}</span></div></TableCell>
                  <TableCell className="text-sm">{p.platform.name}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-sm">{p.type}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatXOF(p.amount)}</TableCell>
                  <TableCell>
                    <Link to="/payments/transactions/$id" params={{ id: p.id }}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
