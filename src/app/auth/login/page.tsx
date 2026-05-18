"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  KeyRound,
  Landmark,
  LockKeyhole,
  Mail,
  RadioTower,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const METRICS = [
  { icon: RadioTower, value: "24/7", label: "Monitoring" },
  { icon: FileCheck2, value: "KYC", label: "Conformité" },
  { icon: Landmark, value: "XOF", label: "Fiscalité" },
];

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen grid bg-background lg:grid-cols-[1.12fr_0.88fr]">
      <section className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 auth-grid opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-sidebar to-transparent" />

        <div className="relative z-10 flex items-center gap-2 px-12 pt-10">
          <div className="relative h-10 w-10">
            <Image
              src="/logo-small.png"
              alt="Monitrix Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">Monitrix</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              Régulation
            </p>
          </div>
        </div>

        <div className="relative z-10 px-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/60 px-3 py-1.5 text-xs text-sidebar-foreground/80 shadow-sm">
            <Activity className="h-3.5 w-3.5" />
            Supervision nationale des opérateurs
          </div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight">
            Pilotez la conformité des paris sportifs en temps réel.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-sidebar-foreground/75">
            Surveillance en temps réel, conformité KYC, gestion fiscale et audit pour les autorités
            de régulation.
          </p>

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            {METRICS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-md border border-sidebar-border bg-sidebar-accent/45 p-4 shadow-sm"
              >
                <Icon className="mb-4 h-4 w-4 text-sidebar-primary" />
                <p className="text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-sidebar-foreground/60">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 max-w-lg rounded-md border border-sidebar-border bg-sidebar-accent/35 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-sidebar-primary" />
              <p className="text-sm leading-6 text-sidebar-foreground/78">
                Dernière synchronisation opérateurs: données paris, paiements et taxes consolidées
                sur l’environnement de supervision.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 px-12 pb-10 text-xs text-sidebar-foreground/50">
        
        </p>
      </section>

      <main className="flex min-h-screen items-center justify-center app-surface p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle decorative background elements for the right side */}
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-inner bg-background p-1">
              <Image
                src="/logo-small.png"
                alt="Monitrix Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Monitrix</p>
              <p className="mt-1 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Régulation
              </p>
            </div>
          </div>

          <Card className="glass-card border-border/50 shadow-2xl shadow-primary/10 relative overflow-hidden">
            {/* Subtle top border highlight */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <CardContent className="p-8 sm:p-10">
              <div className="mb-8">
                <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Accès sécurisé
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
                <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                  Identifiez-vous pour accéder aux tableaux de bord de supervision de <span className="font-semibold text-foreground">Monitrix</span>.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push("/auth/mfa");
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-foreground/80">Email professionnel</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="agent@lonase.sn"
                      autoComplete="email"
                      className="pl-10 h-11 bg-background/50 border-border/50 shadow-inner rounded-xl focus-visible:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password" className="font-semibold text-foreground/80">Mot de passe</Label>
                    <Link
                      href="/auth/reset"
                      className="text-xs font-semibold text-primary hover:text-accent transition-colors hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative group">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pl-10 h-11 bg-background/50 border-border/50 shadow-inner rounded-xl focus-visible:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 px-4 h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-primary-foreground font-semibold">
                  Se connecter
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </form>

              <div className="mt-8 rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm px-4 py-3 shadow-inner">
                <p className="text-center text-xs leading-5 text-muted-foreground font-medium">
                  Accès strictement réservé au personnel autorisé. Toute activité est <span className="font-semibold text-foreground/70">journalisée</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground cursor-default">
            Besoin d’un accès ? Contactez l’administrateur Monitrix.
          </p>
        </div>
      </main>
    </div>
  );
}
