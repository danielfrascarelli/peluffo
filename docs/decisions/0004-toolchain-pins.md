# 0004 Toolchain version pins

Date: 2026-10-19 · Status: accepted

## Context

Latest majors of several dev tools do not work together yet.

## Decision

- Node 22 (`.nvmrc`, `engines.node`, CI). Node 20 is end of life. Superseded by [0006](0006-node-24.md).
- TypeScript 6.0.x: typescript-eslint 8 refuses TS 7.
- Vite 6.4.x and Vitest 3.2.x: Vitest 4+ requires Vite 7.
- `pnpm.overrides.tinypool = 2.1.2`: fixes a critical advisory in a transitive dependency of Vitest 3.
- All dependencies pinned to exact versions.

## Consequences

- Revisit when typescript-eslint supports TS 7 and when upgrading to Vite 7 (then drop the tinypool override).
