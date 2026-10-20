import type { z } from "zod";

// Without VITE_API_URL the app reads the static mock files in public/api/<resource>.json.
// Point VITE_API_URL at the backend and the same paths become REST endpoints.
const API_URL = import.meta.env.VITE_API_URL;
const resourceUrl = (path: string): string => (API_URL ? `${API_URL}/${path}` : `/api/${path}.json`);

export async function getJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(resourceUrl(path));
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return schema.parse(await res.json());
}
