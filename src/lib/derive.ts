import type { Assignment, Patient, Psychologist } from "@/lib/schemas";

export function ageOn(birthDate: string, today: Date = new Date()): number {
  const [y, m, d] = birthDate.split("-").map(Number) as [number, number, number];
  const beforeBirthday = today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d);
  return today.getFullYear() - y - (beforeBirthday ? 1 : 0);
}

export type PatientStatus = "activo" | "en_espera" | "finalizado";

// Patient plus what the assignment history says about it.
export type PatientRecord = Patient & {
  history: Assignment[]; // oldest first
  current: Assignment | null;
  status: PatientStatus;
  startDate: string | null; // first assignment
  endDate: string | null; // set when discharged ("alta")
};

const byStart = (a: Assignment, b: Assignment): number => a.startDate.localeCompare(b.startDate);

export function toPatientRecord(patient: Patient, assignments: Assignment[]): PatientRecord {
  const history = assignments.filter((a) => a.patientId === patient.id).sort(byStart);
  const current = history.find((a) => !a.endDate) ?? null;
  const last = history.at(-1);
  const discharged = !current && last?.endReason === "alta";
  return {
    ...patient,
    history,
    current,
    status: current ? "activo" : discharged ? "finalizado" : "en_espera",
    startDate: history[0]?.startDate ?? null,
    endDate: discharged ? (last.endDate ?? null) : null,
  };
}

export const openAssignments = (psychologistId: string, assignments: Assignment[]): Assignment[] =>
  assignments.filter((a) => a.psychologistId === psychologistId && !a.endDate);

export type PsychologistLoad = {
  current: number;
  available: number;
  status: "disponible" | "completo" | "inactivo";
};

export function psychologistLoad(psych: Psychologist, assignments: Assignment[]): PsychologistLoad {
  const current = openAssignments(psych.id, assignments).length;
  const available = Math.max(psych.maxPatients - current, 0);
  const status = psych.status === "inactivo" ? "inactivo" : available === 0 ? "completo" : "disponible";
  return { current, available, status };
}
