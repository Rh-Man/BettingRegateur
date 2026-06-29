"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";

export default function ResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center app-surface p-4 relative overflow-hidden sm:p-6">
      {/* Subtle decorative background elements */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-[440px] glass-card border-border/50 shadow-2xl shadow-primary/10 relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardContent className="p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Réinitialiser le mot de passe</h1>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Entrez votre adresse email et nous vous enverrons un lien pour sécuriser votre compte.
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground/80">Email professionnel</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  type="email" 
                  placeholder="agent@lonase.sn" 
                  className="pl-10 h-11 bg-background/50 border-border/50 shadow-inner rounded-xl focus-visible:ring-primary/50 transition-all"
                />
              </div>
            </div>
            
            <Button size="lg" className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-primary-foreground font-semibold">
              Envoyer le lien
            </Button>
            
            <div className="mt-4 flex justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
