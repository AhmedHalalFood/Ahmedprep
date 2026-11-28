import "server-only"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// pg 8 already treats these modes as verify-full but warns that pg 9 will weaken them,
// so pin the strict mode explicitly to keep certificate and hostname verification.
const LEGACY_VERIFY_FULL_SSL_MODES = new Set(["prefer", "require", "verify-ca"])

export function withVerifyFullSslMode(connectionString: string | undefined) {
  if (!connectionString) return connectionString
  let url: URL
  try {
    url = new URL(connectionString)
  } catch {
    return connectionString
  }
  const sslMode = url.searchParams.get("sslmode")
  if (sslMode === null || !LEGACY_VERIFY_FULL_SSL_MODES.has(sslMode)) return connectionString
  url.searchParams.set("sslmode", "verify-full")
  return url.toString()
}

// Short timeouts so an unreachable database fails fast and the RSVP can fall back instead of hanging the request.
export const pool = new Pool({
  connectionString: withVerifyFullSslMode(process.env.DATABASE_URL),
  connectionTimeoutMillis: 5000,
  query_timeout: 8000,
  max: 5,
})
export const db = drizzle(pool, { schema })
