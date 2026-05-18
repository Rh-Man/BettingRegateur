import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset")({ component: ResetPage });

function ResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold">Réinitialiser le mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-1">Nous vous enverrons un lien par email.</p>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="vous@lonase.sn" />
            </div>
            <Button className="w-full">Envoyer le lien</Button>
            <Link to="/login" className="block text-center text-xs text-primary hover:underline">← Retour à la connexion</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
