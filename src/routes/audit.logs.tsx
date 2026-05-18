import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { auditSummary, auditLogs, OPERATORS } from "@/lib/mock-data";
import { OperatorLogo } from "@/components/operator-logo";
import { formatDateTime, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/audit/logs")({
  component: AuditLogs,
  head: () => ({ meta: [{ title: "Audit Logs" }] }),
});

function AuditLogs() {
  return (
    <div>
      <PageHeader title="Audit" description="Synthèse mensuelle et journal d'audit." />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <SummaryCard title="Paris" data={auditSummary.bets} />
        <SummaryCard title="Paiements" data={auditSummary.payments} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Progression</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Bar label="Paris vérifiés" value={auditSummary.progress.betsVerified} />
            <Bar label="Paiements vérifiés" value={auditSummary.progress.paymentsVerified} />
            <Bar label="Clients régulés" value={auditSummary.progress.regulatedClients} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Données manquantes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Paris manquants" value={formatNumber(auditSummary.missing.bets)} tone="warning" />
            <Row label="Paiements manquants" value={formatNumber(auditSummary.missing.payments)} tone="warning" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Journal d'audit</CardTitle>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tous opérateurs</SelectItem>{OPERATORS.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select defaultValue="2025"><SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2025">2025</SelectItem><SelectItem value="2024">2024</SelectItem></SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Opérateur</TableHead>
              <TableHead>Type</TableHead><TableHead>Agent</TableHead><TableHead>Résultat</TableHead><TableHead>Note</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {auditLogs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(l.date)}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><OperatorLogo name={l.operator.name} color={l.operator.color} size={20} /><span className="text-sm">{l.operator.name}</span></div></TableCell>
                  <TableCell className="text-sm">{l.type}</TableCell>
                  <TableCell className="text-sm">{l.agent}</TableCell>
                  <TableCell className="text-sm font-medium">{l.result}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, data }: { title: string; data: { toAudit: number; inProgressOk: number; suspicious: number; suspect: number; verified: number } }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-5 gap-2 text-center">
        {[
          { l: "À auditer", v: data.toAudit, c: "text-muted-foreground" },
          { l: "OK", v: data.inProgressOk, c: "text-info" },
          { l: "Douteux", v: data.suspicious, c: "text-warning" },
          { l: "Suspect", v: data.suspect, c: "text-destructive" },
          { l: "Vérifiés", v: data.verified, c: "text-success" },
        ].map((x) => (
          <div key={x.l} className="p-3 rounded-md bg-muted/40">
            <p className={`text-lg font-semibold ${x.c}`}>{formatNumber(x.v)}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{x.l}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5"><span>{label}</span><span className="font-medium">{value}%</span></div>
      <Progress value={value} />
    </div>
  );
}
function Row({ label, value, tone }: { label: string; value: string; tone?: "warning" }) {
  return <div className="flex justify-between items-center p-3 rounded-md bg-muted/40"><span className="text-sm">{label}</span><span className={`font-semibold ${tone === "warning" ? "text-warning" : ""}`}>{value}</span></div>;
}
