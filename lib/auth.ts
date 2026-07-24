import type { User } from "@/types";

export type Session = {
  token: string | null;
  tenantId: string | null;
  user: User | null;
} | null;

export function saveSession(token: string, tenantId: string, user: object) {
  localStorage.setItem("token", token);
  localStorage.setItem("tenantId", tenantId);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  const userRaw = localStorage.getItem("user");
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  return {
    token,
    tenantId,
    user,
  };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("user");
}
