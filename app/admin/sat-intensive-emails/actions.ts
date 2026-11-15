"use server"

import { revalidatePath } from "next/cache"
import { verifySatIntensiveEmailsToken, SAT_INTENSIVE_EMAILS_PATH } from "@/lib/admin-links"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { EMAIL_KINDS, requeueEmailForAdmin, type EmailKind } from "@/lib/sat-final-intensive-email-outbox"
import { drainOutboxAfterResponse } from "@/lib/sat-final-intensive-outbox-runner"

export type IntensiveResendState = { status: "idle" | "queued" | "error"; message: string }

const REASONS = {
  not_found: "No email job was found for this enrollment.",
  not_confirmed: "This enrollment is not confirmed, so there is nothing to resend.",
  in_progress: "This email is already queued or sending. Refresh in a minute to see the result.",
  cooldown: "This email was resent less than two minutes ago. Please wait before resending again.",
} as const

export async function resendIntensiveEmail(_prev: IntensiveResendState, form: FormData): Promise<IntensiveResendState> {
  if (!internalPreviewAllowed()) return { status: "error", message: "Not available." }
  const publicId = verifySatIntensiveEmailsToken(form.get("id"), form.get("exp"), form.get("sig"))
  if (!publicId) return { status: "error", message: "This link is invalid or has expired." }
  const kind = form.get("kind")
  if (typeof kind !== "string" || !EMAIL_KINDS.includes(kind as EmailKind)) return { status: "error", message: "Unknown email." }

  try {
    const result = await requeueEmailForAdmin(pool, publicId, kind as EmailKind)
    if (!result.ok) return { status: "error", message: REASONS[result.reason] }
    drainOutboxAfterResponse()
    revalidatePath(SAT_INTENSIVE_EMAILS_PATH)
    return { status: "queued", message: "Queued. It will be delivered within a few seconds; refresh to see the result." }
  } catch (error) {
    console.error("[sat-intensive] admin resend failed:", error instanceof Error ? error.message : error)
    return { status: "error", message: "The database is unavailable right now. Please try again shortly." }
  }
}
