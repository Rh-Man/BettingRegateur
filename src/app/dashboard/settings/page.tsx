"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OperatorLogo } from "@/components/shared/OperatorLogo";
import { adminUsers, OPERATORS, PAYMENT_PLATFORMS } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectType = "betting" | "payment" | "monitoring";
type AccessLevel = "admin" | "viewer" | "developer";
type StructuredAccount = {
  id: string;
  name: string;
  email: string;
  scope_type: "societe";
  project_type: ProjectType;
  access_level: AccessLevel;
  status: string;
};

export default function SettingsPage() {
  const [usersList, setUsersList] = useState<StructuredAccount[]>(adminUsers);

  // Add state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProject, setNewProject] = useState<ProjectType>("betting");
  const [newRole, setNewRole] = useState<AccessLevel>("viewer");
  const [newStatus, setNewStatus] = useState("Actif");

  // Edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editProject, setEditProject] = useState<ProjectType>("betting");
  const [editRole, setEditRole] = useState<AccessLevel>("viewer");
  const [editStatus, setEditStatus] = useState("Actif");

  // Delete state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    const newUser = {
      id: `U00${usersList.length + 1}`,
      name: newName,
      email: newEmail,
      scope_type: "societe" as const,
      project_type: newProject,
      access_level: newRole,
      status: newStatus,
    };
    setUsersList([...usersList, newUser]);
    toast.success("Utilisateur administrateur ajouté avec succès !");
    setIsAddOpen(false);
    setNewName("");
    setNewEmail("");
    setNewProject("betting");
    setNewRole("viewer");
    setNewStatus("Actif");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editEmail) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setUsersList(
      usersList.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: editName,
              email: editEmail,
              project_type: editProject,
              access_level: editRole,
              status: editStatus,
            }
          : u
      )
    );
    toast.success("Utilisateur administrateur mis à jour !");
    setIsEditOpen(false);
    setEditingUser(null);
  };

  const handleDelete = () => {
    setUsersList(usersList.filter((u) => u.id !== deletingUser.id));
    toast.success("Utilisateur administrateur supprimé !");
    setIsDeleteOpen(false);
    setDeletingUser(null);
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditProject(user.project_type);
    setEditRole(user.access_level);
    setEditStatus(user.status);
    setIsEditOpen(true);
  };

  const openDelete = (user: any) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  // ==========================================
  // Bookmaker (Operators) States & Handlers
  // ==========================================
  const [operatorsList, setOperatorsList] = useState<any[]>(Array.from(OPERATORS));
  const [isAddBookmakerOpen, setIsAddBookmakerOpen] = useState(false);
  const [newBookmakerName, setNewBookmakerName] = useState("");
  const [newBookmakerId, setNewBookmakerId] = useState("");
  const [newBookmakerColor, setNewBookmakerColor] = useState("hsl(var(--chart-1))");
  const [isEditBookmakerOpen, setIsEditBookmakerOpen] = useState(false);
  const [editingBookmaker, setEditingBookmaker] = useState<any>(null);
  const [editBookmakerName, setEditBookmakerName] = useState("");
  const [editBookmakerId, setEditBookmakerId] = useState("");
  const [editBookmakerColor, setEditBookmakerColor] = useState("");

  const handleAddBookmaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookmakerName || !newBookmakerId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    const newBookmaker = {
      id: newBookmakerId.toLowerCase().trim(),
      name: newBookmakerName.trim(),
      color: newBookmakerColor,
    };
    setOperatorsList([...operatorsList, newBookmaker]);
    toast.success(`Bookmaker ${newBookmakerName} ajouté avec succès !`);
    setIsAddBookmakerOpen(false);
    setNewBookmakerName("");
    setNewBookmakerId("");
    setNewBookmakerColor("hsl(var(--chart-1))");
  };

  const handleEditBookmaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookmakerName || !editBookmakerId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setOperatorsList(
      operatorsList.map((op) =>
        op.id === editingBookmaker.id
          ? { ...op, name: editBookmakerName, id: editBookmakerId, color: editBookmakerColor }
          : op
      )
    );
    toast.success("Bookmaker mis à jour !");
    setIsEditBookmakerOpen(false);
    setEditingBookmaker(null);
  };

  const openEditBookmaker = (op: any) => {
    setEditingBookmaker(op);
    setEditBookmakerName(op.name);
    setEditBookmakerId(op.id);
    setEditBookmakerColor(op.color || "hsl(var(--chart-1))");
    setIsEditBookmakerOpen(true);
  };

  const handleDeleteBookmaker = (id: string) => {
    setOperatorsList(operatorsList.filter((op) => op.id !== id));
    toast.success("Bookmaker retiré avec succès !");
  };

  // ==========================================
  // Payment Providers States & Handlers
  // ==========================================
  const [paymentsList, setPaymentsList] = useState<any[]>(Array.from(PAYMENT_PLATFORMS));
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPaymentName, setNewPaymentName] = useState("");
  const [newPaymentId, setNewPaymentId] = useState("");
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [editPaymentName, setEditPaymentName] = useState("");
  const [editPaymentId, setEditPaymentId] = useState("");

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentName || !newPaymentId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    const newPayment = {
      id: newPaymentId.toLowerCase().trim(),
      name: newPaymentName.trim(),
    };
    setPaymentsList([...paymentsList, newPayment]);
    toast.success(`Prestataire ${newPaymentName} ajouté avec succès !`);
    setIsAddPaymentOpen(false);
    setNewPaymentName("");
    setNewPaymentId("");
  };

  const handleEditPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPaymentName || !editPaymentId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setPaymentsList(
      paymentsList.map((p) =>
        p.id === editingPayment.id
          ? { ...p, name: editPaymentName, id: editPaymentId }
          : p
      )
    );
    toast.success("Prestataire mis à jour !");
    setIsEditPaymentOpen(false);
    setEditingPayment(null);
  };

  const openEditPayment = (p: any) => {
    setEditingPayment(p);
    setEditPaymentName(p.name);
    setEditPaymentId(p.id);
    setIsEditPaymentOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    setPaymentsList(paymentsList.filter((p) => p.id !== id));
    toast.success("Prestataire de paiement retiré !");
  };

  // ==========================================
  // Metrics States & Handlers
  // ==========================================
  const [metricsList, setMetricsList] = useState<string[]>([
    "RJB",
    "Marge bénéficiaire",
    "Taux de gain",
    "Mise moyenne",
    "Taux de retrait",
  ]);
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [isEditMetricOpen, setIsEditMetricOpen] = useState(false);
  const [editingMetricIndex, setEditingMetricIndex] = useState<number | null>(null);
  const [editMetricName, setEditMetricName] = useState("");

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetricName) {
      toast.error("Veuillez remplir le champ.");
      return;
    }
    setMetricsList([...metricsList, newMetricName.trim()]);
    toast.success(`Métrique ${newMetricName} ajoutée !`);
    setIsAddMetricOpen(false);
    setNewMetricName("");
  };

  const handleEditMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMetricName || editingMetricIndex === null) {
      toast.error("Veuillez remplir le champ.");
      return;
    }
    const updated = [...metricsList];
    updated[editingMetricIndex] = editMetricName.trim();
    setMetricsList(updated);
    toast.success("Métrique de calcul mise à jour !");
    setIsEditMetricOpen(false);
    setEditingMetricIndex(null);
  };

  const openEditMetric = (index: number, name: string) => {
    setEditingMetricIndex(index);
    setEditMetricName(name);
    setIsEditMetricOpen(true);
  };

  const handleDeleteMetric = (index: number) => {
    setMetricsList(metricsList.filter((_, idx) => idx !== index));
    toast.success("Métrique retirée !");
  };

  return (
    <div>
      <PageHeader title="Paramètres" description="Gestion globale de la plateforme." />
      <Tabs defaultValue="users">
        <TabsList className="flex-wrap h-auto rounded-xl bg-background/50 border border-border/50 p-1">
          <TabsTrigger value="users" className="rounded-lg font-semibold text-xs py-1.5 px-3">Utilisateurs</TabsTrigger>
          <TabsTrigger value="bookmakers" className="rounded-lg font-semibold text-xs py-1.5 px-3">Bookmakers</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg font-semibold text-xs py-1.5 px-3">Prestataires</TabsTrigger>
          <TabsTrigger value="regulator" className="rounded-lg font-semibold text-xs py-1.5 px-3">Régulateur</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Utilisateurs administratifs</CardTitle>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.02]">
                    <Plus className="h-4 w-4" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[440px] rounded-2xl border-border/50 glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Ajouter un utilisateur</DialogTitle>
                    <DialogDescription className="text-xs font-semibold text-muted-foreground">
                      Créez un compte opérateur avec un rôle système structuré.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-foreground/80">Nom complet</Label>
                      <Input
                        id="name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Aminata Diallo"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-foreground/80">Adresse Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="a.diallo@lonase.sn"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground/80">Projet</Label>
                        <Select
                          value={newProject}
                          onValueChange={(value) => setNewProject(value as ProjectType)}
                        >
                          <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="betting">Betting</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                            <SelectItem value="monitoring">Monitoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground/80">Niveau d’accès</Label>
                        <Select
                          value={newRole}
                          onValueChange={(value) => setNewRole(value as AccessLevel)}
                        >
                          <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50 glass-card">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="developer">Développeur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground/80">Statut</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50 glass-card">
                            <SelectItem value="Actif" className="font-semibold text-xs rounded-lg text-success">Actif</SelectItem>
                            <SelectItem value="Inactif" className="font-semibold text-xs rounded-lg text-muted-foreground">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddOpen(false)}
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
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4 pl-6">ID</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Nom</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Email</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Projet</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Accès</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4">Statut</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 py-4 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((u) => (
                    <TableRow key={u.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                      <TableCell className="font-mono text-xs font-bold text-primary/80 py-4 pl-6">{u.id}</TableCell>
                      <TableCell className="font-bold text-sm text-foreground py-4">{u.name}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground py-4">{u.email}</TableCell>
                      <TableCell className="text-xs font-medium capitalize text-muted-foreground py-4">
                        {u.project_type}
                      </TableCell>
                      <TableCell className="text-xs font-bold capitalize text-foreground/80 py-4">
                        {u.access_level}
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={u.status} />
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(u)}
                          className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all mr-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(u)}
                          className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[440px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Modifier l'utilisateur</DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground">
                  Mettez à jour les privilèges ou les coordonnées de ce profil.
                </DialogDescription>
              </DialogHeader>
              {editingUser && (
                <form onSubmit={handleEdit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-name" className="text-xs font-bold text-foreground/80">Nom complet</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-email" className="text-xs font-bold text-foreground/80">Adresse Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground/80">Projet</Label>
                      <Select
                        value={editProject}
                        onValueChange={(value) => setEditProject(value as ProjectType)}
                      >
                        <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="betting">Betting</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground/80">Niveau d’accès</Label>
                      <Select
                        value={editRole}
                        onValueChange={(value) => setEditRole(value as AccessLevel)}
                      >
                        <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 glass-card">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="developer">Développeur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground/80">Statut</Label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl text-xs font-semibold">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 glass-card">
                          <SelectItem value="Actif" className="font-semibold text-xs rounded-lg text-success">Actif</SelectItem>
                          <SelectItem value="Inactif" className="font-semibold text-xs rounded-lg text-muted-foreground">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsEditOpen(false)}
                      className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="h-10 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                    >
                      Enregistrer les modifications
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold tracking-tight text-destructive flex items-center gap-1.5">
                  <Trash2 className="h-5 w-5" />
                  Confirmer la suppression
                </DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground pt-1">
                  Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur{" "}
                  <span className="font-bold text-foreground">
                    {deletingUser?.name} ({deletingUser?.email})
                  </span>{" "}
                  ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDeleteOpen(false)}
                  className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="h-10 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/10"
                >
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="bookmakers" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Entreprises de paris</CardTitle>
              <Dialog open={isAddBookmakerOpen} onOpenChange={setIsAddBookmakerOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.02]">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Ajouter un Bookmaker</DialogTitle>
                    <DialogDescription className="text-xs font-semibold text-muted-foreground">
                      Ajoutez une nouvelle entreprise de paris autorisée avec sa licence active.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddBookmaker} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="b-name" className="text-xs font-bold text-foreground/80">Nom du Bookmaker</Label>
                      <Input
                        id="b-name"
                        value={newBookmakerName}
                        onChange={(e) => setNewBookmakerName(e.target.value)}
                        placeholder="Ex: Sunubet"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="b-id" className="text-xs font-bold text-foreground/80">Identifiant technique / ID</Label>
                      <Input
                        id="b-id"
                        value={newBookmakerId}
                        onChange={(e) => setNewBookmakerId(e.target.value)}
                        placeholder="Ex: sunubet"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground/80">Couleur d'accentuation</Label>
                      <div className="flex gap-2 pt-1">
                        {[
                          "hsl(221, 83%, 53%)", // Cyber Blue
                          "hsl(142, 71%, 45%)", // Green
                          "hsl(346, 84%, 61%)", // Ruby Red
                          "hsl(47, 95%, 55%)",  // Amber
                          "hsl(262, 83%, 58%)", // Violet
                        ].map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setNewBookmakerColor(c)}
                            className={cn(
                              "h-6 w-6 rounded-full border transition-all hover:scale-110",
                              newBookmakerColor === c ? "border-primary scale-105 ring-2 ring-primary/20" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddBookmakerOpen(false)}
                        className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="h-10 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                      >
                        Créer
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-3 p-6">
              {operatorsList.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 glass-card shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: o.color || "hsl(var(--primary))" }} />
                  <div className="pl-2 flex items-center gap-3 flex-1">
                    <OperatorLogo name={o.name} color={o.color} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{o.name}</p>
                      <p className="text-xs font-semibold text-muted-foreground">Licence active · {o.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditBookmaker(o)} className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBookmaker(o.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Edit Bookmaker Dialog */}
          <Dialog open={isEditBookmakerOpen} onOpenChange={setIsEditBookmakerOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Modifier le Bookmaker</DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground">
                  Modifiez les paramètres du bookmaker sélectionné.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditBookmaker} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-b-name" className="text-xs font-bold text-foreground/80">Nom du Bookmaker</Label>
                  <Input
                    id="edit-b-name"
                    value={editBookmakerName}
                    onChange={(e) => setEditBookmakerName(e.target.value)}
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-b-id" className="text-xs font-bold text-foreground/80">Identifiant / ID</Label>
                  <Input
                    id="edit-b-id"
                    value={editBookmakerId}
                    onChange={(e) => setEditBookmakerId(e.target.value)}
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    disabled
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">Couleur d'accentuation</Label>
                  <div className="flex gap-2 pt-1">
                    {[
                      "hsl(221, 83%, 53%)", // Cyber Blue
                      "hsl(142, 71%, 45%)", // Green
                      "hsl(346, 84%, 61%)", // Ruby Red
                      "hsl(47, 95%, 55%)",  // Amber
                      "hsl(262, 83%, 58%)", // Violet
                    ].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setEditBookmakerColor(c)}
                        className={cn(
                          "h-6 w-6 rounded-full border transition-all hover:scale-110",
                          editBookmakerColor === c ? "border-primary scale-105 ring-2 ring-primary/20" : "border-transparent"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditBookmakerOpen(false)}
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
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Prestataires de paiement</CardTitle>
              <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.02]">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Ajouter un Prestataire</DialogTitle>
                    <DialogDescription className="text-xs font-semibold text-muted-foreground">
                      Ajoutez une passerelle de paiement ou un agrégateur financier.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPayment} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="p-name" className="text-xs font-bold text-foreground/80">Nom du Prestataire</Label>
                      <Input
                        id="p-name"
                        value={newPaymentName}
                        onChange={(e) => setNewPaymentName(e.target.value)}
                        placeholder="Ex: Wave"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="p-id" className="text-xs font-bold text-foreground/80">Code d'API / ID</Label>
                      <Input
                        id="p-id"
                        value={newPaymentId}
                        onChange={(e) => setNewPaymentId(e.target.value)}
                        placeholder="Ex: wave"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddPaymentOpen(false)}
                        className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="h-10 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                      >
                        Créer
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-3 p-6">
              {paymentsList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 glass-card shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary/50 to-accent/50" />
                  <div className="pl-2 h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{p.name}</p>
                    <p className="text-xs font-semibold text-muted-foreground">API connectée · {p.id}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditPayment(p)} className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePayment(p.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Edit Payment Dialog */}
          <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Modifier le Prestataire</DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground">
                  Modifiez les paramètres du prestataire sélectionné.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditPayment} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-p-name" className="text-xs font-bold text-foreground/80">Nom du Prestataire</Label>
                  <Input
                    id="edit-p-name"
                    value={editPaymentName}
                    onChange={(e) => setEditPaymentName(e.target.value)}
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-p-id" className="text-xs font-bold text-foreground/80">Identifiant / Code API</Label>
                  <Input
                    id="edit-p-id"
                    value={editPaymentId}
                    onChange={(e) => setEditPaymentId(e.target.value)}
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    disabled
                  />
                </div>
                <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditPaymentOpen(false)}
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
        </TabsContent>

        <TabsContent value="regulator" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Régulateur</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 p-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Nom</Label>
                <Input defaultValue="LONASE" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Email admin</Label>
                <Input defaultValue="admin@lonase.sn" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Adresse</Label>
                <Input defaultValue="Dakar, Sénégal" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Téléphone</Label>
                <Input defaultValue="+221 33 889 19 19" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Métriques calculées</CardTitle>
              <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.02]">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Ajouter une Métrique</DialogTitle>
                    <DialogDescription className="text-xs font-semibold text-muted-foreground">
                      Définissez une nouvelle métrique de calcul statistique globale.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMetric} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="m-name" className="text-xs font-bold text-foreground/80">Nom de la métrique</Label>
                      <Input
                        id="m-name"
                        value={newMetricName}
                        onChange={(e) => setNewMetricName(e.target.value)}
                        placeholder="Ex: Taux de rétention"
                        className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                        required
                      />
                    </div>
                    <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddMetricOpen(false)}
                        className="h-10 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="h-10 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                      >
                        Créer
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-2 p-6">
              {metricsList.map((m, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 glass-card shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/30" />
                  <span className="text-sm font-bold pl-2">{m}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditMetric(index, m)} className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMetric(index)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Edit Metric Dialog */}
          <Dialog open={isEditMetricOpen} onOpenChange={setIsEditMetricOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/50 glass-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Modifier la Métrique</DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground">
                  Modifiez le nom de la métrique globale calculée.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditMetric} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-m-name" className="text-xs font-bold text-foreground/80">Nom de la métrique</Label>
                  <Input
                    id="edit-m-name"
                    value={editMetricName}
                    onChange={(e) => setEditMetricName(e.target.value)}
                    className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm"
                    required
                  />
                </div>
                <DialogFooter className="pt-4 border-t border-border/50 mt-6 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditMetricOpen(false)}
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
        </TabsContent>

        <TabsContent value="tax" className="mt-4">
          <Card className="glass-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="py-4 px-6 border-b border-border/50">
              <CardTitle className="text-lg font-bold">Configuration fiscale</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 p-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Taux taxe gains joueurs (%)</Label>
                <Input type="number" defaultValue="15" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Taux taxe revenus opérateurs (%)</Label>
                <Input type="number" defaultValue="20" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Montant minimal imposable (XOF)</Label>
                <Input type="number" defaultValue="50000" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground/80">Périodicité</Label>
                <Input defaultValue="Mensuelle" className="h-10 rounded-xl bg-background/50 border-border/50 font-medium text-sm" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
