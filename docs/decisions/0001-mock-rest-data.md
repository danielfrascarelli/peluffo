# 0001 Mock REST data served from public/api

Date: 2026-10-19 · Status: accepted

## Context

The prototype (exported from Figma Make) kept all data in a TypeScript module imported by components, and several screens kept their own mutable copies. Data must later come from a backend over REST.

## Decision

- Each resource is a JSON file in `public/api/<resource>.json` (`users`, `patients`, `psychologists`, `assignments`) served as static files.
- `src/lib/http.ts` builds URLs: without `VITE_API_URL` it reads `/api/<resource>.json`; with it, `${VITE_API_URL}/<resource>`. Switching to the backend is a config change.
- Every response is parsed with the zod schemas in `src/lib/schemas.ts`; TypeScript types are inferred from them.
- Components read through TanStack Query hooks in `src/hooks/queries.ts`. No component keeps a copy of server data in local state.
- Writes (assigning patients) only update the query cache for now (`useDataWriters`). Each writer is the single place to swap for a REST mutation.
- Mock login checks `users.json` in the browser. The backend MUST replace it with `POST /auth/login`; passwords must never reach the client.

## Alternatives rejected

- Keeping data in TS modules: no network boundary, nothing to swap.
- A mock server (MSW, json-server): more moving parts than a static file for read-only data.

## Consequences

- Changes made in the UI are lost on reload until a backend exists.
- Tests stub `fetch` at the HTTP boundary and serve the same JSON files (`src/test/renderWithProviders.tsx`).
