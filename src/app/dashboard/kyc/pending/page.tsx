"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { kycUsers } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Check, X, FileText, Camera, Home } from "lucide-react";
import { toast } from "sonner";

export default function KycPending() {
  const pending = kycUsers.filter((u) => u.status === "En attente");
  return (
    <div>
      <PageHeader
        title="Vérifications en attente"
        description={`${pending.length} dossiers à traiter`}
      />
      <div className="grid lg:grid-cols-2 gap-4">
        {pending.map((u) => (
          <Card key={u.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div>
                <CardTitle className="text-base">{u.fullName}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {u.id} · {formatDate(u.date)}
                </p>
              </div>
              <StatusBadge status={u.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  {u.phone} · {u.email}
                </p>
                <p>Document : {u.documentType}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      Documents
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Documents — {u.fullName}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: FileText, l: "Carte d'identité" },
                        { icon: Camera, l: "Selfie" },
                        { icon: Home, l: "Justificatif" },
                      ].map((d, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-3"
                        >
                          <d.icon className="h-8 w-8 mb-2" />
                          <span className="text-xs text-center">{d.l}</span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={() => toast.success(`${u.fullName} approuvé`)}
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => toast.error(`${u.fullName} rejeté`)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
