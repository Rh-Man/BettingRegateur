import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/profil")({
  component: ProfilPage,
  head: () => ({ meta: [{ title: "Mon profil" }] }),
});

function ProfilPage() {
  return (
    <div>
      <PageHeader title="Mon profil" description="Gérez vos informations et votre sécurité." />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations personnelles</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nom complet</Label><Input defaultValue="Aminata Diallo" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="a.diallo@lonase.sn" /></div>
              <div className="space-y-2"><Label>Téléphone</Label><Input defaultValue="+221 77 555 12 34" /></div>
              <div className="space-y-2"><Label>Département</Label><Input defaultValue="Régulation" /></div>
              <div className="space-y-2"><Label>Poste</Label><Input defaultValue="Administrateur" /></div>
              <div className="space-y-2"><Label>Adresse</Label><Input defaultValue="Dakar, SN" /></div>
              <div className="md:col-span-2"><Button>Enregistrer</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle>Mot de passe</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Actuel</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Nouveau</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Confirmer</Label><Input type="password" /></div>
              <div className="md:col-span-3"><Button>Changer le mot de passe</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Authentification à deux facteurs</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">2FA activé</p>
                <p className="text-xs text-muted-foreground mt-1">Code à 6 chiffres envoyé par SMS à chaque connexion.</p>
              </div>
              <Switch defaultChecked />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Dernière connexion</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">18 mai 2026 à 09:42 · Dakar, SN · Chrome / macOS</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
