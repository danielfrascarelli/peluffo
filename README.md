# Peluffo Giguens

Gestión de pacientes y psicólogos voluntarios.

- Build tool: Vite 6
- Rendering: client-only SPA (no SSR)
- React: 18
- Node: 22 (`.nvmrc`), pnpm (`packageManager`)

## Desarrollo

```sh
git submodule update --init   # engineering standards en .standards/
pnpm install
pnpm hooks:install            # git hooks (por clon)
pnpm dev
```

Checks: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm security` (requiere `gitleaks` en el PATH).

Reglas de agentes y standards: ver `AGENTS.md`.
