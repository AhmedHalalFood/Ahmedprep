import { connection } from "next/server"
import { isIntensivePromoActive } from "@/lib/shsat-intensive"

/**
 * Request-time check for the 2026 Intensive promotion. `connection()` opts the caller out of
 * static/ISR caching so a page rendered before the cutoff is never served after it.
 */
export async function intensivePromoActive() {
  await connection()
  return isIntensivePromoActive()
}
