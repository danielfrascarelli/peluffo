import { render, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Serves public/api/<name>.json for fetch("/api/<name>.json"), the app's only HTTP boundary.
export function stubApi(): void {
  vi.stubGlobal("fetch", async (url: string) => {
    const match = /^\/api\/([\w-]+)\.json$/.exec(url);
    if (!match) return new Response(null, { status: 404 });
    const body = readFileSync(resolve(__dirname, `../../public/api/${match[1]}.json`), "utf8");
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
  });
}

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}
