import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Determine SSL setting:
// - If DATABASE_URL contains sslmode=require, keep TLS.
// - Else respect DATABASE_SSL env (require|prefer|false).
// - Default to false for local Docker Postgres.
const urlHasRequire = /sslmode=require/i.test(process.env.DATABASE_URL);
const sslEnv = (process.env.DATABASE_SSL || "").toLowerCase();
const sslOption: "require" | "prefer" | false = urlHasRequire
  ? "require"
  : sslEnv === "require"
  ? "require"
  : sslEnv === "prefer"
  ? "prefer"
  : false;

const sql = postgres(process.env.DATABASE_URL, { ssl: sslOption });
export const db = drizzle(sql);