import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { OperatorLogo } from "@/components/operator-logo";
import { payments } from "@/lib/mock-data";
import { formatXOF, formatDateTime } from "@/lib/format";
import { ArrowLeft, Plus, AlertTriangle, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/payments/transactions/$id")({
  component: TxDetails,
  head: () => ({ meta: [{ title: "Détail transaction" }] }),
});

function TxDetails() {
  const { id } = Route.useParams();
  const tx = payments.find((p) => p.id === id) ?? payments[0];

  return (
    <div>
      <Link to="/payments/history" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour
      </Link>
      <PageHeader title={`Transaction ${tx.id}`} description={tx.reference}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Ajouter un log d'audit</Button>} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Statut" value={<StatusBadge status={tx.status} />} />
            <Info label="Date" value={formatDateTime(tx.date)} />
            <Info label="Montant" value={<span className="font-semibold text-base">{formatXOF(tx.amount)}</span>} />
            <Info label="Type" value={tx.type} />
            <Info label="Opérateur" value={<div className="flex items-center gap-2"><OperatorLogo name={tx.operator.name} color={tx.operator.color} size={20} />{tx.operator.name}</div>} />
            <Info label="Plateforme" value={tx.platform.name} />
            <Info label="Méthode" value={tx.method} />
            <Info label="Référence" value={<span className="font-mono text-xs">{tx.reference}</span>} />
            <Info label="Temps traitement" value={tx.processingTime} />
            <Info label="IP" value={<span className="font-mono text-xs">{tx.ip}</span>} />
            <Info label="Localisation" value={tx.location} />
            <Info label="Device" value={tx.device} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-warning" />Audit fraude & conformité</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { risk: "Low", text: "Vérification KYC validée", date: tx.date },
              { risk: "Medium", text: "Plusieurs transactions rapprochées", date: tx.date },
              { risk: "High", text: "IP inhabituelle pour ce client", date: tx.date },
            ].map((l, i) => (
              <div key={i} className="p-3 rounded-md border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${l.risk==="High"?"bg-destructive/15 text-destructive":l.risk==="Medium"?"bg-warning/15 text-warning":"bg-success/15 text-success"}`}>{l.risk}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(l.date)}</span>
                </div>
                <p className="text-sm">{l.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1">{value}</div></div>;
}
