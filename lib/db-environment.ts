import "server-only"
import { pool } from "@/lib/db"
import { EMAIL_PATTERN } from "@/lib/lead-delivery"

export const isProductionDeployment = () => process.env.VERCEL_ENV === "production"

/**
 * The preview-test Neon branch carries a one-row marker table that the live database never has. Anything outside a
 * production deployment refuses to write reminder data unless it can see that marker, so a preview that is still
 * pointed at the live database cannot change live records.
 */
export async function getDatabaseEnvironment(): Promise<"test" | "live"> {
  const { rows } = await pool.query<{ name: string | null }>(
    "SELECT CASE WHEN to_regclass('public.ahmedprep_environment') IS NULL THEN NULL ELSE (SELECT name FROM ahmedprep_environment LIMIT 1) END AS name",
  )
  return rows[0]?.name === "preview-test" ? "test" : "live"
}

export class UnsafeDatabaseError extends Error {
  constructor() {
    super("This non-production deployment is connected to the live database, so reminder data was not changed.")
  }
}

export async function assertWritableDatabase() {
  if (isProductionDeployment()) return
  if ((await getDatabaseEnvironment()) !== "test") throw new UnsafeDatabaseError()
}

export type DeliveryMode = { mode: "live" } | { mode: "test"; testRecipient: string | null }

/**
 * Real families are emailed only from the production deployment, and only once SUNDAY_REMINDERS_LIVE is "true".
 * Everything else sends to EMAIL_TEST_RECIPIENT, or sends nothing when that is not configured.
 */
export function reminderDeliveryMode(): DeliveryMode {
  if (isProductionDeployment() && process.env.SUNDAY_REMINDERS_LIVE?.trim() === "true") return { mode: "live" }
  const testRecipient = process.env.EMAIL_TEST_RECIPIENT?.trim() ?? ""
  return { mode: "test", testRecipient: EMAIL_PATTERN.test(testRecipient) ? testRecipient : null }
}
