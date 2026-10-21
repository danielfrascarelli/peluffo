# 0002 Assignment history as its own resource

Date: 2026-10-19 · Status: accepted

## Context

Patients stored `assignedPsychologistId`, `status`, `startDate`, `endDate`; psychologists stored `currentPatients` and `availableSlots`. The stored counts disagreed with the actual assignments (14 psychologists claimed 23 patients that did not exist), ages disagreed with birth dates, and a patient could not have more than one professional over time.

## Decision

- `assignments.json` holds one row per patient-psychologist period: `patientId`, `psychologistId`, `startDate`, optional `endDate` and `endReason` (`alta`, `reasignacion`, `baja_profesional`, `abandono`). A patient has at most one open row.
- `patients.json` holds only patient data; `psychologists.json` only psychologist data (`status` is `disponible` or `inactivo`).
- Derived in `src/lib/derive.ts`, never stored: patient status (open row: `activo`; last row ended with `alta`: `finalizado`; otherwise `en_espera`), current professional, first start date, discharge date, age from `birthDate`, psychologist load, free slots and `completo` status.

## Alternatives rejected

- Keeping the current psychologist on the patient: loses history and duplicates state.

## Consequences

- With a backend, `/assignments` is one more endpoint; `usePatientRecords()` joins patients and assignments client-side and could become one endpoint later.
