"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  FileCheck2,
  KeyRound,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RadioTower,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth-api";
import {
  savePasswordChallenge,
  savePendingSession,
  saveSession,
  toSession,
} from "@/lib/session";

const METRICS = [
  { icon: RadioTower, value: "24/7", label: "Monitoring" },
  { icon: FileCheck2, value: "KYC", label: "Conformité" },
  { icon: Landmark, value: "XOF", label: "Fiscalité" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await login(String(form.get("email")), String(form.get("password")));

      if ("challengeName" in response) {
        savePasswordChallenge({
          email: response.email,
          session: response.session,
        });
        router.push("/auth/change-password");
        return;
      }

      if (
        response.data.role.scope_type !== "regulateur"
      ) {
        throw new Error("Ce compte ne correspond pas au portail régulateur sélectionné.");
      }

      const session = toSession(response);
      if (response.data.mfa_active) {
        savePendingSession(session);
        router.push("/auth/mfa");
      } else {
        saveSession(session);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid bg-background lg:grid-cols-[1.12fr_0.88fr]">
      <section className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 auth-grid opacity-40" />
        <div className="relative z-10 flex items-center gap-3 px-12 pt-10">
          <div className="relative h-10 w-10">
            <Image src="/logo-small.png" alt="Monitrix" fill className="object-contain" priority />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">Monitrix</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              Régulation
            </p>
          </div>
        </div>

        <div className="relative z-10 px-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/60 px-3 py-1.5 text-xs">
            <Activity className="h-3.5 w-3.5" />
            Supervision nationale des opérateurs
          </div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight">
            Pilotez la conformité des activités régulées.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-sidebar-foreground/75">
            Paris, paiements et monitoring réunis dans un espace sécurisé dédié aux autorités de
            régulation.
          </p>
          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            {METRICS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-md border border-sidebar-border bg-sidebar-accent/45 p-4">
                <Icon className="mb-4 h-4 w-4 text-sidebar-primary" />
                <p className="text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-sidebar-foreground/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 px-12 pb-10 text-xs text-sidebar-foreground/50">
          © 2026 Monitrix
        </p>
      </section>

      <main className="flex min-h-screen items-center justify-center app-surface p-4 sm:p-6 lg:p-12">
        <Card className="w-full max-w-[440px] border-border/50 shadow-2xl shadow-primary/10">
          <CardContent className="p-6 sm:p-10">
            <div className="mb-8">
              <p className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <LockKeyhole className="h-3.5 w-3.5" />
                Accès régulateur
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Connexion</h2>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                Utilisez les accès transmis par l’administrateur Monitrix.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" name="email" type="email" className="h-11 pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="h-11 pl-10"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Se connecter"}
                {!loading && <ArrowRight className="ml-auto h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
