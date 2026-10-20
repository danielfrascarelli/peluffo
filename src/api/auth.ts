import { z } from "zod";
import { getJson } from "@/lib/http";
import { userSchema, type User } from "@/lib/schemas";

const mockUserSchema = userSchema.extend({ password: z.string() });

// ponytail: mock login compares against public/api/users.json in the browser.
// Replace with POST /auth/login on the backend; passwords must never ship to the client.
export async function login(username: string, password: string): Promise<User | null> {
  const users = await getJson("users", z.array(mockUserSchema));
  const match = users.find((u) => u.username === username && u.password === password);
  // userSchema strips unknown keys, so the password never leaves this function.
  return match ? userSchema.parse(match) : null;
}
