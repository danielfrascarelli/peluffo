import { authedFetch, send } from "@/lib/http";
import { userSchema, type User } from "@/lib/schemas";

// The backend sets httpOnly session cookies on success. null means wrong credentials.
export async function login(username: string, password: string): Promise<User | null> {
  const res = await send("auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`login failed: ${res.status}`);
  return userSchema.parse(await res.json());
}

// Restores the session after a reload. null means nobody is logged in.
export async function fetchCurrentUser(): Promise<User | null> {
  const res = await authedFetch("auth/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`GET auth/me failed: ${res.status}`);
  return userSchema.parse(await res.json());
}

export async function logout(): Promise<void> {
  await send("auth/logout", { method: "POST" });
}
