"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Régulateur", "Métriques", "Finalisation"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    i <= step
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    i === step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
          <div className="min-h-[200px]">
            <h2 className="text-xl font-semibold">{STEPS[step]}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {step === 0 && "Configurez les informations de votre organisme de régulation."}
              {step === 1 && "Sélectionnez les métriques que vous souhaitez collecter."}
              {step === 2 && "Tout est prêt ! Vous pouvez accéder à votre dashboard."}
            </p>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Précédent
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)}>Suivant</Button>
            ) : (
              <Button onClick={() => router.push("/dashboard")}>Accéder au dashboard</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
