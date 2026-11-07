// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { ENROLLMENT_2027 } from "../lib/enrollment-2027.ts"
import { getProgram } from "../lib/programs.ts"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("Why Families: Free Sunday copy states the January 2027 every-other-Sunday schedule", () => {
  const src = read("components/landing/why-families.tsx")
  assert.match(src, /Beginning January 2027/)
  assert.match(src, /same every-other Sunday/)
  assert.match(src, /SHSAT at 6:00–6:45 PM ET/)
  assert.match(src, /Digital SAT at 7:00–7:45 PM ET/)
  assert.doesNotMatch(src, /alternate between SHSAT and Digital SAT/)
  assert.doesNotMatch(src, /Free weekly learning/)
})

test("Programs: SHSAT and Digital SAT show the approved 2027 hourly tuition", () => {
  const { regular, early, founding } = ENROLLMENT_2027.tuition
  for (const id of ["shsat", "digital_sat"]) {
    const p = getProgram(id)
    assert.ok(p.price.includes("$20 per scheduled instructional hour") && p.price.includes("2027"), id)
    assert.ok(!p.price.includes("January 2027"), `${id} price is not January-only`)
    for (const total of [regular.total, "$1,920", "$960"]) assert.ok(p.priceNote.includes(total), `${id} note ${total}`)
    for (const phrase of ["saves 10%", "saves 25%", "first 5 fully paid enrollments per cohort"]) {
      assert.ok(p.priceNote.includes(phrase), `${id} note ${phrase}`)
    }
    assert.ok(early.total && founding.total)
    for (const date of ["December 19", "December 21", "December 22", "November 28", "November 30", "December 1 "]) {
      assert.ok(p.priceNote.includes(date), `${id} note ${date}`)
    }
    assert.ok(!p.priceNote.includes("December 20, 2026") && !p.priceNote.includes("December 5, 2026"))
    assert.ok(p.priceNote.includes("Discounts cannot be combined"))
    assert.ok(p.priceNote.includes("Private tutoring is priced separately"))
  }
  assert.equal(regular.total, "$1,440")
  assert.equal(early.total, "$1,296")
  assert.equal(founding.total, "$1,080")
})

test("Programs: private tutoring keeps its contact-for-pricing behaviour", () => {
  assert.equal(getProgram("private_tutoring").price, null)
})

test("Home Programs & Pricing preview covers all 2027 terms, derives tuition centrally, and links to /programs-2027", () => {
  const src = read("components/landing/programs-preview.tsx")
  assert.match(src, /2027 SHSAT &amp; Digital SAT small-group tuition/)
  assert.doesNotMatch(src, /January 2027/)
  assert.match(src, /priceFor\(/)
  assert.match(src, /ENROLLMENT_2027\.tuition/)
  assert.match(src, /href="\/programs-2027"/)
  assert.doesNotMatch(src, /\$1,440|\$1,296|\$1,080/)
})

test("Mobile CALL | TEXT | RESERVE A SEAT bar is unchanged and rendered on every page", () => {
  const layout = read("app/layout.tsx")
  assert.match(layout, /<MobileCtaBar showIntensive=\{showIntensive\} \/>/)
  const bar = read("components/mobile-cta-bar.tsx")
  for (const label of [">\n        Call\n", ">\n        Text\n", "Reserve a Seat"]) assert.ok(bar.includes(label), label)
})
