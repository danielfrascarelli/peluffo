import { ageOn, psychologistLoad, toPatientRecord } from "@/lib/derive";
import type { Assignment, Patient, Psychologist } from "@/lib/schemas";

const patient = { id: "p1" } as Patient;
const period = (psychologistId: string, startDate: string, end?: Pick<Assignment, "endDate" | "endReason">) =>
  ({ id: `${psychologistId}-${startDate}`, patientId: "p1", psychologistId, startDate, ...end }) as Assignment;

describe("ageOn", () => {
  it("counts a birthday not yet reached this year", () => {
    expect(ageOn("1990-11-01", new Date(2026, 9, 19))).toBe(35);
    expect(ageOn("1990-10-19", new Date(2026, 9, 19))).toBe(36);
  });
});

describe("toPatientRecord", () => {
  it("is waiting when never assigned", () => {
    expect(toPatientRecord(patient, []).status).toBe("en_espera");
  });

  it("is active with the open assignment as current, keeping the history ordered", () => {
    const record = toPatientRecord(patient, [
      period("ps1", "2026-08-01"),
      period("ps6", "2026-05-10", { endDate: "2026-07-31", endReason: "reasignacion" }),
    ]);
    expect(record.status).toBe("activo");
    expect(record.current?.psychologistId).toBe("ps1");
    expect(record.startDate).toBe("2026-05-10");
    expect(record.history.map((a) => a.psychologistId)).toEqual(["ps6", "ps1"]);
  });

  it("is finished only when the last assignment ended with a discharge", () => {
    const discharged = toPatientRecord(patient, [
      period("ps4", "2026-05-05", { endDate: "2026-10-02", endReason: "alta" }),
    ]);
    expect(discharged.status).toBe("finalizado");
    expect(discharged.endDate).toBe("2026-10-02");

    const dropped = toPatientRecord(patient, [
      period("ps7", "2026-04-05", { endDate: "2026-06-30", endReason: "baja_profesional" }),
    ]);
    expect(dropped.status).toBe("en_espera");
  });
});

describe("psychologistLoad", () => {
  const psych = { id: "ps1", maxPatients: 2, status: "disponible" } as Psychologist;

  it("counts only open assignments and marks full psychologists as completo", () => {
    const closed = period("ps1", "2026-01-01", { endDate: "2026-02-01", endReason: "alta" });
    expect(psychologistLoad(psych, [period("ps1", "2026-08-01"), closed])).toEqual({
      current: 1,
      available: 1,
      status: "disponible",
    });
    expect(psychologistLoad(psych, [period("ps1", "2026-08-01"), period("ps1", "2026-09-01")]).status).toBe("completo");
  });
});
