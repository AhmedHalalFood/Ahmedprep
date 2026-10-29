import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

const LINK_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000
export const RESEND_PATH = "/admin/resend-confirmation"

function secret() {
  const value = process.env.ADMIN_ACTION_SECRET?.trim()
  return value && value.length >= 32 ? value : null
}

const sign = (key: string, id: number, expires: number) =>
  createHmac("sha256", key).update(`resend-confirmation:${id}:${expires}`).digest("base64url")

/** A link only AhmedPrep receives (in admin emails). Returns null when ADMIN_ACTION_SECRET is not configured. */
export function createResendLink(origin: string, id: number, now = Date.now()) {
  const key = secret()
  if (!key) return null
  const expires = now + LINK_LIFETIME_MS
  const params = new URLSearchParams({ id: String(id), exp: String(expires), sig: sign(key, id, expires) })
  return `${origin}${RESEND_PATH}?${params}`
}

/** Returns the registration id if the signature is valid and unexpired. */
export function verifyResendToken(id: unknown, exp: unknown, sig: unknown, now = Date.now()) {
  const key = secret()
  if (!key || typeof id !== "string" || typeof exp !== "string" || typeof sig !== "string") return null
  const registrationId = Number(id)
  const expires = Number(exp)
  if (!Number.isSafeInteger(registrationId) || registrationId <= 0 || !Number.isSafeInteger(expires) || expires < now) return null
  const expected = Buffer.from(sign(key, registrationId, expires))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  return registrationId
}
