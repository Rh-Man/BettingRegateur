import type { AuthRole, ProjectType } from "@/types/auth";

export function canAccessProject(role: AuthRole, project: ProjectType) {
  if (role.scope_type === "monitrix") return true;
  if (role.project_type === "betting" && project === "payment") return true;
  return role.project_type === project;
}

export function canWrite(role: AuthRole) {
  return role.access_level === "owner" || role.access_level === "admin";
}

export function canAccessPath(role: AuthRole, pathname: string) {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/profil")) return true;
  if (pathname.startsWith("/dashboard/betting")) return canAccessProject(role, "betting");
  if (pathname.startsWith("/dashboard/payments")) return canAccessProject(role, "payment");
  if (
    pathname.startsWith("/dashboard/kyc") ||
    pathname.startsWith("/dashboard/taxes")
  ) {
    return canAccessProject(role, "betting");
  }
  if (
    pathname.startsWith("/dashboard/reports") ||
    pathname.startsWith("/dashboard/audit") ||
    pathname.startsWith("/dashboard/documents")
  ) {
    return true;
  }
  if (pathname.startsWith("/dashboard/alerts")) {
    return canAccessProject(role, "monitoring");
  }
  if (pathname.startsWith("/dashboard/settings")) return canWrite(role);
  return false;
}
