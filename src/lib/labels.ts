import type { PatientStatus, PsychologistLoad } from "@/lib/derive";
import type { Assignment, UserRole } from "@/lib/schemas";
import type { Tone } from "@/lib/tones";

type StatusMap<K extends string> = Record<K, { label: string; tone: Tone }>;

export const PATIENT_STATUS: StatusMap<PatientStatus> = {
  activo: { label: "Activo", tone: "success" },
  en_espera: { label: "En espera", tone: "warning" },
  finalizado: { label: "Finalizado", tone: "neutral" },
};

export const PSYCH_STATUS: StatusMap<PsychologistLoad["status"]> = {
  disponible: { label: "Disponible", tone: "success" },
  completo: { label: "Completo", tone: "warning" },
  inactivo: { label: "Inactivo", tone: "neutral" },
};

export const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  ambas: "Presencial / Online",
};
export const HOW_LABEL: Record<string, string> = {
  redes_sociales: "Redes sociales",
  amigo_familiar: "Amigo o familiar",
  medico: "Médico / profesional",
  google: "Google / internet",
  radio: "Radio",
  evento: "Evento o charla",
  otro: "Otro",
};
export const FEE_LABEL: Record<string, string> = { si: "Sí", no: "No", decidire: "Lo decidirá después" };
export const MEDICATION_LABEL: Record<string, string> = { si: "Sí", no: "No", prefiero_no_decir: "Prefiere no decir" };

export const ROLE_LABEL: Record<UserRole, string> = {
  peluffo: "Equipo Peluffo",
  colibri: "Equipo Colibrí",
  fibras: "Equipo Fibras",
};
export const YES_NO_LABEL: Record<string, string> = { si: "Sí", no: "No" };
export const SEX_LABEL: Record<string, string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  otro: "Otro",
  prefiero_no_decir: "No indica",
};
export const REQUEST_FOR_LABEL: Record<string, string> = {
  para_mi: "Para sí",
  para_familiar: "Para un familiar",
  para_otra_persona: "Para otra persona",
};
export const END_REASON_LABEL: Record<NonNullable<Assignment["endReason"]>, string> = {
  alta: "Alta",
  reasignacion: "Reasignación",
  baja_profesional: "Baja del profesional",
  abandono: "Abandono",
};
