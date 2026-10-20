# 0005 Backend data and cookie session

Date: 2026-10-19 · Status: accepted · Supersedes [0001](0001-mock-rest-data.md)

## Context

`public/api/*.json` was downloadable by anyone, patient data and plaintext passwords included. The NestJS backend in `../backend` now serves the data behind login (its decision 0001 covers the server side).

## Decision

- The app always talks to the backend at `VITE_API_URL`, default `/api/v1`. The Vite dev server proxies `/api/v1` to `http://localhost:3000`.
- `public/api/` is gone. The JSON files moved to `src/test/fixtures/` and serve only as test data.
- Session: the backend sets httpOnly cookies; this code never sees a token. Every request sends `credentials: "include"`.
- `src/lib/http.ts` retries a request once after `POST auth/refresh` when it gets 401, with one refresh in flight per tab. A failed refresh ends the session.
- On load, `GET auth/me` restores the session. Logout and session expiry clear the query cache.
- Zod still parses every response; resource paths and schemas did not change.

## Alternatives rejected

- Keeping a mock mode without a backend: it needs the public JSON files, which is the leak this removes.
- Token in memory or `localStorage`: readable by any injected script.

## Consequences

- Development needs the backend running.
- Frontend and backend must be served from the same site; cookies are `SameSite=Strict`.
- Assignment writes still only update the query cache (`useDataWriters`) until the backend has write endpoints.
