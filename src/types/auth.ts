export type ProjectType = "betting" | "payment" | "monitoring";
export type AccessLevel = "owner" | "admin" | "viewer" | "developer";

export interface AuthRole {
  scope_type: "monitrix" | "regulateur" | "societe";
  project_type: ProjectType | null;
  access_level: AccessLevel;
}

export interface AuthSession {
  idCognito: string;
  token: string;
  email: string;
  nom: string;
  prenom?: string;
  role: AuthRole;
  roleCode?: string;
  regulateurId?: string | number | null;
  paysId?: string | number | null;
  societeId?: string | number | null;
  societeCode?: string | null;
}

export interface LoginResponse {
  message: string;
  data: {
    id: string;
    idCognito: string;
    token: string;
    email: string;
    nom?: string;
    prenom?: string;
    roleCode?: string;
    role: AuthRole;
    access: boolean;
    mfa_active: boolean;
    regulateurId?: string | number | null;
    paysId?: string | number | null;
    societeId?: string | number | null;
    societe_code?: string | null;
  };
}

export interface NewPasswordChallengeResponse {
  message: string;
  challengeName: "NEW_PASSWORD_REQUIRED";
  session: string;
  email: string;
}

export interface PasswordChallenge {
  email: string;
  session: string;
}
