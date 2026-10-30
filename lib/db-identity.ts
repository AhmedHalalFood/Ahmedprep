// TEMPORARY (Checkpoint C1): Preview-only database identity check. Remove after C1 (step A4).
// Pure logic so every guard can be tested without a real database or the Next.js runtime.
import { createHash, timingSafeEqual } from "node:crypto"

export const DB_IDENTITY_BRANCH = "v0/january-2027-enrollment"
export const PREVIEW_TEST_ENDPOINT = "ep-quiet-breeze-b8qi4eg2"
export const PRODUCTION_ENDPOINT = "ep-crimson-snow-b8ledljt"
export const EXPECTED_MARKER = "preview-test"
// Hard stop: after this moment the endpoint answers 404 even if removal (A4) is forgotten.
export const DB_IDENTITY_EXPIRES_AT = Date.parse("2026-11-02T18:00:00Z")

export type Marker = "preview-test" | "absent" | "other" | "error" | "not_checked"
export type Verdict = "PASS" | "FAIL_PRODUCTION_DATABASE" | "FAIL"

export interface DbIdentityBody {
  endpointId: string
  marker: Marker
  verdict: Verdict
}

export interface DbSession {
  query(sql: string): Promise<{ rows: Record<string, unknown>[] }>
  end(): Promise<void>
}

export interface DbIdentityDeps {
  env: Record<string, string | undefined>
  now: number
  authorization: string | null
  connect: (connectionString: string) => Promise<DbSession>
}

export type DbIdentityResult = { status: 404; body: null } | { status: 200; body: DbIdentityBody }

export const READ_ONLY_STATEMENTS = [
  "BEGIN TRANSACTION READ ONLY",
  "SET LOCAL statement_timeout = 3000",
  "SELECT to_regclass('public.ahmedprep_environment') IS NOT NULL AS present",
  "SELECT name FROM public.ahmedprep_environment LIMIT 1",
  "ROLLBACK",
] as const

const NOT_FOUND: DbIdentityResult = { status: 404, body: null }

// Uses only Vercel-provided deployment metadata; request headers never decide the environment or branch.
export function isDeploymentAllowed(env: Record<string, string | undefined>, now: number): boolean {
  if (env.VERCEL !== "1") return false
  if (env.VERCEL_ENV !== "preview") return false
  if (env.VERCEL_TARGET_ENV !== undefined && env.VERCEL_TARGET_ENV !== "preview") return false
  if (env.VERCEL_GIT_COMMIT_REF !== DB_IDENTITY_BRANCH) return false
  if (!Number.isFinite(now) || now >= DB_IDENTITY_EXPIRES_AT) return false
  return true
}

export function isAuthorized(env: Record<string, string | undefined>, authorization: string | null): boolean {
  const fingerprint = env.DB_IDENTITY_TOKEN_SHA256
  if (!fingerprint || !/^[0-9a-f]{64}$/.test(fingerprint)) return false
  const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(authorization ?? "")
  if (!match) return false
  const presented = createHash("sha256").update(match[1]).digest()
  const expected = Buffer.from(fingerprint, "hex")
  return presented.length === expected.length && timingSafeEqual(presented, expected)
}

// Returns only the non-secret Neon endpoint id ("ep-..."), never the address, user, password, region or database.
export function extractEndpointId(connectionString: string | undefined): string {
  if (!connectionString) return "missing"
  try {
    const url = new URL(connectionString)
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") return "unrecognized"
    const host = url.hostname.toLowerCase()
    if (!host.endsWith(".neon.tech")) return "unrecognized"
    const endpoint = host.split(".")[0].replace(/-pooler$/, "")
    return /^ep-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(endpoint) ? endpoint : "unrecognized"
  } catch {
    return "unrecognized"
  }
}

async function readMarker(session: DbSession): Promise<Marker> {
  const [begin, timeout, exists, select, rollback] = READ_ONLY_STATEMENTS
  await session.query(begin)
  await session.query(timeout)
  const presence = await session.query(exists)
  let marker: Marker = "absent"
  if (presence.rows[0]?.present === true) {
    const result = await session.query(select)
    if (result.rows.length > 0) marker = result.rows[0]?.name === EXPECTED_MARKER ? "preview-test" : "other"
  }
  await session.query(rollback)
  return marker
}

export async function handleDbIdentityRequest(deps: DbIdentityDeps): Promise<DbIdentityResult> {
  try {
    if (!isDeploymentAllowed(deps.env, deps.now)) return NOT_FOUND
    if (!isAuthorized(deps.env, deps.authorization)) return NOT_FOUND
  } catch {
    return NOT_FOUND
  }

  const endpointId = extractEndpointId(deps.env.DATABASE_URL)
  if (endpointId !== PREVIEW_TEST_ENDPOINT) {
    return {
      status: 200,
      body: {
        endpointId,
        marker: "not_checked",
        verdict: endpointId === PRODUCTION_ENDPOINT ? "FAIL_PRODUCTION_DATABASE" : "FAIL",
      },
    }
  }

  let marker: Marker = "error"
  let session: DbSession | undefined
  try {
    session = await deps.connect(deps.env.DATABASE_URL as string)
    marker = await readMarker(session)
  } catch {
    marker = "error"
  } finally {
    if (session) await session.end().catch(() => {})
  }

  return { status: 200, body: { endpointId, marker, verdict: marker === "preview-test" ? "PASS" : "FAIL" } }
}
