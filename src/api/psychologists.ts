import { z } from "zod";
import { getJson } from "@/lib/http";
import { psychologistSchema, type Psychologist } from "@/lib/schemas";

export const fetchPsychologists = (): Promise<Psychologist[]> => getJson("psychologists", z.array(psychologistSchema));
