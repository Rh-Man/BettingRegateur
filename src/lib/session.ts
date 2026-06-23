import type {
  AuthSession,
  LoginResponse,
  PasswordChallenge,
} from "@/types/auth";

const SESSION_KEY = "betwatch_guardian_session";
const PENDING_SESSION_KEY = "betwatch_guardian_pending_session";
const PASSWORD_CHALLENGE_KEY = "betwatch_guardian_password_challenge";

function canUseStorage() {
  return typeof window !== "undefined";
}

function read<T>(storage: Storage, key: string): T | null {
  const value = storage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function toSession(response: LoginResponse): AuthSession {
  return {
    idCognito: response.data.idCognito || response.data.id,
    token: response.data.token,
    email: response.data.email,
    nom: response.data.nom || "Administrateur régulateur",
    prenom: response.data.prenom,
    role: response.data.role,
    roleCode: response.data.roleCode,
    regulateurId: response.data.regulateurId,
    paysId: response.data.paysId,
    societeId: response.data.societeId,
    societeCode: response.data.societe_code,
  };
}

export function getSession() {
  if (!canUseStorage()) return null;
  return read<AuthSession>(window.localStorage, SESSION_KEY);
}

export function saveSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.sessionStorage.removeItem(PENDING_SESSION_KEY);
  window.dispatchEvent(new Event("betwatch-session-change"));
}

export function getPendingSession() {
  if (!canUseStorage()) return null;
  return read<AuthSession>(window.sessionStorage, PENDING_SESSION_KEY);
}

export function savePendingSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(PENDING_SESSION_KEY, JSON.stringify(session));
}

export function getPasswordChallenge() {
  if (!canUseStorage()) return null;
  return read<PasswordChallenge>(window.sessionStorage, PASSWORD_CHALLENGE_KEY);
}

export function savePasswordChallenge(challenge: PasswordChallenge) {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(PASSWORD_CHALLENGE_KEY, JSON.stringify(challenge));
}

export function clearPasswordChallenge() {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(PASSWORD_CHALLENGE_KEY);
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(PENDING_SESSION_KEY);
  window.sessionStorage.removeItem(PASSWORD_CHALLENGE_KEY);
  window.dispatchEvent(new Event("betwatch-session-change"));
}
