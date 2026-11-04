// Build-time guard: proves which Neon endpoint a Preview build is configured to
// use, without connecting to any database. It reads only host names and the
// `options`/`host` query parameters of connection strings, and only ever prints
// values that match the Neon endpoint-ID pattern, so credentials cannot leak.
import { pathToFileURL } from "node:url"

export const PINNED_BRANCH = "v0/january-2027-enrollment"
export const EXPECTED_ENDPOINT = "ep-quiet-breeze-b8qi4eg2"
export const PRODUCTION_ENDPOINT = "ep-crimson-snow-b8ledljt"

const ENDPOINT_PATTERN = /^ep-[a-z0-9]+(?:-[a-z0-9]+)*$/
const SAFE_BRANCH_PATTERN = /^[A-Za-z0-9._/-]{1,200}$/

const FALLBACK_URL_VARS = [
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NO_SSL",
]
const FALLBACK_HOST_VARS = ["PGHOST", "PGHOST_UNPOOLED", "POSTGRES_HOST"]

function endpointFromHostname(hostname) {
  const host = String(hostname || "").toLowerCase()
  if (!host.endsWith(".neon.tech")) return { status: "unrecognized" }
  const label = host.split(".")[0]
  const pooled = label.endsWith("-pooler")
  const id = pooled ? label.slice(0, -"-pooler".length) : label
  if (!ENDPOINT_PATTERN.test(id)) return { status: "unrecognized" }
  return { status: "ok", id, pooled }
}

function optionsEndpoint(optionsValue) {
  if (optionsValue === null) return { status: "none" }
  const match = /(?:^|[\s,])(?:--)?endpoint=([^\s,]+)/.exec(optionsValue)
  if (!match) return { status: "none" }
  const id = match[1].toLowerCase()
  return ENDPOINT_PATTERN.test(id) ? { status: "ok", id } : { status: "unrecognized" }
}

export function inspectConnectionString(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { status: "absent" }
  }
  let url
  try {
    url = new URL(String(value).trim())
  } catch {
    return { status: "malformed" }
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    return { status: "malformed" }
  }
  const endpoint = endpointFromHostname(url.hostname)
  if (endpoint.status !== "ok") return { status: "unrecognized" }
  return {
    status: "ok",
    id: endpoint.id,
    pooled: endpoint.pooled,
    hostOverride: url.searchParams.has("host"),
    options: optionsEndpoint(url.searchParams.get("options")),
  }
}

export function inspectHost(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { status: "absent" }
  }
  const endpoint = endpointFromHostname(String(value).trim())
  return endpoint.status === "ok" ? { status: "ok", id: endpoint.id } : { status: "unrecognized" }
}

function describe(result) {
  return result.status === "ok" ? result.id : result.status
}

export function evaluate(env) {
  if (!env.VERCEL) {
    return { exitCode: 0, line: "[db-check] not a Vercel build result=SKIPPED" }
  }

  const vercelEnv = env.VERCEL_ENV
  if (vercelEnv === "production") {
    return { exitCode: 0, line: "[db-check] env=production result=SKIPPED" }
  }
  if (vercelEnv !== "preview") {
    return {
      exitCode: 1,
      line: "[db-check] env=unknown result=FAIL reason=missing-or-unexpected-VERCEL_ENV status=UNVERIFIED",
    }
  }

  const rawBranch = env.VERCEL_GIT_COMMIT_REF
  if (!rawBranch || !SAFE_BRANCH_PATTERN.test(rawBranch)) {
    return {
      exitCode: 1,
      line: "[db-check] env=preview branch=unknown result=FAIL reason=missing-or-invalid-VERCEL_GIT_COMMIT_REF status=UNVERIFIED",
    }
  }
  const pinned = rawBranch === PINNED_BRANCH

  const primary = inspectConnectionString(env.DATABASE_URL)
  const fallbacks = [
    ...FALLBACK_URL_VARS.map((name) => ({ name, result: inspectConnectionString(env[name]) })),
    ...FALLBACK_HOST_VARS.map((name) => ({ name, result: inspectHost(env[name]) })),
  ]

  const fields = [`env=preview`, `branch=${rawBranch}`]
  if (primary.status === "ok") {
    fields.push(
      `DATABASE_URL endpoint=${primary.id}`,
      `pooled=${primary.pooled ? "yes" : "no"}`,
      `options-endpoint=${describe(primary.options)}`,
      `host-override=${primary.hostOverride ? "present" : "none"}`,
    )
  } else {
    fields.push(`DATABASE_URL=${primary.status}`)
  }
  for (const { name, result } of fallbacks) fields.push(`${name}=${describe(result)}`)

  const reasons = []
  const touchesProduction =
    (primary.status === "ok" &&
      (primary.id === PRODUCTION_ENDPOINT ||
        (primary.options.status === "ok" && primary.options.id === PRODUCTION_ENDPOINT))) ||
    fallbacks.some(({ result }) => result.status === "ok" && result.id === PRODUCTION_ENDPOINT)
  if (touchesProduction) reasons.push("production-endpoint")

  if (pinned) {
    if (primary.status !== "ok") {
      reasons.push(`DATABASE_URL-${primary.status}`)
    } else {
      if (primary.id !== EXPECTED_ENDPOINT) reasons.push("unexpected-endpoint")
      if (primary.hostOverride) reasons.push("host-override")
      if (primary.options.status === "unrecognized") reasons.push("unrecognized-options-endpoint")
      if (primary.options.status === "ok" && primary.options.id !== EXPECTED_ENDPOINT) {
        reasons.push("conflicting-options-endpoint")
      }
    }
    for (const { name, result } of fallbacks) {
      if (result.status === "absent") continue
      if (result.status !== "ok" || result.id !== EXPECTED_ENDPOINT) reasons.push(`conflicting-${name}`)
    }
  }

  const unique = [...new Set(reasons)]
  if (unique.length > 0) {
    fields.push("result=FAIL", `reason=${unique.join(",")}`)
    return { exitCode: 1, line: `[db-check] ${fields.join(" ")}` }
  }
  fields.push(pinned ? "result=PASS" : "result=PASS-not-pinned")
  return { exitCode: 0, line: `[db-check] ${fields.join(" ")}` }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let outcome
  try {
    outcome = evaluate(process.env)
  } catch {
    outcome = { exitCode: 1, line: "[db-check] result=FAIL reason=internal-error status=UNVERIFIED" }
  }
  if (outcome.exitCode === 0) console.log(outcome.line)
  else console.error(outcome.line)
  process.exit(outcome.exitCode)
}
