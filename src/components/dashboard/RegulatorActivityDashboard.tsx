"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  Coins,
  Percent,
  Receipt,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { formatDate, formatNumber, formatPercent, formatXOF } from "@/lib/format";
import {
  getRegulatorKpis,
  type RegulatorKpis,
} from "@/lib/regulator-dashboard-api";

type Period = "day" | "week" | "month" | "quarter" | "year";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPeriodRange(period: Period) {
  const end = new Date();
  const start = new Date(end);

  if (period === "day") start.setHours(0, 0, 0, 0);
  if (period === "week") start.setDate(end.getDate() - 6);
  if (period === "month") start.setDate(1);
  if (period === "quarter") {
    start.setMonth(Math.floor(end.getMonth() / 3) * 3, 1);
  }
  if (period === "year") start.setMonth(0, 1);

  return { start: toIsoDate(start), end: toIsoDate(end) };
}

interface Props {
  title?: string;
  description?: string;
}

export function RegulatorActivityDashboard({
  title = "Dashboard",
  description = "Vue d'ensemble en temps réel de l'activité des opérateurs.",
}: Props) {
  const session = useSession();
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<RegulatorKpis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const range = useMemo(() => getPeriodRange(period), [period]);

  useEffect(() => {
    if (!session) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getRegulatorKpis(session, range, controller.signal)
      .then(setData)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setData(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Impossible de charger le dashboard.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [range, session]);

  const summary = data?.summary;

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd&apos;hui</SelectItem>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <Activity className="h-4 w-4" />
          <AlertTitle>Données indisponibles</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard
              title="Transactions"
              value={formatNumber(summary?.total_transactions ?? 0)}
              icon={Activity}
              accent="primary"
            />
            <KPICard
              title="Volume total"
              value={formatXOF(summary?.total_volume ?? 0)}
              icon={Coins}
              accent="info"
            />
            <KPICard
              title="Taxes évaluées"
              value={formatXOF(summary?.total_tax ?? 0)}
              icon={Receipt}
              accent="warning"
            />
            <KPICard
              title="Taux de succès"
              value={formatPercent(summary?.success_rate ?? 0)}
              icon={Percent}
              accent="success"
            />
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Volume journalier</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.daily_volume.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.daily_volume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => formatDate(value)}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => `${Math.round(value / 1_000_000)}M`}
                      />
                      <Tooltip
                        labelFormatter={(value) => formatDate(String(value))}
                        formatter={(value: number) => formatXOF(value)}
                      />
                      <Bar
                        dataKey="volume"
                        name="Volume"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    title="Aucune activité sur cette période"
                    description="Les volumes apparaîtront ici dès que les opérateurs transmettront des transactions."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des taxes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.tax_distribution.length ? (
                  data.tax_distribution.map((item) => (
                    <div key={item.transaction_type}>
                      <div className="mb-1 flex justify-between gap-4 text-sm">
                        <span className="capitalize">
                          {item.transaction_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-muted-foreground">
                          {formatPercent(item.percentage)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState title="Aucune taxe calculée" />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Activité par opérateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.societe_stats.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opérateur</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Taxes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.societe_stats.map((item) => (
                      <TableRow key={item.societe_code}>
                        <TableCell className="font-medium">
                          {item.raison_sociale}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.societe_code}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.total_transactions)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatXOF(item.total_tax)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState
                  title="Aucun opérateur actif"
                  description="Les opérateurs associés à ce régulateur apparaîtront ici."
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
