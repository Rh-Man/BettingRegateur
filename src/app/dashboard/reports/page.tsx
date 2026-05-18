"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { revenueByGameType, partnerSummary } from "@/lib/mock-data";
import { formatXOF } from "@/lib/format";
import { toast } from "sonner";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Rapports"
        description="Génération de rapports de conformité et statistiques."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Générer un rapport</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select defaultValue="bets">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bets">Paris par catégorie</SelectItem>
                <SelectItem value="operators">Rapport opérateurs</SelectItem>
                <SelectItem value="compliance">Résumé conformité</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Du</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Au</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label className="invisible">Action</Label>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => toast.success("Rapport PDF en téléchargement")}
              >
                <FileText className="h-4 w-4 mr-1.5" />
                PDF
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toast.success("Export CSV lancé")}
              >
                <FileDown className="h-4 w-4 mr-1.5" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu — Revenus par type de jeu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByGameType}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip formatter={(v: number) => formatXOF(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aperçu — Top opérateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={partnerSummary} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v: number) => formatXOF(v)} />
                <Bar dataKey="stakes" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
