import { z } from "zod";
import { getJson } from "@/lib/http";
import { assignmentSchema, type Assignment } from "@/lib/schemas";

export const fetchAssignments = (): Promise<Assignment[]> => getJson("assignments", z.array(assignmentSchema));
