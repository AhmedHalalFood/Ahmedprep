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

export const LEAD_RESEND_PATH = "/admin/resend-enrollment-confirmation"
// A different signing purpose, so a Sunday-class link can never be replayed against an enrollment row or vice versa.
const signLead = (key: string, id: number, expires: number) =>
  createHmac("sha256", key).update(`resend-lead-confirmation:${id}:${expires}`).digest("base64url")

/** Admin-only link to resend a 2027 enrollment inquiry confirmation. Null when ADMIN_ACTION_SECRET is not set. */
export function createLeadResendLink(origin: string, id: number, now = Date.now()) {
  const key = secret()
  if (!key) return null
  const expires = now + LINK_LIFETIME_MS
  const params = new URLSearchParams({ id: String(id), exp: String(expires), sig: signLead(key, id, expires) })
  return `${origin}${LEAD_RESEND_PATH}?${params}`
}

export function verifyLeadResendToken(id: unknown, exp: unknown, sig: unknown, now = Date.now()) {
  return verifyWith(signLead, id, exp, sig, now)
}

/** Returns the registration id if the signature is valid and unexpired. */
export function verifyResendToken(id: unknown, exp: unknown, sig: unknown, now = Date.now()) {
  return verifyWith(sign, id, exp, sig, now)
}

function verifyWith(
  signer: (key: string, id: number, expires: number) => string,
  id: unknown,
  exp: unknown,
  sig: unknown,
  now: number,
) {
  const key = secret()
  if (!key || typeof id !== "string" || typeof exp !== "string" || typeof sig !== "string") return null
  const registrationId = Number(id)
  const expires = Number(exp)
  if (!Number.isSafeInteger(registrationId) || registrationId <= 0 || !Number.isSafeInteger(expires) || expires < now) return null
  const expected = Buffer.from(signer(key, registrationId, expires))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  return registrationId
}
