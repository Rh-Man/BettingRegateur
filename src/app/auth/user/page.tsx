import { Card, CardContent } from "@/components/ui/card";

export default function AuthUserPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold">Compte utilisateur</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Espace réservé aux informations de session et de profil authentifié.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
