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

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Paramètres" description="Gestion globale de la plateforme." />
      <Tabs defaultValue="users">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="bookmakers">Bookmakers</TabsTrigger>
          <TabsTrigger value="payments">Prestataires</TabsTrigger>
          <TabsTrigger value="regulator">Régulateur</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="tax">Fiscalité</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Utilisateurs</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Nouvel utilisateur
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono text-xs">{u.id}</TableCell>
                      <TableCell className="font-medium text-sm">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-sm">{u.role}</TableCell>
                      <TableCell>
                        <StatusBadge status={u.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmakers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Entreprises de paris</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-3">
              {OPERATORS.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <OperatorLogo name={o.name} color={o.color} size={40} />
                  <div className="flex-1">
                    <p className="font-medium">{o.name}</p>
                    <p className="text-xs text-muted-foreground">Licence active · {o.id}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prestataires de paiement</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-3">
              {PAYMENT_PLATFORMS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-info/10 text-info font-semibold flex items-center justify-center">
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">API connectée</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulator" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Régulateur</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input defaultValue="LONASE" />
              </div>
              <div className="space-y-2">
                <Label>Email admin</Label>
                <Input defaultValue="admin@lonase.sn" />
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input defaultValue="Dakar, Sénégal" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input defaultValue="+221 33 889 19 19" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques calculées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["RJB", "Marge bénéficiaire", "Taux de gain", "Mise moyenne", "Taux de retrait"].map(
                (m) => (
                  <div
                    key={m}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/40"
                  >
                    <span className="text-sm font-medium">{m}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration fiscale</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Taux taxe gains joueurs (%)</Label>
                <Input type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label>Taux taxe revenus opérateurs (%)</Label>
                <Input type="number" defaultValue="20" />
              </div>
              <div className="space-y-2">
                <Label>Montant minimal imposable (XOF)</Label>
                <Input type="number" defaultValue="50000" />
              </div>
              <div className="space-y-2">
                <Label>Périodicité</Label>
                <Input defaultValue="Mensuelle" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
