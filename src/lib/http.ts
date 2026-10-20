import type { z } from "zod";

// Same-site backend; the Vite dev server proxies /api/v1 to it (vite.config.ts).
// Auth lives in httpOnly cookies the browser sends on its own: no token ever touches this code.
const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

let onSessionExpired = (): void => {};
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

export const send = (path: string, init?: RequestInit): Promise<Response> =>
  fetch(`${API_URL}/${path}`, { credentials: "include", ...init });

// One refresh in flight per tab: the backend revokes the session if an old refresh token is replayed.
let refreshing: Promise<boolean> | null = null;
function refreshSession(): Promise<boolean> {
  refreshing ??= send("auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .finally(() => (refreshing = null));
  return refreshing;
}

// Retries once after renewing an expired access cookie; a failed renewal ends the session.
export async function authedFetch(path: string): Promise<Response> {
  const res = await send(path);
  if (res.status !== 401) return res;
  if (await refreshSession()) return send(path);
  onSessionExpired();
  return res;
}

export async function getJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await authedFetch(path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return schema.parse(await res.json());
}
