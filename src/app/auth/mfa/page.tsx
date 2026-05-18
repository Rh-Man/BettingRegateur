"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function MfaPage() {
  const [code, setCode] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mt-4">Vérification en deux étapes</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Saisissez le code à 6 chiffres envoyé sur votre téléphone.
          </p>
          <div className="flex justify-center mt-6">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            className="w-full mt-6"
            disabled={code.length < 6}
            onClick={() => router.push("/dashboard")}
          >
            Valider
          </Button>
          <button className="mt-3 text-xs text-primary hover:underline">Renvoyer le code</button>
        </CardContent>
      </Card>
    </div>
  );
}
