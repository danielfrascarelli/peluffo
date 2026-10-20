# Project Agent Rules

Central standards apply first. See .standards/README.md for read order and precedence.

Project facts:

- Runtime: Node.js 22 (browser app, client-only SPA, React 18, built with Vite)
- Package manager: pnpm
- Test runner: Vitest
- Deployment target: static hosting (TBD)
- Database: none (mock data in src/app/mock-data.ts)

Git identity (see .standards/standards/GIT.md, "Authorship"):

- user.name: danielfrascarelli
- user.email: dsanfra@gmail.com
- gh account: danielfrascarelli # pull request author, not checked by git hooks

## Applicable standards

- `src/**`: NODE, REACT
- Root dependency and lock files: DEPENDENCIES
- CI and workflow files: CHECKS, GIT, DELIVERY
- Auth, secrets, external input, crypto, wherever they live: SECURITY

Checks (see .standards/standards/CHECKS.md):

- format: pnpm format:check
- lint: pnpm lint
- typecheck: pnpm typecheck
- test: pnpm test
- build: pnpm build
- security: pnpm security
  Runs: pnpm audit --audit-level=high && gitleaks detect --source . --redact

## Overrides

(none)
