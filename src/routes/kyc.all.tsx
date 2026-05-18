import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { KPICard } from "@/components/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { kycUsers } from "@/lib/mock-data";
import { formatXOF, formatDate } from "@/lib/format";
import { Users, CheckCircle2, Clock, XCircle, Search, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/kyc/all")({
  component: KycAll,
  head: () => ({ meta: [{ title: "KYC — Utilisateurs" }] }),
});

function KycAll() {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const verified = kycUsers.filter((u) => u.status === "Vérifié").length;
  const pending = kycUsers.filter((u) => u.status === "En attente").length;
  const rejected = kycUsers.filter((u) => u.status === "Rejeté").length;

  const filtered = useMemo(() => kycUsers.filter((u) =>
    (q === "" || u.fullName.toLowerCase().includes(q.toLowerCase()) || u.id.toLowerCase().includes(q.toLowerCase())) &&
    (st === "all" || u.status === st)
  ), [q, st]);

  return (
    <div>
      <PageHeader title="KYC — Tous les utilisateurs" description={`${kycUsers.length} utilisateurs au total`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total" value={`${kycUsers.length}`} icon={Users} accent="primary" />
        <KPICard title="Vérifiés" value={`${verified}`} icon={CheckCircle2} accent="success" />
        <KPICard title="En attente" value={`${pending}`} icon={Clock} accent="warning" />
        <KPICard title="Rejetés" value={`${rejected}`} icon={XCircle} accent="destructive" />
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Nom, ID..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="Vérifié">Vérifié</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Rejeté">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Nom</TableHead><TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead><TableHead>Statut</TableHead><TableHead>Document</TableHead>
              <TableHead className="text-right">Limite</TableHead><TableHead>Vérifié par</TableHead>
              <TableHead>Date</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium text-sm">{u.fullName}</TableCell>
                  <TableCell className="text-xs">{u.phone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-xs">{u.documentType}</TableCell>
                  <TableCell className="text-right text-xs">{formatXOF(u.limit)}</TableCell>
                  <TableCell className="text-xs">{u.verifiedBy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(u.date)}</TableCell>
                  <TableCell><Link to="/kyc/$id" params={{ id: u.id }}><Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
