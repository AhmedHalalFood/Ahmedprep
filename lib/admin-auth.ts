import "server-only"
import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { pool } from "@/lib/db"

const COOKIE = "ahmedprep_admin"
const SESSION_HOURS = 8
const MAX_FAILURES = 5
const LOCKOUT_MINUTES = 15

const sha256 = (value: string) => createHash("sha256").update(value).digest()

function config() {
  const password = process.env.ADMIN_PASSWORD ?? ""
  const secret = process.env.ADMIN_SESSION_SECRET ?? ""
  return password.length >= 12 && secret.length >= 32 ? { password, secret } : null
}

export const isAdminConfigured = () => config() !== null

/** The password's hash is part of the signature, so changing ADMIN_PASSWORD signs every existing session out. */
function sign(expires: number, cfg: { password: string; secret: string }) {
  return createHmac("sha256", cfg.secret).update(`admin-session:${expires}:${sha256(cfg.password).toString("hex")}`).digest("hex")
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export async function isAdminSession() {
  const cfg = config()
  const value = (await cookies()).get(COOKIE)?.value
  if (!cfg || !value) return false
  const [expiresRaw, signature] = value.split(".")
  const expires = Number(expiresRaw)
  return Number.isFinite(expires) && expires > Date.now() && Boolean(signature) && safeEqual(signature, sign(expires, cfg))
}

export async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/login")
}

async function clientKey() {
  const h = await headers()
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
  return sha256(`admin-login:${ip}`).toString("hex")
}

export type LoginResult = { ok: true } | { ok: false; error: string }

export async function attemptAdminLogin(password: string): Promise<LoginResult> {
  const cfg = config()
  if (!cfg) return { ok: false, error: "The admin dashboard is not configured yet." }

  const key = await clientKey()
  const { rows } = await pool.query<{ locked: boolean }>(
    "SELECT locked_until IS NOT NULL AND locked_until > now() AS locked FROM admin_login_attempts WHERE client_key = $1",
    [key],
  )
  if (rows[0]?.locked) return { ok: false, error: `Too many attempts. Please wait ${LOCKOUT_MINUTES} minutes and try again.` }

  // Comparing fixed-length hashes keeps the check constant-time regardless of what was typed.
  const matches = timingSafeEqual(sha256(password), sha256(cfg.password))
  if (!matches) {
    await pool.query(
      `INSERT INTO admin_login_attempts AS a (client_key, failures, updated_at) VALUES ($1, 1, now())
       ON CONFLICT (client_key) DO UPDATE SET
         failures = CASE WHEN a.locked_until IS NOT NULL AND a.locked_until <= now() THEN 1 ELSE a.failures + 1 END,
         locked_until = CASE WHEN (CASE WHEN a.locked_until IS NOT NULL AND a.locked_until <= now() THEN 1 ELSE a.failures + 1 END) >= ${MAX_FAILURES}
                             THEN now() + interval '${LOCKOUT_MINUTES} minutes' ELSE NULL END,
         updated_at = now()`,
      [key],
    )
    return { ok: false, error: "Incorrect password." }
  }

  await pool.query("DELETE FROM admin_login_attempts WHERE client_key = $1", [key])
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  ;(await cookies()).set(COOKIE, `${expires}.${sign(expires, cfg)}`, {
    httpOnly: true,
    secure: true,
    // The v0 preview runs inside a cross-site iframe; the live site uses the strict setting.
    sameSite: process.env.VERCEL_ENV === "production" ? "strict" : "none",
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  })
  return { ok: true }
}

export async function endAdminSession() {
  ;(await cookies()).delete({ name: COOKIE, path: "/admin" })
}
