import "server-only"

import { after } from "next/server"
import { createSatIntensiveEmailsLink } from "@/lib/admin-links"
import { pool } from "@/lib/db"
import { SITE_URL } from "@/lib/business"
import { processEmailOutbox, setOutboxAdminLinkFactory } from "@/lib/sat-final-intensive-email-outbox"

function adminOrigin() {
  if (process.env.VERCEL_ENV === "production") return SITE_URL
  const host = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL
  return host ? `https://${host}` : "http://localhost:3000"
}

setOutboxAdminLinkFactory((publicId) => createSatIntensiveEmailsLink(adminOrigin(), publicId))

/**
 * Drains the outbox after the response is sent, so a slow or rate-limited Resend never delays the family's
 * confirmation screen. Anything not delivered stays in the table and is picked up by the next run.
 */
export function drainOutboxAfterResponse() {
  after(async () => {
    try {
      await processEmailOutbox(pool, { deadlineMs: 20_000 })
    } catch (error) {
      console.error("[sat-intensive] outbox run failed:", error instanceof Error ? error.message : error)
    }
  })
}
