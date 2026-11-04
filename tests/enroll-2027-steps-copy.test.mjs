import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const source = readFileSync(new URL("../lib/enrollment-2027.ts", import.meta.url), "utf8")

test("enroll-2027 step 2 confirms availability, not the seat", () => {
  assert.ok(source.includes('"We confirm availability and send payment instructions."'))
  assert.ok(!/confirm your seat/i.test(source))
})

test("enroll-2027 step 3 still ties confirmation to full payment", () => {
  assert.ok(source.includes('"Enrollment is confirmed after full payment"'))
  assert.ok(source.includes('"Your seat is confirmed once full payment is verified and accepted."'))
})
