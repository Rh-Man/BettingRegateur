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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { dashboardKpis, revenueByGameType, partnerSummary } from "@/lib/mock-data";
import { formatXOF, formatNumber } from "@/lib/format";
import {
  Dices,
  Coins,
  Banknote,
  TrendingUp,
  Wallet,
  Users,
  Receipt,
  CreditCard,
  Download,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble en temps réel de l'activité des opérateurs."
        actions={
          <>
            <Select defaultValue="month">
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd&apos;hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Exporter
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Nombre de paris"
          value={formatNumber(dashboardKpis.totalBets)}
          icon={Dices}
          change={12.4}
          accent="primary"
        />
        <KPICard
          title="Mises totales"
          value={formatXOF(dashboardKpis.totalStakes)}
          icon={Coins}
          change={8.2}
          accent="info"
        />
        <KPICard
          title="Montant payé"
          value={formatXOF(dashboardKpis.totalPayout)}
          icon={Banknote}
          change={-3.1}
          accent="warning"
        />
        <KPICard
          title="RJB"
          value={formatXOF(dashboardKpis.rjb)}
          icon={TrendingUp}
          change={15.6}
          accent="success"
        />
        <KPICard
          title="Mise ouverte"
          value={formatXOF(dashboardKpis.openStake)}
          icon={Wallet}
          change={4.8}
          accent="info"
        />
        <KPICard
          title="Clients uniques"
          value={formatNumber(dashboardKpis.uniqueClients)}
          icon={Users}
          change={9.3}
          accent="primary"
        />
        <KPICard
          title="Taxe paris"
          value={formatXOF(dashboardKpis.betsTax)}
          icon={Receipt}
          change={11.2}
          accent="success"
        />
        <KPICard
          title="Taxe paiement"
          value={formatXOF(dashboardKpis.paymentTax)}
          icon={CreditCard}
          change={7.5}
          accent="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 glass-card glow-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Revenus par type de jeu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueByGameType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(v: number) => formatXOF(v)}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border)/0.5)", backgroundColor: "hsl(var(--card)/0.8)", backdropFilter: "blur(12px)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass-card glow-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Répartition rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {revenueByGameType.slice(0, 6).map((r) => {
              const pct = (r.revenue / revenueByGameType.reduce((a, b) => a + b.revenue, 0)) * 100;
              return (
                <div key={r.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{r.name}</span>
                    <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border/50 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Récapitulatif par partenaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opérateur</TableHead>
                <TableHead className="text-right">Paris</TableHead>
                <TableHead className="text-right">Mises</TableHead>
                <TableHead className="text-right">Payouts</TableHead>
                <TableHead className="text-right">Taxe</TableHead>
                <TableHead className="text-right">Clients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerSummary.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <OperatorLogo name={p.name} color={p.color} />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(p.bets)}</TableCell>
                  <TableCell className="text-right">{formatXOF(p.stakes)}</TableCell>
                  <TableCell className="text-right">{formatXOF(p.payout)}</TableCell>
                  <TableCell className="text-right">{formatXOF(p.tax)}</TableCell>
                  <TableCell className="text-right">{formatNumber(p.clients)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
