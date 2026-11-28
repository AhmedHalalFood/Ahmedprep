// Safe Preview HTTP smoke tests only. All POST bodies are intentionally invalid.
// NEVER send a valid enrollment payload: Preview database isolation is not yet confirmed.
import assert from "node:assert/strict"

const args = process.argv.slice(2)
const local = args.length === 1 && args[0] === "--local"
assert.ok(local || args.length === 0, "Usage: node tests/preview-http-smoke.mjs [--local]")

const base = local ? "http://127.0.0.1:3217" : process.env.PREVIEW_BASE_URL
assert.ok(base, "Set PREVIEW_BASE_URL")
const root = new URL(base)
if (!local) {
  assert.equal(root.protocol, "https:", "Preview must use HTTPS")
  assert.ok(root.hostname.endsWith(".vercel.app"), "Only a vercel.app Preview may be tested")
  assert.ok(/preview/i.test(root.hostname), "Never test production aliases")
}

async function request(path, init = {}) {
  const url = new URL(path, root)
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000), ...init })
  console.log(`${init.method || "GET"} ${url.pathname}: HTTP ${response.status}`)
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Unexpected redirect; Preview may be behind authentication (HTTP ${response.status})`)
  }
  if ([401,403].includes(response.status)) throw new Error("Preview requires access credentials")
  return response
}

for (const [path, expected] of [
  ["/", "2027"],
  ["/enroll-2027", "Request Enrollment"],
  ["/programs-2027", "2027"],
  ["/enroll-2027?cohort=winter-shsat-weekday", "SHSAT"],
]) {
  const res = await request(path)
  assert.equal(res.status, 200, `Preview page ${path} unavailable`)
  const html = await res.text()
  assert.ok(html.includes(expected), `Expected page content missing for ${path}`)
}

// Neither test can reach saveAndDeliverLead(), Neon, or Resend.
// Invalid JSON is rejected by readBody(); missing fields/selection fails before DB access.
const badJson = await request("/api/enrollment-2027", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{invalid",
})
assert.equal(badJson.status, 400, "Malformed request should be rejected")
assert.deepEqual(await badJson.json(), { success: false, error: "Invalid request." })

const invalidSelection = await request("/api/enrollment-2027", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ elapsedMs: 3000, website: "", program: "FAKE-PROGRAM", term: "winter", cohortId: "invalid" }),
})
assert.equal(invalidSelection.status, 400, "Incomplete/inconsistent enrollment should be rejected")
assert.deepEqual(await invalidSelection.json(), {
  success: false,
  error: "Please complete all required fields or choose an active class.",
})

console.log("PASS: Preview pages and non-mutating enrollment API checks")
