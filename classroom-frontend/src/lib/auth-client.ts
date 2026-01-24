import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "@/constants";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}auth`,
});

export type Session = typeof authClient.$Infer.Session;