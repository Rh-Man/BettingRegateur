import type { AuthSession } from "@/types/auth";

const URLS = {
  betting: process.env.NEXT_PUBLIC_BETTING_API_URL?.replace(/\/$/, "") ?? "",
  documents: process.env.NEXT_PUBLIC_DOCUMENTS_API_URL?.replace(/\/$/, "") ?? "",
  kyc: process.env.NEXT_PUBLIC_KYC_API_URL?.replace(/\/$/, "") ?? "",
  monitoring: process.env.NEXT_PUBLIC_MONITORING_API_URL?.replace(/\/$/, "") ?? "",
  taxes: process.env.NEXT_PUBLIC_TAXES_API_URL?.replace(/\/$/, "") ?? "",
  common: process.env.NEXT_PUBLIC_COMMON_API_URL?.replace(/\/$/, "") ?? "",
};

type ApiName = keyof typeof URLS;

async function request<T>(
  api: ApiName,
  path: string,
  session: AuthSession,
  init: RequestInit,
) {
  const baseUrl = URLS[api];
  if (!baseUrl) throw new Error(`L’API ${api} n’est pas configurée.`);
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
      ...init.headers,
    },
  });
  const text = await response.text();
  let payload: unknown = null;
  try {
    const parsed = text ? JSON.parse(text) : null;
    payload =
      typeof parsed === "string" && parsed.trim().startsWith("{")
        ? JSON.parse(parsed)
        : parsed;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const error = payload as { message?: string } | null;
    throw new Error(error?.message || `Erreur API (${response.status}).`);
  }
  return payload as T;
}

function regulatorBody(session: AuthSession, extra: Record<string, unknown> = {}) {
  if (!session.regulateurId) throw new Error("Aucun régulateur associé au compte.");
  return JSON.stringify({ regulateur_id: session.regulateurId, ...extra });
}

export interface Bet {
  id: string;
  societe_code: string;
  transaction_type: string;
  amount: number;
  status: string;
  tax: number;
  date: string;
  region: string | null;
  customer_ref: string | null;
}

export function listBets(session: AuthSession, signal?: AbortSignal) {
  return request<{ data: Bet[]; total: number }>(
    "betting",
    "/monitrix/betting/betting/history",
    session,
    {
      method: "POST",
      signal,
      body: regulatorBody(session, { limit: 100 }),
    },
  );
}

export function getBet(
  session: AuthSession,
  id: string,
  societyCode: string,
  signal?: AbortSignal,
) {
  return request<{
    data: {
      bet: Bet & { selections?: unknown; meta?: unknown };
      tax_info: Record<string, unknown> | null;
      customer: Record<string, unknown> | null;
      audit_log: Array<Record<string, unknown>>;
    };
  }>(
    "betting",
    `/monitrix/betting/betting/${encodeURIComponent(id)}?societe_code=${encodeURIComponent(societyCode)}`,
    session,
    { method: "GET", signal },
  );
}

export interface KycUser {
  id: number;
  external_user_ref: string;
  status: string;
  risk_score: number;
  risk_level: string;
  last_tx_at: string | null;
  societe_code: string;
  kyc_status?: string | null;
  phone?: string | null;
}

export function listKycUsers(
  session: AuthSession,
  pending = false,
  signal?: AbortSignal,
) {
  return request<{ data: KycUser[]; total: number }>(
    "kyc",
    pending ? "/monitrix/kyc/pending" : "/monitrix/kyc/users",
    session,
    {
      method: "POST",
      signal,
      body: regulatorBody(session, { limit: 100 }),
    },
  );
}

export function getKycUser(session: AuthSession, id: string, signal?: AbortSignal) {
  return request<{ data: KycUser & {
    raison_sociale: string;
    mm_accounts: Array<Record<string, unknown>>;
    phones: Array<Record<string, unknown>>;
    alerts: Array<Record<string, unknown>>;
  } }>("kyc", `/monitrix/kyc/${encodeURIComponent(id)}`, session, {
    method: "GET",
    signal,
  });
}

export function updateKycStatus(
  session: AuthSession,
  id: string,
  action: "approve" | "reject",
) {
  return request<{ message: string }>(
    "kyc",
    `/monitrix/kyc/${encodeURIComponent(id)}/${action}`,
    session,
    { method: "POST" },
  );
}

export interface DocumentRecord {
  id: number;
  name: string | null;
  path: string;
  file_size: number | null;
  uploaded_at: string;
  type: string;
  type_code: string;
  societe_code: string;
  raison_sociale: string;
}

export function listDocuments(session: AuthSession, signal?: AbortSignal) {
  return request<{ data: DocumentRecord[]; total: number }>(
    "documents",
    "/monitrix/documents/list",
    session,
    {
      method: "POST",
      signal,
      body: regulatorBody(session, { limit: 100 }),
    },
  );
}

export interface MonitoringAlert {
  id: number;
  type: string;
  severity: string;
  state: string;
  seuil: number | null;
  valeur_actuelle: number | null;
  meta: unknown;
  tx_id: string | null;
  created_at: string;
  closed_at: string | null;
  societe_code: string | null;
  raison_sociale: string | null;
}

export function listMonitoringAlerts(session: AuthSession, signal?: AbortSignal) {
  return request<{
    data: {
      alerts: MonitoringAlert[];
      counters: Record<string, number>;
    };
  }>("monitoring", "/monitrix/monitoring/alerts/list", session, {
    method: "POST",
    signal,
    body: regulatorBody(session, { page_size: 100 }),
  });
}

export function updateMonitoringAlert(
  session: AuthSession,
  id: number,
  action: "acknowledge" | "close",
) {
  return request<{ message: string }>(
    "monitoring",
    `/monitrix/monitoring/alerts/${id}/${action}`,
    session,
    { method: "PATCH" },
  );
}

export interface TaxKpis {
  kpis: {
    total_tax: number;
    transaction_count: number;
    avg_tax_rate: number;
    collection_efficiency: number;
  };
  monthly_evolution: Array<{
    month: string;
    total_tax: number;
    transaction_count: number;
  }>;
  by_operator: Array<{
    societe_code: string;
    raison_sociale: string;
    total_tax: number;
    transaction_count: number;
  }>;
}

export function getTaxKpis(session: AuthSession, signal?: AbortSignal) {
  return request<{ data: TaxKpis }>(
    "common",
    "/monitrix/common/get-taxes-kpis",
    session,
    { method: "POST", signal, body: regulatorBody(session) },
  );
}

export interface Reversement {
  id: number;
  reference: string;
  operator: string;
  amount: number;
  status: string;
  period_start: string;
  period_end: string;
  note: string | null;
  created_at: string;
  bank_name: string | null;
  account_number: string | null;
}

export function listReversements(session: AuthSession, signal?: AbortSignal) {
  return request<{ data: Reversement[]; total: number }>(
    "taxes",
    "/monitrix/taxes/reversements",
    session,
    {
      method: "POST",
      signal,
      body: regulatorBody(session, { limit: 100 }),
    },
  );
}

export interface Invoice {
  id: number;
  period: string;
  amount_due: number;
  amount_paid: number;
  status: string;
  due_date: string;
  pdf_url: string | null;
  created_at: string;
  societe_code: string;
  raison_sociale: string;
}

export function listInvoices(session: AuthSession, signal?: AbortSignal) {
  return request<{ data: { invoices: Invoice[] } }>(
    "common",
    "/monitrix/common/invoice/list",
    session,
    { method: "POST", signal, body: regulatorBody(session) },
  );
}
