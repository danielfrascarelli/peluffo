# 0003 Patient initials only; psychologist naming

Date: 2026-10-19 · Status: accepted

## Context

The app handles mental-health patients. Staff roles need to coordinate care without exposing patient identities on screen.

## Decision

- Patients are displayed only by initials (`initials()` in `src/lib/names.ts`) in every list, detail, chip and toast, for every role. Patient search matches initials or cédula.
- Psychologists are displayed as "Apellido, Nombre" (`lastFirst()`), with no professional titles in the data.
- People are stored with `firstName` and `lastName`, never a single `name` field.

## Consequences

- Open question: the patient detail still shows email, phone, address and cédula, which identify the patient. Decide whether to hide them or restrict them by role.
- `src/App.test.tsx` asserts that full patient names never render.
