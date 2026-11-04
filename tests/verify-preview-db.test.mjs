import { test } from "node:test"
import assert from "node:assert/strict"
import {
  evaluate,
  EXPECTED_ENDPOINT,
  PINNED_BRANCH,
  PRODUCTION_ENDPOINT,
} from "../scripts/verify-preview-db.mjs"

const FAKE_USER = "fakeuser_x9"
const FAKE_PASSWORD = "FakePassw0rd_ZZ"
const url = (endpoint, { pooler = true, query = "" } = {}) =>
  `postgresql://${FAKE_USER}:${FAKE_PASSWORD}@${endpoint}${pooler ? "-pooler" : ""}.eastus2.azure.neon.tech/neondb?sslmode=require${query}`

const pinnedEnv = (overrides = {}) => ({
  VERCEL: "1",
  VERCEL_ENV: "preview",
  VERCEL_GIT_COMMIT_REF: PINNED_BRANCH,
  DATABASE_URL: url(EXPECTED_ENDPOINT),
  ...overrides,
})

function assertNoSecrets(line) {
  for (const forbidden of ["://", "@", FAKE_USER, FAKE_PASSWORD, "neondb", "eastus2", "sslmode"]) {
    assert.ok(!line.includes(forbidden), `output must not contain ${forbidden}: ${line}`)
  }
}

test("pinned branch on preview-test passes with the expected log line", () => {
  const { exitCode, line } = evaluate(pinnedEnv())
  assert.equal(exitCode, 0)
  assert.match(line, new RegExp(`DATABASE_URL endpoint=${EXPECTED_ENDPOINT} pooled=yes`))
  assert.match(line, /options-endpoint=none host-override=none/)
  assert.match(line, /DATABASE_URL_UNPOOLED=absent/)
  assert.match(line, /PGHOST=absent/)
  assert.match(line, / result=PASS$/)
  assertNoSecrets(line)
})

test("unpooled address is recognised and reported", () => {
  const { exitCode, line } = evaluate(pinnedEnv({ DATABASE_URL: url(EXPECTED_ENDPOINT, { pooler: false }) }))
  assert.equal(exitCode, 0)
  assert.match(line, /pooled=no/)
})

test("matching options endpoint is allowed", () => {
  const { exitCode, line } = evaluate(
    pinnedEnv({ DATABASE_URL: url(EXPECTED_ENDPOINT, { query: `&options=endpoint%3D${EXPECTED_ENDPOINT}` }) }),
  )
  assert.equal(exitCode, 0)
  assert.match(line, new RegExp(`options-endpoint=${EXPECTED_ENDPOINT}`))
})

const pinnedFailures = [
  ["missing DATABASE_URL", { DATABASE_URL: undefined }, "DATABASE_URL-absent"],
  ["empty DATABASE_URL", { DATABASE_URL: "  " }, "DATABASE_URL-absent"],
  ["malformed DATABASE_URL", { DATABASE_URL: "not a url" }, "DATABASE_URL-malformed"],
  ["wrong protocol", { DATABASE_URL: `https://${EXPECTED_ENDPOINT}.neon.tech/x` }, "DATABASE_URL-malformed"],
  [
    "non-Neon host",
    { DATABASE_URL: `postgresql://${FAKE_USER}:${FAKE_PASSWORD}@db.example.com/neondb` },
    "DATABASE_URL-unrecognized",
  ],
  ["Production endpoint", { DATABASE_URL: url(PRODUCTION_ENDPOINT) }, "production-endpoint"],
  ["unexpected endpoint", { DATABASE_URL: url("ep-other-branch-a1b2c3d4") }, "unexpected-endpoint"],
  [
    "options routing to Production",
    { DATABASE_URL: url(EXPECTED_ENDPOINT, { query: `&options=endpoint%3D${PRODUCTION_ENDPOINT}` }) },
    "production-endpoint",
  ],
  [
    "options routing to another endpoint",
    { DATABASE_URL: url(EXPECTED_ENDPOINT, { query: "&options=endpoint%3Dep-other-branch-a1b2c3d4" }) },
    "conflicting-options-endpoint",
  ],
  [
    "unreadable options endpoint",
    { DATABASE_URL: url(EXPECTED_ENDPOINT, { query: "&options=endpoint%3D%24%24bad" }) },
    "unrecognized-options-endpoint",
  ],
  [
    "host query override",
    { DATABASE_URL: url(EXPECTED_ENDPOINT, { query: "&host=elsewhere.example.com" }) },
    "host-override",
  ],
  ["unpooled fallback to Production", { DATABASE_URL_UNPOOLED: url(PRODUCTION_ENDPOINT, { pooler: false }) }, "production-endpoint"],
  ["unpooled fallback elsewhere", { DATABASE_URL_UNPOOLED: url("ep-other-branch-a1b2c3d4") }, "conflicting-DATABASE_URL_UNPOOLED"],
  ["PGHOST to Production", { PGHOST: `${PRODUCTION_ENDPOINT}.eastus2.azure.neon.tech` }, "production-endpoint"],
  ["PGHOST unrecognized", { PGHOST: "db.example.com" }, "conflicting-PGHOST"],
  ["POSTGRES_URL elsewhere", { POSTGRES_URL: url("ep-other-branch-a1b2c3d4") }, "conflicting-POSTGRES_URL"],
  ["POSTGRES_HOST to Production", { POSTGRES_HOST: `${PRODUCTION_ENDPOINT}-pooler.eastus2.azure.neon.tech` }, "production-endpoint"],
]

