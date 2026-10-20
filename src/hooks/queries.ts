import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAssignments } from "@/api/assignments";
import { fetchPatients } from "@/api/patients";
import { fetchPsychologists } from "@/api/psychologists";
import { toPatientRecord, type PatientRecord } from "@/lib/derive";
import type { Assignment } from "@/lib/schemas";

export const queryKeys = {
  patients: ["patients"] as const,
  psychologists: ["psychologists"] as const,
  assignments: ["assignments"] as const,
};

export const usePatients = () => useQuery({ queryKey: queryKeys.patients, queryFn: fetchPatients });

export const usePsychologists = () => useQuery({ queryKey: queryKeys.psychologists, queryFn: fetchPsychologists });

export const useAssignments = () => useQuery({ queryKey: queryKeys.assignments, queryFn: fetchAssignments });

// Patients joined with their assignment history. With a backend this could be one endpoint.
export function usePatientRecords(): { data: PatientRecord[]; isPending: boolean } {
  const patients = usePatients();
  const assignments = useAssignments();
  const data = patients.data && assignments.data ? patients.data.map((p) => toPatientRecord(p, assignments.data)) : [];
  return { data, isPending: patients.isPending || assignments.isPending };
}

const today = (): string => new Date().toISOString().slice(0, 10);

// ponytail: writes only update the query cache (no backend yet).
// Swap each body for a useMutation calling the REST endpoint, then invalidate the key.
export function useDataWriters() {
  const qc = useQueryClient();
  return {
    assign: (patientId: string, psychologistId: string): void => {
      qc.setQueryData<Assignment[]>(queryKeys.assignments, (prev = []) => [
        ...prev.map((a) =>
          a.patientId === patientId && !a.endDate ? { ...a, endDate: today(), endReason: "reasignacion" as const } : a,
        ),
        { id: `a_${Date.now()}`, patientId, psychologistId, startDate: today() },
      ]);
    },
    unassign: (patientId: string, endReason: Assignment["endReason"] = "reasignacion"): void => {
      qc.setQueryData<Assignment[]>(queryKeys.assignments, (prev) =>
        prev?.map((a) => (a.patientId === patientId && !a.endDate ? { ...a, endDate: today(), endReason } : a)),
      );
    },
  };
}
