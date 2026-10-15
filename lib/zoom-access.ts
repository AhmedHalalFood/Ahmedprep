import "server-only"

import type { RsvpProgram } from "@/lib/free-class"

/**
 * Zoom access details for private confirmation emails. Kept in a server-only module so the lookup can never be
 * bundled into client code (lib/free-class is imported by client components).
 * The recurring meeting comes from SUNDAY_CLASS_ZOOM_URL. The older FREE_CLASS_ZOOM_URL* variables remain as fallbacks.
 */
export function getZoomAccess(program: RsvpProgram) {
  const suffix = program === "shsat" ? "SHSAT" : "DIGITAL_SAT"
  const pick = (key: string) => process.env[`${key}_${suffix}`]?.trim() || process.env[key]?.trim() || ""
  const url = process.env.SUNDAY_CLASS_ZOOM_URL?.trim() || pick("FREE_CLASS_ZOOM_URL")
  if (!url || !/^https:\/\//i.test(url)) return null
  return { url, meetingId: pick("FREE_CLASS_ZOOM_MEETING_ID"), passcode: pick("FREE_CLASS_ZOOM_PASSCODE") }
}
