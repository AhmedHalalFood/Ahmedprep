import "server-only"
import { and, eq, isNull, lt, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { sundayClassRegistrations } from "@/lib/db/schema"
import type { ConfirmationStatus } from "@/lib/lead-delivery"

type NewRegistration = Omit<
  typeof sundayClassRegistrations.$inferInsert,
    | "id"
  | "adminNotifiedAt"
  | "confirmationStatus"
  | "duplicateAttempts"
  | "confirmationResentAt"
  | "confirmationResendCount"
  | "createdAt"
  | "updatedAt"
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

export async function getRegistration(id: number) {
  const [row] = await db.select().from(sundayClassRegistrations).where(eq(sundayClassRegistrations.id, id)).limit(1)
  return row ?? null
}

/**
 * Atomically reserves one resend attempt. Returns the attempt number, or null if another resend ran in the last
 * two minutes (so a double click or a refreshed form never sends twice). Never inserts a registration.
 */
export async function claimResendAttempt(id: number) {
  const [row] = await db
    .update(sundayClassRegistrations)
    .set({
      confirmationResendCount: sql`${sundayClassRegistrations.confirmationResendCount} + 1`,
      confirmationResentAt: sql`now()`,
      updatedAt: sql`now()`,
    })
    .where(
      and(
        eq(sundayClassRegistrations.id, id),
        or(
          isNull(sundayClassRegistrations.confirmationResentAt),
          lt(sundayClassRegistrations.confirmationResentAt, sql`now() - interval '2 minutes'`),
        ),
      ),
    )
    .returning({ attempt: sundayClassRegistrations.confirmationResendCount })
  return row?.attempt ?? null
}

export async function setConfirmationStatus(id: number, confirmation: ConfirmationStatus) {
  await db
    .update(sundayClassRegistrations)
    .set({ confirmationStatus: confirmation, updatedAt: sql`now()` })
    .where(eq(sundayClassRegistrations.id, id))
}

export async function markRegistrationDelivered(id: number, confirmation: ConfirmationStatus) {
  await db
    .update(sundayClassRegistrations)
    .set({ adminNotifiedAt: sql`now()`, confirmationStatus: confirmation, updatedAt: sql`now()` })
    .where(eq(sundayClassRegistrations.id, id))
}
