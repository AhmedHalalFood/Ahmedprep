// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { createHash, randomBytes } from "node:crypto"
import { readFileSync } from "node:fs"
import {
  DB_IDENTITY_BRANCH,
  DB_IDENTITY_EXPIRES_AT,
  READ_ONLY_STATEMENTS,
  extractEndpointId,
  handleDbIdentityRequest,
} from "../lib/db-identity.ts"

const FAKE_PASSWORD = "Fake-Pw-9x7Qz"
const previewUrl = (suffix = "-pooler") =>
  `postgresql://fakeuser:${FAKE_PASSWORD}@ep-quiet-breeze-b8qi4eg2${suffix}.eastus2.azure.neon.tech/neondb?sslmode=require`
const productionUrl = `postgresql://fakeuser:${FAKE_PASSWORD}@ep-crimson-snow-b8ledljt-pooler.eastus2.azure.neon.tech/neondb?sslmode=require`

const token = randomBytes(32).toString("base64url")
const fingerprint = createHash("sha256").update(token).digest("hex")
const NOW = DB_IDENTITY_EXPIRES_AT - 60_000

function baseEnv(overrides = {}) {
  return {
    VERCEL: "1",
    VERCEL_ENV: "preview",
    VERCEL_TARGET_ENV: "preview",
    VERCEL_GIT_COMMIT_REF: DB_IDENTITY_BRANCH,
    DB_IDENTITY_TOKEN_SHA256: fingerprint,
    DATABASE_URL: previewUrl(),
    ...overrides,
  }
}

function fakeDb({ present = true, rows = [{ name: "preview-test" }], failOn, connectError } = {}) {
  const statements = []
  let ended = 0
  let connects = 0
  const connect = async () => {
    connects++
    if (connectError) throw connectError
    return {
      async query(sql) {
        statements.push(sql)
        if (failOn && sql.startsWith(failOn)) throw new Error(`boom ${FAKE_PASSWORD} host ep-quiet-breeze-b8qi4eg2.eastus2`)
        if (sql.startsWith("SELECT to_regclass")) return { rows: [{ present }] }
        if (sql.startsWith("SELECT name")) return { rows }
        return { rows: [] }
      },
      async end() {
        ended++
      },
    }
  }
  return { connect, statements, get ended() { return ended }, get connects() { return connects } }
}

function run(db, { env = baseEnv(), authorization = `Bearer ${token}`, now = NOW } = {}) {
  return handleDbIdentityRequest({ env, now, authorization, connect: db.connect })
}

async function assertHidden(options) {
  const db = fakeDb()
  const result = await run(db, options)
  assert.deepEqual(result, { status: 404, body: null })
  assert.equal(db.connects, 0, "database must not be contacted")
}

test("PASS only for the preview-test endpoint with the preview-test marker", async () => {
  const db = fakeDb()
  const result = await run(db)
  assert.deepEqual(result, {
    status: 200,
    body: { endpointId: "ep-quiet-breeze-b8qi4eg2", marker: "preview-test", verdict: "PASS" },
  })
  assert.equal(db.ended, 1)
})

test("unauthorized requests return 404 without touching the database", async () => {
  const wrong = randomBytes(32).toString("base64url")
  for (const authorization of [
    null,
    "",
    `Bearer ${wrong}`,
    `Bearer ${token}x`,
    `Bearer ${token.slice(0, 20)}`,
    `bearer ${token}`,
    `Basic ${token}`,
    token,
    `Bearer  ${token}`,
  ]) {
    await assertHidden({ authorization })
  }
})

test("missing or malformed fingerprint setting returns 404", async () => {
  for (const DB_IDENTITY_TOKEN_SHA256 of [undefined, "", "abc", fingerprint.toUpperCase(), fingerprint + "0", token]) {
    await assertHidden({ env: baseEnv({ DB_IDENTITY_TOKEN_SHA256 }) })
  }
})

test("Production, Development and unknown environments return 404", async () => {
  for (const VERCEL_ENV of ["production", "development", "", undefined, "Preview"]) {
    await assertHidden({ env: baseEnv({ VERCEL_ENV }) })
  }
  await assertHidden({ env: baseEnv({ VERCEL_TARGET_ENV: "production" }) })
  await assertHidden({ env: baseEnv({ VERCEL: undefined }) })
})

test("wrong or missing Git branch returns 404", async () => {
  for (const VERCEL_GIT_COMMIT_REF of ["main", "v0/fix-duplicate-rsvp-feedback", "", undefined, `${DB_IDENTITY_BRANCH}-x`]) {
    await assertHidden({ env: baseEnv({ VERCEL_GIT_COMMIT_REF }) })
  }
})

test("expired or invalid clock returns 404", async () => {
  await assertHidden({ now: DB_IDENTITY_EXPIRES_AT })
  await assertHidden({ now: DB_IDENTITY_EXPIRES_AT + 1 })
  await assertHidden({ now: Number.NaN })
})

