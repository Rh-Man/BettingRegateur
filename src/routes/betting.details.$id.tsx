import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { OperatorLogo } from "@/components/operator-logo";
import { bets } from "@/lib/mock-data";
import { formatXOF, formatDateTime } from "@/lib/format";
import { ArrowLeft, Plus, User, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/betting/details/$id")({
  component: BettingDetails,
  head: () => ({ meta: [{ title: "Détails du pari" }] }),
});

function BettingDetails() {
  const { id } = Route.useParams();
  const bet = bets.find((b) => b.id === id) ?? bets[0];

  return (
    <div>
      <Link to="/betting/history" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour à l'historique
      </Link>

      <PageHeader title={`Pari ${bet.id}`} description={`Référence ${bet.ref}`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Ajouter une note</Button>} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations du pari</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <Info label="Statut" value={<StatusBadge status={bet.status} />} />
              <Info label="Date" value={formatDateTime(bet.date)} />
              <Info label="Type de jeu" value={bet.gameType} />
              <Info label="Cotes" value={bet.odds.toFixed(2)} />
              <Info label="Mise" value={<span className="font-semibold">{formatXOF(bet.stake)}</span>} />
              <Info label="Montant payé" value={<span className="font-semibold">{formatXOF(bet.payout)}</span>} />
              <Info label="Cashout" value={bet.cashout ? "Oui" : "Non"} />
              <Info label="Opérateur" value={
                <div className="flex items-center gap-2"><OperatorLogo name={bet.operator.name} color={bet.operator.color} size={20} />{bet.operator.name}</div>
              } />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Sélections</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {bet.selections.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{s.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.market} · {s.pick}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">{s.odds.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Historique d'audit</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-2 space-y-4">
                {[
                  { date: bet.date, event: "Pari créé", agent: "Système" },
                  { date: bet.date, event: "Validation initiale", agent: "A. Diallo" },
                  { date: bet.date, event: `Statut: ${bet.status}`, agent: "Système" },
                ].map((e, i) => (
                  <li key={i} className="ml-4">
                    <div className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="text-sm font-medium">{e.event}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(e.date)} · {e.agent}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Client</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><User className="h-5 w-5" /></div>
                <div>
                  <p className="font-medium">{bet.clientName}</p>
                  <p className="text-xs text-muted-foreground">{bet.clientId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />+221 77 123 45 67</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />client@example.sn</div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                <Stat label="Paris totaux" value="42" />
                <Stat label="ROI" value="+12 %" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-md bg-muted/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}
