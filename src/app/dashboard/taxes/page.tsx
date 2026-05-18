"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { taxKpis, monthlyReversements, OPERATORS } from "@/lib/mock-data";
import { formatXOF, formatDate } from "@/lib/format";
import { Receipt, Coins, TrendingUp, Banknote } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function TaxesDashboard() {
  const byType = [
    { name: "Taxe gains joueurs", value: 720_000_000 },
    { name: "Taxe revenus opérateurs", value: 540_000_000 },
    { name: "Taxe paris", value: 256_000_000 },
    { name: "Taxe paiements", value: 408_000_000 },
  ];
  const byOp = OPERATORS.map((o, i) => ({ name: o.name, value: 200_000_000 + i * 80_000_000 }));

  return (
    <div>
      <PageHeader
        title="Dashboard Taxes"
        description="Suivi global des taxes collectées et reversées."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Taxes totales"
          value={formatXOF(taxKpis.totalTax)}
          icon={Receipt}
          change={11.4}
          accent="primary"
        />
        <KPICard
          title="Total paris"
          value={formatXOF(taxKpis.totalBets)}
          icon={Coins}
          change={8.2}
          accent="info"
        />
        <KPICard
          title="Total gains"
          value={formatXOF(taxKpis.totalWins)}
          icon={TrendingUp}
          change={5.6}
          accent="success"
        />
        <KPICard
          title="Revenus opérateurs"
          value={formatXOF(taxKpis.operatorRevenue)}
          icon={Banknote}
          change={9.1}
          accent="warning"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Reversements mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyReversements}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip formatter={(v: number) => formatXOF(v)} />
                <Bar
                  dataKey="playerWinsTax"
                  fill="hsl(var(--chart-1))"
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="operatorRevenueTax"
                  fill="hsl(var(--chart-2))"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatXOF(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tableau des reversements mensuels</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois</TableHead>
                <TableHead className="text-right">Taxe gains joueurs</TableHead>
                <TableHead className="text-right">Taxe revenus opérateurs</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date paiement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyReversements.map((r) => (
                <TableRow key={r.month}>
                  <TableCell className="font-medium">{r.month}</TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(r.playerWinsTax)}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatXOF(r.operatorRevenueTax)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold">
                    {formatXOF(r.total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(r.paymentDate)}
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
