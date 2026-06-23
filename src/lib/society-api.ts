import type { AuthSession, ProjectType } from "@/types/auth";

const COMMON_API_URL =
  process.env.NEXT_PUBLIC_COMMON_API_URL?.replace(/\/$/, "") ?? "";
const BACKOFFICE_API_URL =
  process.env.NEXT_PUBLIC_BACKOFFICE_API_URL?.replace(/\/$/, "") ?? "";

export interface Society {
  id: string;
  raisonSociale: string;
  code: string;
  email?: string;
  contact?: string;
  typeSocieteId?: number;
  projectType?: ProjectType;
  status: "connected" | "warning" | "disconnected";
  lastTransactionAt: string | null;
  volumeM1: number;
  taxesM1: number;
  alertCount: number;
}

export interface SocietyType {
  id: number;
  projectType: ProjectType;
  label: string;
  description: string;
}

interface OverviewRecord {
  id: string | number;
  raison_sociale: string;
  code: string;
  status: Society["status"];
  last_transaction_at: string | null;
  volume_m1: number;
  taxes_m1: number;
  alert_count: number;
}

interface SocietyDetails {
  email?: string;
  contact?: string;
  type_societe_id?: number;
}

function projectFromCode(code: string): ProjectType | null {
  const normalized = code.trim().toLowerCase();
  if (["bet", "betting"].includes(normalized)) return "betting";
  if (["pay", "payment", "payement"].includes(normalized)) return "payment";
  if (["mon", "monitoring"].includes(normalized)) return "monitoring";
  return null;
}

function typeDescription(projectType: ProjectType) {
  if (projectType === "betting") return "Opérateur de paris et jeux.";
  if (projectType === "payment") return "Prestataire ou agrégateur de paiement.";
  return "Intégration dédiée à la supervision.";
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text) as unknown;
    return typeof parsed === "string" && parsed.trim().startsWith("{")
      ? JSON.parse(parsed)
      : parsed;
  } catch {
    return text;
  }
}

async function request<T>(
  baseUrl: string,
  path: string,
  session: AuthSession,
  init: RequestInit,
) {
  if (!baseUrl) throw new Error("L’URL de l’API n’est pas configurée.");

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
      ...init.headers,
    },
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = payload as { message?: string; error?: string } | null;
    throw new Error(error?.message || error?.error || `Erreur API (${response.status}).`);
  }
  return payload as T;
}

export function getAllowedSocietyTypes(
  session: AuthSession,
  societyTypes: SocietyType[],
) {
  const project = session.role.project_type;
  if (project === "betting") {
    return societyTypes.filter((type) =>
      ["betting", "payment"].includes(type.projectType),
    );
  }
  return societyTypes.filter((type) => type.projectType === project);
}

export async function listSocietyTypes(
  session: AuthSession,
  signal?: AbortSignal,
) {
  const payload = await request<{
    data: Array<{ id: number; libelle: string; code: string }>;
  }>(
    BACKOFFICE_API_URL,
    "/monitrix/backoffice/admin/type-societe",
    session,
    { method: "GET", signal },
  );

  return payload.data.flatMap((type): SocietyType[] => {
    const projectType = projectFromCode(type.code);
    if (!projectType) return [];
    return [{
      id: Number(type.id),
      projectType,
      label: type.libelle,
      description: typeDescription(projectType),
    }];
  });
}

export async function listRegulatorSocieties(
  session: AuthSession,
  signal?: AbortSignal,
) {
  if (!session.regulateurId) {
    throw new Error("Aucun régulateur n’est associé à ce compte.");
  }

  const overview = await request<{ data: OverviewRecord[] }>(
    COMMON_API_URL,
    "/monitrix/common/societe-overview",
    session,
    {
      method: "POST",
      signal,
      body: JSON.stringify({ regulateur_id: session.regulateurId }),
    },
  );

  const details = await Promise.all(
    overview.data.map(async (society) => {
      try {
        const payload = await request<{ data: SocietyDetails }>(
          COMMON_API_URL,
          `/monitrix/common/societe/${encodeURIComponent(society.code)}`,
          session,
          { method: "GET", signal },
        );
        return payload.data;
      } catch {
        return {};
      }
    }),
  );

  return overview.data.map((society, index): Society => {
    const detail = details[index];
    return {
      id: String(society.id),
      raisonSociale: society.raison_sociale,
      code: society.code,
      email: detail.email,
      contact: detail.contact,
      typeSocieteId: detail.type_societe_id
        ? Number(detail.type_societe_id)
        : undefined,
      status: society.status,
      lastTransactionAt: society.last_transaction_at,
      volumeM1: Number(society.volume_m1),
      taxesM1: Number(society.taxes_m1),
      alertCount: Number(society.alert_count),
    };
  });
}

interface CreateSocietyInput {
  raisonSociale: string;
  code: string;
  email: string;
  contact: string;
  adminEmail: string;
  adminName: string;
  typeSocieteId: number;
}

export async function createRegulatorSociety(
  session: AuthSession,
  input: CreateSocietyInput,
) {
  if (!session.regulateurId || !session.paysId) {
    throw new Error("Le régulateur ou son pays n’est pas disponible dans la session.");
  }

  return request<{
    id: string | number;
    data: Record<string, unknown>;
    accountCreated: boolean;
  }>(
    BACKOFFICE_API_URL,
    "/monitrix/backoffice/admin/societe",
    session,
    {
      method: "POST",
      body: JSON.stringify({
        raison_sociale: input.raisonSociale,
        societe_code: input.code.trim().toUpperCase(),
        email: input.email,
        contact: input.contact,
        regulateur_id: session.regulateurId,
        type_societe_id: input.typeSocieteId,
        admin_email: input.adminEmail,
        admin_nom: input.adminName,
        pays_id: session.paysId,
      }),
    },
  );
}