for (const [name, overrides, reason] of pinnedFailures) {
  test(`pinned branch fails: ${name}`, () => {
    const { exitCode, line } = evaluate(pinnedEnv(overrides))
    assert.equal(exitCode, 1)
    assert.match(line, /result=FAIL/)
    assert.ok(line.includes(reason), `expected reason ${reason}: ${line}`)
    assert.doesNotMatch(line, /result=PASS/)
    assertNoSecrets(line)
  })
}

test("fallbacks matching preview-test are allowed", () => {
  const { exitCode, line } = evaluate(
    pinnedEnv({
      DATABASE_URL_UNPOOLED: url(EXPECTED_ENDPOINT, { pooler: false }),
      PGHOST: `${EXPECTED_ENDPOINT}-pooler.eastus2.azure.neon.tech`,
    }),
  )
  assert.equal(exitCode, 0)
  assert.match(line, new RegExp(`DATABASE_URL_UNPOOLED=${EXPECTED_ENDPOINT}`))
  assert.match(line, new RegExp(`PGHOST=${EXPECTED_ENDPOINT}`))
})

test("outside Vercel the check skips", () => {
  const { exitCode, line } = evaluate({ DATABASE_URL: url(PRODUCTION_ENDPOINT) })
  assert.equal(exitCode, 0)
  assert.match(line, /result=SKIPPED/)
  assertNoSecrets(line)
})

test("Production builds skip and never print database details", () => {
  const { exitCode, line } = evaluate({ VERCEL: "1", VERCEL_ENV: "production", DATABASE_URL: url(PRODUCTION_ENDPOINT) })
  assert.equal(exitCode, 0)
  assert.equal(line, "[db-check] env=production result=SKIPPED")
})

for (const vercelEnv of [undefined, "", "development", "staging"]) {
  test(`Vercel build with VERCEL_ENV=${vercelEnv} fails as UNVERIFIED`, () => {
    const { exitCode, line } = evaluate(pinnedEnv({ VERCEL_ENV: vercelEnv }))
    assert.equal(exitCode, 1)
    assert.match(line, /status=UNVERIFIED/)
    assertNoSecrets(line)
  })
}

for (const ref of [undefined, "", "bad branch;rm"]) {
  test(`preview with branch ${JSON.stringify(ref)} fails as UNVERIFIED`, () => {
    const { exitCode, line } = evaluate(pinnedEnv({ VERCEL_GIT_COMMIT_REF: ref }))
    assert.equal(exitCode, 1)
    assert.match(line, /branch=unknown .*status=UNVERIFIED/)
  })
}

test("other preview branches pass unless they reach Production", () => {
  const other = { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "v0/some-other-branch" }
  const fine = evaluate({ ...other, DATABASE_URL: url("ep-other-branch-a1b2c3d4") })
  assert.equal(fine.exitCode, 0)
  assert.match(fine.line, /result=PASS-not-pinned/)

  const missing = evaluate(other)
  assert.equal(missing.exitCode, 0)

  const prod = evaluate({ ...other, DATABASE_URL: url(PRODUCTION_ENDPOINT) })
  assert.equal(prod.exitCode, 1)
  assert.match(prod.line, /reason=production-endpoint/)
  assertNoSecrets(prod.line)
})
