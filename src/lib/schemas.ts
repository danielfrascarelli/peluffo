import { z } from "zod";

const isoDate = z.iso.date();
const yesNo = z.enum(["si", "no"]);
export const modalitySchema = z.enum(["presencial", "online", "ambas"]);

export const userRoleSchema = z.enum(["peluffo", "colibri", "fibras"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: userRoleSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  avatarUrl: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;

export const patientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: isoDate,
  sex: z.enum(["masculino", "femenino", "otro", "prefiero_no_decir"]).optional(),
  cedula: z.string().optional(),
  email: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  diagnosis: z.string().optional(),
  requestFor: z.enum(["para_mi", "para_familiar", "para_otra_persona"]).optional(),
  requestDate: isoDate,
  preferredSchedule: z.string(),
  modality: modalitySchema,
  insurancePlan: z.string().optional(),
  notes: z.string().optional(),
  motive: z.string().optional(),
  previousTreatment: yesNo.optional(),
  currentMedication: z.enum(["si", "no", "prefiero_no_decir"]).optional(),
  urgencySituation: yesNo.optional(),
  continueWithFee: z.enum(["si", "no", "decidire"]).optional(),
  howDidYouHear: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
});
export type Patient = z.infer<typeof patientSchema>;

export const psychologistSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  specialties: z.array(z.string()),
  maxPatients: z.number().int().nonnegative(),
  modality: modalitySchema,
  schedule: z.string(),
  yearsExperience: z.number().int().nonnegative(),
  languages: z.array(z.string()),
  // "completo" is derived from load, never stored. See lib/derive.ts.
  status: z.enum(["disponible", "inactivo"]),
  rating: z.number(),
  bio: z.string(),
});
export type Psychologist = z.infer<typeof psychologistSchema>;

export const endReasonSchema = z.enum(["alta", "reasignacion", "baja_profesional", "abandono"]);

// One row per patient-psychologist period. A patient has at most one open row (no endDate).
export const assignmentSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  psychologistId: z.string(),
  startDate: isoDate,
  endDate: isoDate.optional(),
  endReason: endReasonSchema.optional(),
});
export type Assignment = z.infer<typeof assignmentSchema>;
