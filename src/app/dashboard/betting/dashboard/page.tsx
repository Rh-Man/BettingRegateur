"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  bettingKpis,
  stakeDistribution,
  clientsDistribution,
  openStakeDistribution,
  OPERATORS,
  GAME_TYPES,
} from "@/lib/mock-data";
import { formatXOF, formatNumber, formatPercent } from "@/lib/format";
import {
  Dices,
  Target,
  Coins,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Activity,
  Percent,
} from "lucide-react";
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
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

function Donut({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BettingDashboard() {
  const perfData = GAME_TYPES.map((g) => {
    const row: Record<string, string | number> = { name: g };
    OPERATORS.forEach((op) => {
      row[op.name] = Math.floor(Math.random() * 500_000_000) + 50_000_000;
    });
    return row;
  });

  return (
    <div>
      <PageHeader
        title="Dashboard Paris"
        description="Indicateurs et performance des paris sportifs."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total paris"
          value={formatNumber(bettingKpis.totalBets)}
          icon={Dices}
          change={12.4}
          accent="primary"
        />
        <KPICard
          title="Taux de gain"
          value={formatPercent(bettingKpis.winRate)}
          icon={Target}
          change={1.8}
          accent="success"
        />
        <KPICard
          title="Mise moyenne"
          value={formatXOF(bettingKpis.averageStake)}
          icon={Coins}
          change={5.2}
          accent="info"
        />
        <KPICard
          title="Mises totales"
          value={formatXOF(bettingKpis.totalStakes)}
          icon={TrendingUp}
          change={8.2}
          accent="primary"
        />
        <KPICard
          title="Paris gagnants"
          value={formatNumber(bettingKpis.wonBets)}
          icon={CheckCircle2}
          change={4.6}
          accent="success"
        />
        <KPICard
          title="Paris perdants"
          value={formatNumber(bettingKpis.lostBets)}
          icon={XCircle}
          change={-2.1}
          accent="destructive"
        />
        <KPICard
          title="Cotes moyennes"
          value={bettingKpis.averageOdds.toFixed(2)}
          icon={Activity}
          change={0.4}
          accent="info"
        />
        <KPICard
          title="Marge bénéficiaire"
          value={formatPercent(bettingKpis.margin)}
          icon={Percent}
          change={2.3}
          accent="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Donut data={stakeDistribution} title="Distribution des mises" />
        <Donut data={clientsDistribution} title="Distribution des clients" />
        <Donut data={openStakeDistribution} title="Mises ouvertes" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance par type de jeu et opérateur</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip formatter={(v: number) => formatXOF(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {OPERATORS.map((op, i) => (
                <Bar key={op.id} dataKey={op.name} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
