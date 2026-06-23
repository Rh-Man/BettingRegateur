"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound, LoaderCircle, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeNewPassword } from "@/lib/auth-api";
import {
  clearPasswordChallenge,
  getPasswordChallenge,
} from "@/lib/session";
import type { PasswordChallenge } from "@/types/auth";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<PasswordChallenge | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const value = getPasswordChallenge();
    if (!value) {
      router.replace("/auth/login");
      return;
    }
    setChallenge(value);
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("newPassword") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (!PASSWORD_RULE.test(password)) {
      setError(
        "Utilisez au moins 12 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      return;
    }
    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!challenge) {
      setError("La session a expiré. Recommencez la connexion.");
      return;
    }

    setLoading(true);
    try {
      await completeNewPassword(challenge.email, password, challenge.session);
      clearPasswordChallenge();
      router.replace("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center app-surface p-6">
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardContent className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold">Créer votre mot de passe</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Remplacez le mot de passe temporaire reçu par email avant d’accéder au portail.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {["newPassword", "confirmation"].map((name) => (
              <div className="space-y-2" key={name}>
                <Label htmlFor={name}>
                  {name === "newPassword" ? "Nouveau mot de passe" : "Confirmer le mot de passe"}
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={name}
                    name={name}
                    type="password"
                    className="pl-9"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            ))}
            {error && (
              <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading || !challenge}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
