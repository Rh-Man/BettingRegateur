import type {
  LoginResponse,
  NewPasswordChallengeResponse,
  ProjectType,
} from "@/types/auth";

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL?.replace(/\/$/, "") ?? "";

const REGULATOR_PROJECT_CODES: Array<{
  project: ProjectType;
  typeProjet: string;
}> = [
  { project: "payment", typeProjet: "Payment_regulateur" },
  { project: "betting", typeProjet: "Betting_regulateur" },
  { project: "monitoring", typeProjet: "Monitoring_regulateur" },
];

function requireApiUrl() {
  if (!AUTH_API_URL) {
    throw new Error("NEXT_PUBLIC_AUTH_API_URL n'est pas configurée.");
  }
  return AUTH_API_URL;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${requireApiUrl()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const body = payload as { message?: string } | null;
    throw new Error(body?.message || `Erreur d'authentification (${response.status}).`);
  }
  return payload as T;
}

export async function login(email: string, password: string) {
  let lastError: unknown;

  for (const candidate of REGULATOR_PROJECT_CODES) {
    try {
      return await request<LoginResponse | NewPasswordChallengeResponse>(
        "/monitrix/auth/admin/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            type_projet: candidate.typeProjet,
          }),
        },
      );
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Connexion impossible.");
}

export function completeNewPassword(
  email: string,
  newPassword: string,
  session: string,
) {
  return request<{ message: string; data: { passwordChanged: boolean } }>(
    "/monitrix/auth/admin/change-password",
    {
      method: "POST",
      body: JSON.stringify({ email, newPassword, session }),
    },
  );
}

export function validateMfa(idCognito: string, code: string) {
  return request<{ message: string; data: { validated: boolean } }>(
    `/monitrix/auth/login-mfa/${encodeURIComponent(idCognito)}`,
    { method: "POST", body: JSON.stringify({ code }) },
  );
}
