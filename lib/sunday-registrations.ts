import "server-only"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { sundayClassRegistrations } from "@/lib/db/schema"
import type { ConfirmationStatus } from "@/lib/lead-delivery"

type NewRegistration = Omit<
  typeof sundayClassRegistrations.$inferInsert,
  "id" | "adminNotifiedAt" | "confirmationStatus" | "duplicateAttempts" | "createdAt" | "updatedAt"
>

export type RegistrationClaim =
  | { kind: "new" | "retry"; id: number }
  | { kind: "duplicate"; confirmation: ConfirmationStatus }

/**
 * Records the RSVP, or finds the one already stored for the same parent, student, class date, and program.
 * A repeat never overwrites the original row; it only bumps duplicate_attempts.
 */
export async function claimRegistration(registration: NewRegistration): Promise<RegistrationClaim> {
  const [row] = await db
    .insert(sundayClassRegistrations)
    .values(registration)
    .onConflictDoUpdate({
      target: sundayClassRegistrations.dedupeKey,
      set: {
        duplicateAttempts: sql`${sundayClassRegistrations.duplicateAttempts} + 1`,
        updatedAt: sql`now()`,
      },
    })
    .returning({
      id: sundayClassRegistrations.id,
      adminNotifiedAt: sundayClassRegistrations.adminNotifiedAt,
      confirmationStatus: sundayClassRegistrations.confirmationStatus,
      inserted: sql<boolean>`(xmax = 0)`,
    })

  if (row.inserted) return { kind: "new", id: row.id }
  // A previous attempt was stored but AhmedPrep was never notified, so let this one deliver it.
  if (!row.adminNotifiedAt) return { kind: "retry", id: row.id }
  return {
    kind: "duplicate",
    confirmation: row.confirmationStatus === "sent" || row.confirmationStatus === "failed" ? row.confirmationStatus : "not_requested",
  }
}

export async function markRegistrationDelivered(id: number, confirmation: ConfirmationStatus) {
  await db
    .update(sundayClassRegistrations)
    .set({ adminNotifiedAt: sql`now()`, confirmationStatus: confirmation, updatedAt: sql`now()` })
    .where(eq(sundayClassRegistrations.id, id))
}
