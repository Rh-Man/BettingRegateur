"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function MfaPage() {
  const [code, setCode] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center app-surface p-6 relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-[440px] glass-card border-border/50 shadow-2xl shadow-primary/10 relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardContent className="p-8 sm:p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner ring-1 ring-primary/20 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity" />
            <ShieldCheck className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">Vérification en 2 étapes</h1>
          <p className="text-sm leading-6 text-muted-foreground mt-3 px-2">
            Un niveau de sécurité supplémentaire est requis. Saisissez le code à 6 chiffres généré par votre application d'authentification.
          </p>
          
          <div className="flex justify-center mt-8">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot 
                    key={i} 
                    index={i} 
                    className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-border/50 bg-background/50 shadow-inner text-lg font-bold focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="mt-8 space-y-4">
            <Button
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-primary-foreground font-semibold gap-2"
              disabled={code.length < 6}
              onClick={() => router.push("/dashboard")}
            >
              Valider le code
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">
              Je n'ai pas reçu le code
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
