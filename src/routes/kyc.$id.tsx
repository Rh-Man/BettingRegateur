import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { kycUsers, bets, payments, GAME_TYPES } from "@/lib/mock-data";
import { formatXOF, formatDate, formatDateTime } from "@/lib/format";
import { ArrowLeft, User, Phone, Mail, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/kyc/$id")({
  component: KycDetails,
  head: () => ({ meta: [{ title: "Profil KYC" }] }),
});

function KycDetails() {
  const { id } = Route.useParams();
  const u = kycUsers.find((x) => x.id === id) ?? kycUsers[0];
  const gameData = GAME_TYPES.map((g) => ({ name: g, count: Math.floor(Math.random() * 40) + 5 }));
  const userBets = bets.slice(0, 8);
  const userPayments = payments.slice(0, 8);

  return (
    <div>
      <Link to="/kyc/all" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Link>
      <PageHeader title={u.fullName} description={u.id} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="bets">Paris</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {u.fullName}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {u.phone}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {u.email}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Dakar, SN</div>
              <div className="pt-3 border-t space-y-2">
                <Row label="Statut KYC" value={<StatusBadge status={u.status} />} />
                <Row label="Document" value={u.documentType} />
                <Row label="Vérifié par" value={u.verifiedBy} />
                <Row label="Date" value={formatDate(u.date)} />
                <Row label="Limite mensuelle" value={formatXOF(u.limit)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Métriques</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Stat label="Paris totaux" value="142" />
              <Stat label="ROI" value="+12,4 %" tone="success" />
              <Stat label="Retraits" value="48" />
              <Stat label="Dépôts" value={formatXOF(2_450_000)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Paris par type de jeu</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gameData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bets" className="mt-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <Stat label="Total mise" value={formatXOF(2_400_000)} />
            <Stat label="Profit" value={formatXOF(312_000)} tone="success" />
            <Stat label="Gagnants" value="62" />
            <Stat label="Perdants" value="48" />
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>État</TableHead><TableHead className="text-right">Mise</TableHead></TableRow></TableHeader>
              <TableBody>{userBets.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-xs">{formatDateTime(b.date)}</TableCell>
                  <TableCell className="text-sm">{b.gameType}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(b.stake)}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <Stat label="Dépôts" value={formatXOF(1_800_000)} />
            <Stat label="Retraits" value={formatXOF(620_000)} />
            <Stat label="Réussis" value="58" tone="success" />
            <Stat label="En attente" value="3" tone="warning" />
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Plateforme</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Montant</TableHead></TableRow></TableHeader>
              <TableBody>{userPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs">{formatDateTime(p.date)}</TableCell>
                  <TableCell className="text-sm">{p.platform.name}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right text-sm">{formatXOF(p.amount)}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "success" | "warning" }) {
  return <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">{label}</p><p className={`text-base font-semibold mt-1 ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : ""}`}>{value}</p></div>;
}
