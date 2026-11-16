import "server-only"

import { after } from "next/server"
import { pool } from "@/lib/db"
import { processEmailOutbox } from "@/lib/sat-final-intensive-email-outbox"

// No administrator console link is set: the console is blocked until real administrator authentication exists.

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
