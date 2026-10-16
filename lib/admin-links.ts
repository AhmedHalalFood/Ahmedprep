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

const PARENT_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000

// A different prefix from the admin link, so neither kind of signature can be used as the other.
const signParent = (key: string, id: number, expires: number) =>
  createHmac("sha256", key).update(`parent-resend:${id}:${expires}`).digest("base64url")

/**
 * Handed only to the browser that just submitted the matching registration details, so it can ask for the confirmation
 * again. It can only trigger a send to the email already stored on the registration and reveals nothing itself.
 */
export function createParentResendToken(id: number, now = Date.now()) {
  const key = secret()
  if (!key) return null
  const expires = now + PARENT_TOKEN_LIFETIME_MS
  return `${id}.${expires}.${signParent(key, id, expires)}`
}

/** Returns the registration id for a valid, unexpired parent token, otherwise null. */
export function verifyParentResendToken(token: unknown, now = Date.now()) {
  const key = secret()
  if (!key || typeof token !== "string" || token.length > 200) return null
  const [rawId, rawExp, sig, ...rest] = token.split(".")
  if (rest.length || !rawId || !rawExp || !sig) return null
  const registrationId = Number(rawId)
  const expires = Number(rawExp)
  if (!Number.isSafeInteger(registrationId) || registrationId <= 0 || !Number.isSafeInteger(expires) || expires < now) return null
  const expected = Buffer.from(signParent(key, registrationId, expires))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  return registrationId
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
