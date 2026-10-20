import { render, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { userSchema, type User } from "@/lib/schemas";

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(resolve(__dirname, `fixtures/${name}.json`), "utf8"));

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const unauthenticated = (): Response => json({ statusCode: 401, code: "UNAUTHENTICATED", message: "" }, 401);

// Fakes the backend at fetch, the app's only HTTP boundary. The cookie session is reduced to "who logged in".
// fixtures/users.json keeps the demo passwords; the real backend stores only argon2 hashes.
export function stubApi(): void {
  let session: User | null = null;
  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    const path = url.replace(/^\/api\/v1\//, "");
    const method = init?.method ?? "GET";

    if (method === "POST" && path === "auth/login") {
      const { username, password } = JSON.parse(String(init?.body)) as { username: string; password: string };
      const users = z.array(userSchema.extend({ password: z.string() })).parse(fixture("users"));
      const match = users.find((u) => u.username === username && u.password === password);
      if (!match) return json({ statusCode: 401, code: "INVALID_CREDENTIALS", message: "" }, 401);
      session = userSchema.parse(match);
      return json(session);
    }
    if (method === "POST" && path === "auth/logout") {
      session = null;
      return new Response(null, { status: 204 });
    }
    if (!session) return unauthenticated();
    if (path === "auth/refresh") return new Response(null, { status: 204 });
    if (path === "auth/me") return json(session);
    return json(fixture(path));
  });
}

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}
