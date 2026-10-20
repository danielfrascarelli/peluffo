import { z } from "zod";
import { getJson } from "@/lib/http";
import { patientSchema, type Patient } from "@/lib/schemas";

export const fetchPatients = (): Promise<Patient[]> => getJson("patients", z.array(patientSchema));
