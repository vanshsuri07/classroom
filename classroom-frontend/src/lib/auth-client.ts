import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "@/constants";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}auth`,
credentials: "include", // Important: Include credentials (cookies)
});

export type Session = typeof authClient.$Infer.Session;