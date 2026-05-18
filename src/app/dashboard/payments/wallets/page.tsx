"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { Button } from "@/components/ui/button";
import { wallets } from "@/lib/mock-data";
import { formatXOF, formatNumber } from "@/lib/format";
import { Wallet as WalletIcon, Building2, CheckCircle2, History } from "lucide-react";

export default function WalletsPage() {
  const total = wallets.reduce((s, w) => s + w.balance, 0);
  return (
    <div>
      <PageHeader title="Portefeuilles" description="Soldes et activité des wallets opérateurs." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard title="Solde total" value={formatXOF(total)} icon={WalletIcon} accent="primary" />
        <KPICard
          title="Wallets actifs"
          value={`${wallets.filter((w) => w.active).length}`}
          icon={CheckCircle2}
          accent="success"
        />
        <KPICard title="Bookmakers" value={`${wallets.length}`} icon={Building2} accent="info" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {wallets.map((w) => (
          <Card key={w.operator.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <OperatorLogo name={w.operator.name} color={w.operator.color} size={36} />
                <div>
                  <CardTitle className="text-base">{w.operator.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Actif · {formatNumber(w.transactions)} transactions
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <History className="h-3.5 w-3.5 mr-1.5" />
                Historique
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-primary/5">
                  <p className="text-xs text-muted-foreground">Solde disponible</p>
                  <p className="text-lg font-semibold mt-1">{formatXOF(w.balance)}</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/5">
                  <p className="text-xs text-muted-foreground">En attente</p>
                  <p className="text-lg font-semibold mt-1">{formatXOF(w.pending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