test("Production endpoint is rejected before connecting", async () => {
  const db = fakeDb()
  const result = await run(db, { env: baseEnv({ DATABASE_URL: productionUrl }) })
  assert.deepEqual(result.body, {
    endpointId: "ep-crimson-snow-b8ledljt",
    marker: "not_checked",
    verdict: "FAIL_PRODUCTION_DATABASE",
  })
  assert.equal(db.connects, 0)
})

test("missing, unknown and non-Neon database settings fail without connecting", async () => {
  const cases = [
    [undefined, "missing"],
    ["", "missing"],
    ["not a url", "unrecognized"],
    [`postgresql://u:${FAKE_PASSWORD}@db.example.com/neondb`, "unrecognized"],
    [`mysql://u:${FAKE_PASSWORD}@ep-quiet-breeze-b8qi4eg2.eastus2.azure.neon.tech/neondb`, "unrecognized"],
    [`postgresql://u:${FAKE_PASSWORD}@ep-other-thing-123456-pooler.eastus2.azure.neon.tech/neondb`, "ep-other-thing-123456"],
  ]
  for (const [DATABASE_URL, endpointId] of cases) {
    const db = fakeDb()
    const result = await run(db, { env: baseEnv({ DATABASE_URL }) })
    assert.deepEqual(result.body, { endpointId, marker: "not_checked", verdict: "FAIL" })
    assert.equal(db.connects, 0)
  }
})

test("pooler suffix is stripped from the endpoint id", () => {
  assert.equal(extractEndpointId(previewUrl("-pooler")), "ep-quiet-breeze-b8qi4eg2")
  assert.equal(extractEndpointId(previewUrl("")), "ep-quiet-breeze-b8qi4eg2")
})

test("absent marker table, other marker value, and empty table all FAIL", async () => {
  let result = await run(fakeDb({ present: false }))
  assert.deepEqual(result.body, { endpointId: "ep-quiet-breeze-b8qi4eg2", marker: "absent", verdict: "FAIL" })

  result = await run(fakeDb({ rows: [{ name: "production-secret-label" }] }))
  assert.deepEqual(result.body, { endpointId: "ep-quiet-breeze-b8qi4eg2", marker: "other", verdict: "FAIL" })
  assert.ok(!JSON.stringify(result).includes("production-secret-label"))

  result = await run(fakeDb({ rows: [] }))
  assert.equal(result.body.marker, "absent")
  assert.equal(result.body.verdict, "FAIL")
})

test("database errors return a generic error and never leak details", async () => {
  for (const failOn of ["BEGIN", "SET LOCAL", "SELECT to_regclass", "SELECT name", "ROLLBACK"]) {
    const db = fakeDb({ failOn })
    const result = await run(db)
    assert.deepEqual(result.body, { endpointId: "ep-quiet-breeze-b8qi4eg2", marker: "error", verdict: "FAIL" })
    assert.equal(db.ended, 1, "session is always closed")
    assert.ok(!JSON.stringify(result).includes(FAKE_PASSWORD))
  }
  const result = await run(fakeDb({ connectError: new Error(`connect failed ${FAKE_PASSWORD}`) }))
  assert.deepEqual(result.body, { endpointId: "ep-quiet-breeze-b8qi4eg2", marker: "error", verdict: "FAIL" })
})

test("only the approved read-only statements are executed, in order", async () => {
  const db = fakeDb()
  await run(db)
  assert.deepEqual(db.statements, [...READ_ONLY_STATEMENTS])
  for (const sql of db.statements) {
    assert.match(sql, /^(BEGIN TRANSACTION READ ONLY|SET LOCAL statement_timeout|SELECT |ROLLBACK)/)
    assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|GRANT)\b/i)
    assert.doesNotMatch(sql, /sunday_class_registrations|lead_submissions/i)
  }
})

test("responses contain only the three fields and no secrets", async () => {
  const outputs = [
    await run(fakeDb()),
    await run(fakeDb(), { env: baseEnv({ DATABASE_URL: productionUrl }) }),
    await run(fakeDb({ failOn: "SELECT name" })),
  ]
  for (const result of outputs) {
    assert.deepEqual(Object.keys(result.body).sort(), ["endpointId", "marker", "verdict"])
    const text = JSON.stringify(result)
    for (const forbidden of ["postgres", "://", "@", "password", FAKE_PASSWORD, "eastus2", "fakeuser", "neondb", token, fingerprint]) {
      assert.ok(!text.toLowerCase().includes(forbidden.toLowerCase()), `response must not contain ${forbidden}`)
    }
  }
})

test("route exposes GET only; every other method is a 404, and the shared pool is not used", () => {
  const source = readFileSync(new URL("../app/api/admin/db-identity/route.ts", import.meta.url), "utf8")
  assert.match(source, /export async function GET\(/)
  assert.match(source, /export \{ notFound as POST, notFound as PUT, notFound as PATCH, notFound as DELETE, notFound as OPTIONS \}/)
  assert.match(source, /export const dynamic = "force-dynamic"/)
  assert.doesNotMatch(source, /@\/lib\/db["/]/)
  assert.doesNotMatch(source, /ADMIN_ACTION_SECRET/)
  assert.doesNotMatch(source, /x-forwarded|request\.headers\.get\("host"\)/i)
})
