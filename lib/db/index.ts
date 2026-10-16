import "server-only"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { resolveAppDatabase } from "./connection-config.mjs"
import * as schema from "./schema"

let instance: NodePgDatabase<typeof schema> | null = null

/**
 * Created on first use rather than at import, so a missing or invalid DATABASE_URL throws inside the request's
 * try/catch (and the RSVP falls back to the admin email) instead of crashing the route module.
 */
export function getDb() {
  if (!instance) {
    const target = resolveAppDatabase(process.env)
    // Short timeouts so an unreachable database fails fast and the RSVP can fall back instead of hanging the request.
    const pool = new Pool({
      connectionString: target.connectionString,
      connectionTimeoutMillis: 5000,
      query_timeout: 8000,
      max: 5,
    })
    instance = drizzle(pool, { schema })
  }
  return instance
}
