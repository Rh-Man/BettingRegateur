import type { AuthSession } from "@/types/auth";

const COMMON_API_URL =
  process.env.NEXT_PUBLIC_COMMON_API_URL?.replace(/\/$/, "") ?? "";

export interface RegulatorKpis {
  summary: {
    total_volume: number;
    total_transactions: number;
    total_tax: number;
    success_rate: number;
  };
  daily_volume: Array<{
    date: string;
    volume: number;
  }>;
  tax_distribution: Array<{
    transaction_type: string;
    tax_amount: number;
    percentage: number;
  }>;
  societe_stats: Array<{
    societe_code: string;
    raison_sociale: string;
    total_transactions: number;
    total_tax: number;
  }>;
  volume_by_type: Array<{
    transaction_type: string;
    volume: number;
    transaction_count: number;
  }>;
  last_transactions: Array<{
    tx_id: string;
    societe_code: string;
    transaction_type: string;
    amount: number;
    rate: number;
    tax: number;
    currency: string;
    posted_at: string;
  }>;
}

interface KpiResponse {
  message: string;
  data: RegulatorKpis;
}

interface KpiFilters {
  start: string;
  end: string;
}

export interface RegulatorTransaction {
  id: string;
  transaction_type: string;
  societe: string;
  amount: number;
  status: string;
  tax: number;
  date: string;
  region: string | null;
}

export interface TransactionListResponse {
  data: RegulatorTransaction[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface TransactionFilters {
  page?: number;
  limit?: number;
  start?: string;
  end?: string;
  status?: string;
  transactionType?: string;
}

async function commonRequest<T>(
  path: string,
  session: AuthSession,
  init: RequestInit,
) {
  if (!COMMON_API_URL) {
    throw new Error("NEXT_PUBLIC_COMMON_API_URL n'est pas configurée.");
  }

  const response = await fetch(`${COMMON_API_URL}${path}`, {
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
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const error = payload as { message?: string } | null;
    throw new Error(error?.message || `Erreur API (${response.status}).`);
  }

  return payload as T;
}

export async function getRegulatorKpis(
  session: AuthSession,
  filters: KpiFilters,
  signal?: AbortSignal,
) {
  if (!session.regulateurId) {
    throw new Error("Aucun régulateur n'est associé à ce compte.");
  }

  const payload = await commonRequest<KpiResponse>(
    "/monitrix/common/kpi",
    session,
    {
      method: "POST",
      signal,
      body: JSON.stringify({
        regulateur_id: session.regulateurId,
        start: filters.start,
        end: filters.end,
      }),
    },
  );
  return payload.data;
}

export function getRegulatorTransactions(
  session: AuthSession,
  filters: TransactionFilters,
  signal?: AbortSignal,
) {
  if (!session.regulateurId) {
    throw new Error("Aucun régulateur n'est associé à ce compte.");
  }

  return commonRequest<TransactionListResponse>(
    "/monitrix/common/transaction/list",
    session,
    {
      method: "POST",
      signal,
      body: JSON.stringify({
        regulateur_id: session.regulateurId,
        page: filters.page ?? 1,
        limit: filters.limit ?? 30,
        start: filters.start,
        end: filters.end,
        status: filters.status,
        transaction_type: filters.transactionType,
      }),
    },
  );
}

export async function getRegulatorTransaction(
  session: AuthSession,
  transactionId: string,
  societeCode: string,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({ societe_code: societeCode });
  const payload = await commonRequest<{ data: RegulatorTransaction }>(
    `/monitrix/common/transaction/${encodeURIComponent(transactionId)}?${query}`,
    session,
    { method: "GET", signal },
  );
  return payload.data;
}
