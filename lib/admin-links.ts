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

export const FREE_ACCESS_ADMIN_PATH = "/admin/free-access"
const ADMIN_LINK_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000

const signAdmin = (key: string, expires: number) =>
  createHmac("sha256", key).update(`free-access-admin:${expires}`).digest("base64url")

/** A 7-day link to the free-access admin page, included only in AhmedPrep's own notification emails. */
export function createFreeAccessAdminLink(origin: string, query = "", now = Date.now()) {
  const key = secret()
  if (!key) return null
  const expires = now + ADMIN_LINK_LIFETIME_MS
  const params = new URLSearchParams({ exp: String(expires), sig: signAdmin(key, expires) })
  if (query) params.set("q", query)
  return `${origin}${FREE_ACCESS_ADMIN_PATH}?${params}`
}

export function verifyFreeAccessAdminToken(exp: unknown, sig: unknown, now = Date.now()) {
  const key = secret()
  if (!key || typeof exp !== "string" || typeof sig !== "string") return false
  const expires = Number(exp)
  if (!Number.isSafeInteger(expires) || expires < now) return false
  const expected = Buffer.from(signAdmin(key, expires))
  const given = Buffer.from(sig)
  return expected.length === given.length && timingSafeEqual(expected, given)
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
