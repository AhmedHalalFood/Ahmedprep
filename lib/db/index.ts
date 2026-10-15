import "server-only"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Short timeouts so an unreachable database fails fast and the RSVP can fall back instead of hanging the request.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  query_timeout: 8000,
  max: 5,
})
export const db = drizzle(pool, { schema })
