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

/**
 * Owner-approved early removal of the 2026 Intensive promotion from shared headers, the homepage
 * and 2027 program pages. The Intensive page, its direct URL, enrollment API and records still
 * follow `intensivePromoActive()` above.
 */
export const INTENSIVE_SITEWIDE_PROMOTION_ENABLED = false

export async function intensiveSitewidePromoActive() {
  return INTENSIVE_SITEWIDE_PROMOTION_ENABLED && (await intensivePromoActive())
}
