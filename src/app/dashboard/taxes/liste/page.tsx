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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { invoices } from "@/lib/mock-data";
import { formatXOF, formatDate } from "@/lib/format";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Bell,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function InvoicesList() {
  const [q, setQ] = useState("");
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices
    .filter((i) => i.status === "payée" || i.status === "payée_automatique")
    .reduce((s, i) => s + i.amount, 0);
  const pending = invoices
    .filter((i) => i.status.includes("attente"))
    .reduce((s, i) => s + i.amount, 0);
  const late = invoices.filter((i) => i.status === "en_retard").reduce((s, i) => s + i.amount, 0);

  const filtered = invoices.filter(
    (i) =>
      q === "" ||
      i.id.toLowerCase().includes(q.toLowerCase()) ||
      i.operator.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Factures"
        description="Gestion des factures fiscales aux opérateurs."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Exporter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Nouvelle facture
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total facturé" value={formatXOF(total)} icon={FileText} accent="primary" />
        <KPICard title="Payé" value={formatXOF(paid)} icon={CheckCircle2} accent="success" />
        <KPICard title="En attente" value={formatXOF(pending)} icon={Clock} accent="warning" />
        <KPICard
          title="En retard"
          value={formatXOF(late)}
          icon={AlertTriangle}
          accent="destructive"
        />
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous mois</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Mois</TableHead>
                <TableHead>Opérateur</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="text-sm">{i.month}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <OperatorLogo name={i.operator.name} color={i.operator.color} size={20} />
                      <span className="text-sm">{i.operator.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatXOF(i.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={i.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(i.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Bell className="h-3.5 w-3.5 mr-1" />
                      Rappel
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
