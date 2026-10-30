// TEMPORARY (Checkpoint C1): Preview-only database identity check. Remove after C1 (step A4).
import "server-only"
import { Client } from "pg"
import { handleDbIdentityRequest, type DbSession } from "@/lib/db-identity"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const HEADERS = { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow" }

// A dedicated single-use client; the shared app pool in lib/db is deliberately not used.
async function connect(connectionString: string): Promise<DbSession> {
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
    query_timeout: 4000,
    application_name: "c1-db-identity-check",
  })
  try {
    await client.connect()
  } catch (error) {
    await client.end().catch(() => {})
    throw error
  }
  return {
    query: async (sql) => ({ rows: (await client.query(sql)).rows }),
    end: () => client.end(),
  }
}

function notFound() {
  return new Response("Not Found", { status: 404, headers: HEADERS })
}

export async function GET(request: Request) {
  const result = await handleDbIdentityRequest({
    env: process.env,
    now: Date.now(),
    authorization: request.headers.get("authorization"),
    connect,
  })
  if (result.status !== 200) return notFound()
  return Response.json(result.body, { status: 200, headers: HEADERS })
}

// Every other method answers 404 so the route's existence is not revealed.
export { notFound as POST, notFound as PUT, notFound as PATCH, notFound as DELETE, notFound as OPTIONS }
