# Project Agent Rules

Central standards apply first. See .standards/README.md for read order and precedence.

Project facts:

- Runtime: Node.js 24 (browser app, client-only SPA, React 18, built with Vite)
- Package manager: pnpm
- Test runner: Vitest
- Deployment target: static hosting (TBD)
- Backend: `../backend` (NestJS) serves all data and auth at `/api/v1`, same site. Session is httpOnly cookies; see docs/decisions/0005.
- Language: product copy in Spanish (rioplatense voseo, gender-neutral wording, sentence case). Code, comments, docs and commits in English.
- Local Node: run `nvm use` (reads `.nvmrc`) before any pnpm command.

Product rules (decided with the owner; change only with a new decision record):

- Roles that log in: `peluffo`, `colibri`, `fibras`. Patients and psychologists never log in. No candidates, no registration, no sessions/agendas.
- Sections: Pacientes (peluffo, fibras), Psicólogos (fibras), Asignación (colibri), Estadísticas (peluffo, fibras), Mi perfil (everyone, from the account menu).
- Patients are shown only by initials everywhere in the UI. Psychologists are shown as "Apellido, Nombre", never with titles (Dr., Lic.). See docs/decisions/0003.
- Psychologists are read-only in the UI; they are added by editing `data/psychologists.json` in the backend.
- Patient-psychologist links live only in the backend's `data/assignments.json` as history. Patient status, current professional, treatment dates, psychologist load/slots and age are derived, never stored. See docs/decisions/0002.
- UI: one layout for all roles (sidebar + header account menu on desktop, top bar + bottom tabs on phones). Phones never get horizontally scrolling tables: use `ListItem` rows. Colors only from `src/styles/theme.css` tokens. No ALL-CAPS labels.

Toolchain pins with a reason (see docs/decisions/0004):

- TypeScript 6.x: typescript-eslint does not support TS 7 yet.
- Vitest 3.x: Vitest 4+ requires Vite 7; the app is on Vite 6.
- `pnpm.overrides.tinypool` 2.1.2: patches a critical advisory in Vitest 3's transitive dependency. Remove when Vitest is upgraded.

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
