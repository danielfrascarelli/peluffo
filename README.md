# Peluffo Giguens

Internal tool for Peluffo, Colibrí and Fibras staff to coordinate mental-health patients and volunteer psychologists.

- Build tool: Vite 6
- Rendering: client-only SPA (no SSR)
- React: 18
- Node: 22 (`.nvmrc`), pnpm (`packageManager`)

## Development

```sh
nvm use                       # Node 22
git submodule update --init   # engineering standards in .standards/
pnpm install
pnpm hooks:install            # git hooks, once per clone
pnpm dev
```

Checks: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm security` (needs `gitleaks` on PATH).

## Data

All data and login come from the backend in `../backend`; run it on port 3000 first. `pnpm dev` proxies `/api/v1` there, so its session cookies stay same-origin. In production, serve the backend on the same site under `/api/v1`, or set `VITE_API_URL` (see `.env.example`). Tests fake the backend at `fetch` with `src/test/fixtures/`.

## Docs

- `AGENTS.md`: project facts, product rules and standards map for contributors and agents.
- `docs/decisions/`: architecture decision records.
