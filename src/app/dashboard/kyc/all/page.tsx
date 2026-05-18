"use client";

import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { kycUsers } from "@/lib/mock-data";
import { formatXOF, formatDate } from "@/lib/format";
import { Users, CheckCircle2, Clock, XCircle, Search, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function KycAll() {
  const [users, setUsers] = useState(kycUsers);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");

  // Create User Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState("CNI");
  const [limit, setLimit] = useState("500000");

  const verified = users.filter((u) => u.status === "Vérifié").length;
  const pending = users.filter((u) => u.status === "En attente").length;
  const rejected = users.filter((u) => u.status === "Rejeté").length;

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (q === "" ||
            u.fullName.toLowerCase().includes(q.toLowerCase()) ||
            u.id.toLowerCase().includes(q.toLowerCase())) &&
          (st === "all" || u.status === st),
      ),
    [users, q, st],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newUser = {
      id: `USR${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      email,
      phone,
      limit: Number(limit) || 500000,
      documentType,
      status: "En attente" as const,
      verifiedBy: "Aminata Diallo",
      date: new Date().toISOString(),
    };

    setUsers([newUser, ...users]);
    toast.success("Utilisateur KYC créé avec succès !", {
      description: `${fullName} a été ajouté en attente de validation.`,
    });
    
    // Reset Form
    setFullName("");
    setEmail("");
    setPhone("");
    setDocumentType("CNI");
    setLimit("500000");
    setIsCreateOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="KYC — Tous les utilisateurs"
        description={`${users.length} utilisateurs au total`}
        actions={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.02]">
                <Plus className="h-4 w-4" />
                Créer Utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Nouveau Profil Utilisateur</DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground">
                  Créez un nouveau profil de parieur et lancez la vérification KYC.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-foreground/80">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Jean Dupont"
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-foreground/80">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="j.dupont@email.com"
                      className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-foreground/80">Téléphone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 123 45 67"
                      className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="documentType" className="text-xs font-bold text-foreground/80">Type de Document</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 glass-card">
                        <SelectItem value="CNI" className="font-semibold text-xs rounded-lg">CNI (Identité)</SelectItem>
                        <SelectItem value="Passeport" className="font-semibold text-xs rounded-lg">Passeport</SelectItem>
                        <SelectItem value="Permis" className="font-semibold text-xs rounded-lg">Permis de conduire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="limit" className="text-xs font-bold text-foreground/80">Limite journalière (XOF)</Label>
                    <Input
                      id="limit"
                      type="number"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="500000"
                      className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateOpen(false)}
                    className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                  >
                    Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total" value={`${users.length}`} icon={Users} accent="primary" />
        <KPICard title="Vérifiés" value={`${verified}`} icon={CheckCircle2} accent="success" />
        <KPICard title="En attente" value={`${pending}`} icon={Clock} accent="warning" />
        <KPICard title="Rejetés" value={`${rejected}`} icon={XCircle} accent="destructive" />
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nom, ID..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background/50 border-border/50"
            />
          </div>
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger className="w-44 h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 glass-card">
              <SelectItem value="all" className="font-semibold text-xs rounded-lg">Tous statuts</SelectItem>
              <SelectItem value="Vérifié" className="font-semibold text-xs rounded-lg text-success">Vérifié</SelectItem>
              <SelectItem value="En attente" className="font-semibold text-xs rounded-lg text-warning">En attente</SelectItem>
              <SelectItem value="Rejeté" className="font-semibold text-xs rounded-lg text-destructive">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4 pl-6">ID</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Nom</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Téléphone</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Email</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Statut</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Document</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4 text-right">Limite</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Vérifié par</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Date</TableHead>
                <TableHead className="py-4 pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map((u) => (
                <TableRow key={u.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-mono text-xs font-bold text-primary/80 py-4 pl-6">{u.id}</TableCell>
                  <TableCell className="font-bold text-sm text-foreground py-4">{u.fullName}</TableCell>
                  <TableCell className="text-xs font-semibold text-foreground/80 py-4">{u.phone}</TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground py-4">{u.email}</TableCell>
                  <TableCell className="py-4">
                    <StatusBadge status={u.status} />
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground py-4">{u.documentType}</TableCell>
                  <TableCell className="text-right text-xs font-bold text-primary py-4">{formatXOF(u.limit)}</TableCell>
                  <TableCell className="text-xs font-bold text-foreground/80 py-4">{u.verifiedBy}</TableCell>
                  <TableCell className="text-xs font-semibold text-muted-foreground py-4">
                    {formatDate(u.date)}
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    <Link href={`/dashboard/kyc/${u.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
