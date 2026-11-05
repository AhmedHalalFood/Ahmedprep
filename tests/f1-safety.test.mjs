// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { internalPreviewAllowed } from "../lib/internal-routes.ts"
import { CAMPAIGNS, getActiveCampaign } from "../lib/campaigns.ts"
import { INTENSIVE_PROMO_ENDS_ON, isIntensivePromoActive } from "../lib/shsat-intensive.ts"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("internal routes: blocked on Production", () => {
  assert.equal(internalPreviewAllowed({ VERCEL_ENV: "production", NODE_ENV: "production" }), false)
  assert.equal(internalPreviewAllowed({ VERCEL_ENV: "production", NODE_ENV: "development" }), false)
})

test("internal routes: allowed on Vercel Preview and Development", () => {
  assert.equal(internalPreviewAllowed({ VERCEL_ENV: "preview", NODE_ENV: "production" }), true)
  assert.equal(internalPreviewAllowed({ VERCEL_ENV: "development", NODE_ENV: "development" }), true)
})

test("internal routes: fail closed when the environment is missing or unrecognised", () => {
  assert.equal(internalPreviewAllowed({}), false)
  assert.equal(internalPreviewAllowed({ NODE_ENV: "production" }), false)
  assert.equal(internalPreviewAllowed({ NODE_ENV: "test" }), false)
  for (const value of ["", " ", "Production", "PRODUCTION", "Preview", "staging", "prod"]) {
    assert.equal(internalPreviewAllowed({ VERCEL_ENV: value, NODE_ENV: "development" }), false, `VERCEL_ENV=${JSON.stringify(value)}`)
  }
})

test("internal routes: local next dev without VERCEL_ENV is allowed", () => {
  assert.equal(internalPreviewAllowed({ NODE_ENV: "development" }), true)
})

test("both internal pages call the request-time guard before rendering", () => {
  const guard = read("lib/internal-routes-guard.ts")
  assert.match(guard, /await connection\(\)/)
  assert.match(guard, /if \(!internalPreviewAllowed\(\)\) notFound\(\)/)
  for (const page of ["app/enroll/page.tsx", "app/enroll/seats-preview/page.tsx"]) {
    const source = read(page)
    assert.match(source, /export default async function/, page)
    assert.match(source, /^\s+await requireInternalPreview\(\)\n\s+return \(/m, page)
  }
})

test("banner cutoff matches the 2026 Intensive closure", () => {
  const banner = CAMPAIGNS.find((c) => c.id === "shsat-final-countdown")
  assert.equal(banner.endsOn, INTENSIVE_PROMO_ENDS_ON)
  assert.equal(INTENSIVE_PROMO_ENDS_ON, "2026-11-13")
})

test("banner shows until 11:59:59 PM ET on Nov 12, 2026 and hides from 12:00 AM ET Nov 13", () => {
  // EST (UTC-5) applies on Nov 13, 2026: midnight ET is 05:00 UTC.
  const cases = [
    ["2026-11-12T12:00:00Z", true],
    ["2026-11-13T04:00:00Z", true], // 11:00 PM EST Nov 12 (would be midnight if EDT were wrongly applied)
    ["2026-11-13T04:59:59Z", true],
    ["2026-11-13T05:00:00Z", false],
    ["2026-11-13T05:00:01Z", false],
    ["2026-11-20T15:00:00Z", false],
    ["2027-01-09T15:00:00Z", false],
  ]
  for (const [iso, shown] of cases) {
    const now = new Date(iso)
    assert.equal(getActiveCampaign(now) !== null, shown, iso)
    assert.equal(isIntensivePromoActive(now), shown, `Intensive closure agrees at ${iso}`)
  }
})

test("banner still shows across the Nov 1, 2026 daylight-saving change", () => {
  for (const iso of [
    "2026-11-01T03:59:59Z", // 11:59:59 PM EDT Oct 31
    "2026-11-01T05:30:00Z", // 1:30 AM EDT
    "2026-11-01T06:30:00Z", // 1:30 AM EST (repeated hour)
    "2026-11-02T04:30:00Z", // 11:30 PM EST Nov 1
  ]) {
    assert.ok(getActiveCampaign(new Date(iso)), iso)
  }
})

test("banner component checks the cutoff at request time", () => {
  const source = read("components/landing/campaign-banner.tsx")
  assert.match(source, /export async function CampaignBanner/)
  assert.match(source, /await connection\(\)/)
})
