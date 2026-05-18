import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { KPICard } from "@/components/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { OperatorLogo } from "@/components/operator-logo";
import { settlements } from "@/lib/mock-data";
import { formatXOF, formatDateTime } from "@/lib/format";
import { Receipt, Coins, Banknote, Percent } from "lucide-react";

export const Route = createFileRoute("/payments/settlements")({
  component: Settlements,
  head: () => ({ meta: [{ title: "Règlements" }] }),
});

function Settlements() {
  const total = settlements.reduce((s, x) => s + x.amount, 0);
  const totalTax = settlements.reduce((s, x) => s + x.tax, 0);
  const totalComm = settlements.reduce((s, x) => s + x.commission, 0);
  const totalRev = total - totalTax - totalComm;

  return (
    <div>
      <PageHeader title="Règlements" description="Settlements et reversements aux opérateurs." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total règlements" value={formatXOF(total)} icon={Coins} accent="primary" />
        <KPICard title="Taxes totales" value={formatXOF(totalTax)} icon={Receipt} accent="warning" />
        <KPICard title="Revenus" value={formatXOF(totalRev)} icon={Banknote} accent="success" />
        <KPICard title="Commissions" value={formatXOF(totalComm)} icon={Percent} accent="info" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Bookmaker</TableHead><TableHead>Date</TableHead>
              <TableHead>Banque</TableHead><TableHead>Statut</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Taxe</TableHead><TableHead className="text-right">Commission</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {settlements.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><OperatorLogo name={s.bookmaker.name} color={s.bookmaker.color} size={20} /><span className="text-sm">{s.bookmaker.name}</span></div></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(s.date)}</TableCell>
                  <TableCell className="text-sm">{s.bank}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatXOF(s.amount)}</TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(s.tax)}</TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(s.commission)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
