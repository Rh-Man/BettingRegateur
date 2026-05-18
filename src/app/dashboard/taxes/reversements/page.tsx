"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { reversements } from "@/lib/mock-data";
import { formatXOF, formatDate } from "@/lib/format";
import { Coins, CheckCircle2, Clock, Wallet, Send } from "lucide-react";
import { toast } from "sonner";

export default function ReversementsPage() {
  const total = reversements.reduce((s, r) => s + r.amount, 0);
  const approved = reversements
    .filter((r) => r.status === "approuvé" || r.status === "traité")
    .reduce((s, r) => s + r.amount, 0);
  const pending = reversements
    .filter((r) => r.status === "en_attente")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <PageHeader
        title="Reversements"
        description="Reversements vers les comptes des opérateurs."
        actions={
          <Button size="sm">
            <Send className="h-4 w-4 mr-1.5" />
            Demande de settlement
          </Button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Montant total" value={formatXOF(total)} icon={Coins} accent="primary" />
        <KPICard
          title="Approuvé"
          value={formatXOF(approved)}
          icon={CheckCircle2}
          accent="success"
        />
        <KPICard title="En attente" value={formatXOF(pending)} icon={Clock} accent="warning" />
        <KPICard
          title="Solde wallet"
          value={formatXOF(4_200_000_000)}
          icon={Wallet}
          accent="info"
        />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Opérateur</TableHead>
                <TableHead>Banque (RIB)</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reversements.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <OperatorLogo name={r.operator.name} color={r.operator.color} size={20} />
                      <span className="text-sm">{r.operator.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{r.bank}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatXOF(r.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`${r.id} marqué traité`)}
                    >
                      Marquer traité
                    </Button>
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
