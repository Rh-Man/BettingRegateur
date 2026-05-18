import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Monitrix</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            Régulation moderne<br />des paris sportifs.
          </h2>
          <p className="mt-3 text-sidebar-foreground/70 max-w-md">
            Surveillance en temps réel, conformité KYC, gestion fiscale et audit pour les autorités de régulation.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/50">© 2025 LONASE · Tous droits réservés</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-border/60 shadow-sm">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-1">Accédez à la plateforme de régulation.</p>

            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/mfa" }); }}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="agent@lonase.sn" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link to="/reset" className="text-xs text-primary hover:underline">Oublié ?</Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Accès strictement réservé au personnel autorisé.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
