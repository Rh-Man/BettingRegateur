"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  CircleAlert,
  Plus,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";
import { formatDateTime, formatXOF } from "@/lib/format";
import {
  createRegulatorSociety,
  getAllowedSocietyTypes,
  listRegulatorSocieties,
  listSocietyTypes,
  type Society,
  type SocietyType,
} from "@/lib/society-api";
import { toast } from "sonner";

const STATUS_LABELS: Record<Society["status"], string> = {
  connected: "Connectée",
  warning: "À surveiller",
  disconnected: "Déconnectée",
};

export default function SettingsPage() {
  const session = useSession();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [societyTypes, setSocietyTypes] = useState<SocietyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    raisonSociale: "",
    code: "",
    email: "",
    contact: "",
    adminEmail: "",
    adminName: "",
    typeSocieteId: "",
  });

  const allowedTypes = useMemo(
    () => (session ? getAllowedSocietyTypes(session, societyTypes) : []),
    [session, societyTypes],
  );

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    Promise.all([
      listRegulatorSocieties(session, controller.signal),
      listSocietyTypes(session, controller.signal),
    ])
      .then(([societyList, typeList]) => {
        setSocieties(societyList);
        setSocietyTypes(typeList);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setSocieties([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Impossible de charger les sociétés.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [refreshKey, session]);

  useEffect(() => {
    if (!form.typeSocieteId && allowedTypes[0]) {
      setForm((current) => ({
        ...current,
        typeSocieteId: String(allowedTypes[0].id),
      }));
    }
  }, [allowedTypes, form.typeSocieteId]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;

    setSubmitting(true);
    try {
      await createRegulatorSociety(session, {
        raisonSociale: form.raisonSociale.trim(),
        code: form.code.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
        adminEmail: form.adminEmail.trim(),
        adminName: form.adminName.trim(),
        typeSocieteId: Number(form.typeSocieteId),
      });
      toast.success("Société et compte administrateur créés.");
      setDialogOpen(false);
      setForm({
        raisonSociale: "",
        code: "",
        email: "",
        contact: "",
        adminEmail: "",
        adminName: "",
        typeSocieteId: allowedTypes[0] ? String(allowedTypes[0].id) : "",
      });
      setRefreshKey((key) => key + 1);
    } catch (creationError) {
      toast.error(
        creationError instanceof Error
          ? creationError.message
          : "La création a échoué.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Paramètres"
        description="Gestion des sociétés rattachées à votre régulateur."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Actualiser
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Créer une société
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouvelle société</DialogTitle>
                  <DialogDescription>
                    Le compte administrateur sera créé automatiquement et recevra ses accès par email.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="raison-sociale"
                      label="Raison sociale"
                      value={form.raisonSociale}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, raisonSociale: value }))
                      }
                      placeholder="Ex. Freewan Payments"
                    />
                    <Field
                      id="societe-code"
                      label="Code société"
                      value={form.code}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, code: value.toUpperCase() }))
                      }
                      placeholder="Ex. FREEPAY"
                    />
                    <Field
                      id="societe-email"
                      label="Email de la société"
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, email: value }))
                      }
                      placeholder="contact@entreprise.com"
                    />
                    <Field
                      id="societe-contact"
                      label="Téléphone"
                      value={form.contact}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, contact: value }))
                      }
                      placeholder="+221 77 000 00 00"
                    />
                    <Field
                      id="admin-name"
                      label="Nom de l’administrateur"
                      value={form.adminName}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, adminName: value }))
                      }
                      placeholder="Nom complet"
                    />
                    <Field
                      id="admin-email"
                      label="Email de l’administrateur"
                      type="email"
                      value={form.adminEmail}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, adminEmail: value }))
                      }
                      placeholder="admin@entreprise.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type de société</Label>
                    <Select
                      value={form.typeSocieteId}
                      onValueChange={(value) =>
                        setForm((current) => ({ ...current, typeSocieteId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Les types proposés dépendent du projet attribué à votre compte régulateur.
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={submitting || !form.typeSocieteId}>
                      {submitting ? "Création..." : "Créer la société et le compte"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Alert className="mb-6">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Périmètre de création</AlertTitle>
        <AlertDescription>
          {allowedTypes.length
            ? allowedTypes.map((type) => type.label).join(" · ")
            : "Aucun type autorisé pour ce compte."}
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Chargement impossible</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Sociétés rattachées
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : societies.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Société</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Connexion</TableHead>
                  <TableHead className="text-right">Volume M-1</TableHead>
                  <TableHead className="text-right">Taxes M-1</TableHead>
                  <TableHead className="text-right">Alertes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {societies.map((society) => {
                  const type = societyTypes.find(
                    (item) => item.id === society.typeSocieteId,
                  );
                  return (
                    <TableRow key={society.id}>
                      <TableCell>
                        <p className="font-medium">{society.raisonSociale}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {society.code}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{type?.label || "Non renseigné"}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{society.email || "Non renseigné"}</p>
                        <p className="text-xs text-muted-foreground">
                          {society.contact || "Aucun téléphone"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm">{STATUS_LABELS[society.status]}</p>
                            <p className="text-xs text-muted-foreground">
                              {society.lastTransactionAt
                                ? formatDateTime(society.lastTransactionAt)
                                : "Aucune transaction"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatXOF(society.volumeM1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatXOF(society.taxesM1)}
                      </TableCell>
                      <TableCell className="text-right">{society.alertCount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
              <Building2 className="mb-3 h-9 w-9 text-muted-foreground" />
              <p className="font-medium">Aucune société rattachée</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Créez votre premier opérateur avec le bouton en haut de page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
