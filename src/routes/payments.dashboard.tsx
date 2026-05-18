import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { KPICard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { OperatorLogo } from "@/components/operator-logo";
import { paymentsKpis, payments, platformPerformance, PAYMENT_PLATFORMS } from "@/lib/mock-data";
import { formatXOF, formatNumber, formatPercent, formatDateTime } from "@/lib/format";
import { CreditCard, Coins, CheckCircle2, XCircle, TrendingUp, Percent } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/payments/dashboard")({
  component: PaymentsDashboard,
  head: () => ({ meta: [{ title: "Paiements — Dashboard" }] }),
});

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function PaymentsDashboard() {
  const statusDist = [
    { name: "Réussies", value: paymentsKpis.successful },
    { name: "Échouées", value: paymentsKpis.failed },
    { name: "En attente", value: 14_500 },
    { name: "Annulées", value: 5_200 },
  ];
  const platformDist = platformPerformance.map((p) => ({ name: p.name, value: p.volume }));

  return (
    <div>
      <PageHeader title="Dashboard Paiements" description="Activité et performance des prestataires de paiement." />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard title="Transactions totales" value={formatNumber(paymentsKpis.totalTransactions)} icon={CreditCard} change={9.4} accent="primary" />
        <KPICard title="Montant total" value={formatXOF(paymentsKpis.totalAmount)} icon={Coins} change={11.2} accent="info" />
        <KPICard title="Réussies" value={formatNumber(paymentsKpis.successful)} icon={CheckCircle2} change={5.8} accent="success" />
        <KPICard title="Échouées" value={formatNumber(paymentsKpis.failed)} icon={XCircle} change={-2.4} accent="destructive" />
        <KPICard title="Montant moyen" value={formatXOF(paymentsKpis.averageAmount)} icon={TrendingUp} change={3.1} accent="info" />
        <KPICard title="Taux de réussite" value={formatPercent(paymentsKpis.successRate)} icon={Percent} change={1.2} accent="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Transactions récentes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>ID</TableHead><TableHead>Opérateur</TableHead><TableHead>Plateforme</TableHead>
                <TableHead>Statut</TableHead><TableHead className="text-right">Montant</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {payments.slice(0, 8).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs"><Link to="/payments/transactions/$id" params={{ id: p.id }} className="hover:underline">{p.id}</Link></TableCell>
                    <TableCell><div className="flex items-center gap-2"><OperatorLogo name={p.operator.name} color={p.operator.color} size={20} /><span className="text-sm">{p.operator.name}</span></div></TableCell>
                    <TableCell className="text-sm">{p.platform.name}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatXOF(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Statut</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusDist} dataKey="value" innerRadius={45} outerRadius={80}>
                  {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Performance par plateforme</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {platformPerformance.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(p.transactions)} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatXOF(p.volume)}</p>
                  <p className="text-xs text-success">{p.successRate}% réussite</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Volumes par plateforme</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={platformDist} dataKey="value" innerRadius={50} outerRadius={90}>
                  {platformDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatXOF(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
