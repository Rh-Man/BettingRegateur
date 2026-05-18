"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { bets, OPERATORS, GAME_TYPES } from "@/lib/mock-data";
import { formatXOF, formatDateTime } from "@/lib/format";
import { Search, Download, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

export default function BettingHistory() {
  const [q, setQ] = useState("");
  const [op, setOp] = useState("all");
  const [gt, setGt] = useState("all");

  const filtered = useMemo(
    () =>
      bets.filter(
        (b) =>
          (q === "" ||
            b.id.toLowerCase().includes(q.toLowerCase()) ||
            b.clientId.toLowerCase().includes(q.toLowerCase()) ||
            b.ref.toLowerCase().includes(q.toLowerCase())) &&
          (op === "all" || b.operator.id === op) &&
          (gt === "all" || b.gameType === gt),
      ),
    [q, op, gt],
  );

  return (
    <div>
      <PageHeader
        title="Historique des paris"
        description={`${filtered.length} paris correspondant aux filtres`}
        actions={
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Exporter
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher ID, client, référence..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={op} onValueChange={setOp}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Opérateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les opérateurs</SelectItem>
              {OPERATORS.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gt} onValueChange={setGt}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Type de jeu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les jeux</SelectItem>
              {GAME_TYPES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Opérateur</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Mise</TableHead>
                <TableHead className="text-right">Payé</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map((b) => (
                <TableRow key={b.id} className="cursor-pointer hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(b.date)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{b.ref}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <OperatorLogo name={b.operator.name} color={b.operator.color} size={22} />
                      <span className="text-sm">{b.operator.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{b.clientId}</TableCell>
                  <TableCell className="text-sm">{b.gameType}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatXOF(b.stake)}
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(b.payout)}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/betting/details/${b.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
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
