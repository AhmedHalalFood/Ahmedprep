import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { ALL_COHORTS } from "@/lib/cohorts-2027"
import { SESSION_BLOCKS, TOPICS, syllabusFor, mockSessionsFor, GRADECAM_NOTE } from "@/lib/curriculum-2027"

test("session blocks follow the approved 75 / 75 / 30 three-hour structure", () => {
  assert.deepEqual(SESSION_BLOCKS.map((b) => b.minutes), [75, 75, 30])
})

test("every cohort syllabus covers its approved sessions and hours", () => {
  const expected = { winter: 24, spring: 24 }
  for (const c of ALL_COHORTS) {
    const s = syllabusFor(c)
    const sessions = expected[c.term] ?? (c.label === "Weekday Intensive" ? 32 : 16)
    assert.equal(s.length, sessions, c.id)
    assert.equal(s.length * 3, c.hours, c.id)
    assert.deepEqual(s.map((x) => x.number), s.map((_, i) => i + 1), c.id)
  }
})

test("diagnostic first, mock exams by course length, final report last", () => {
  for (const c of ALL_COHORTS) {
    const s = syllabusFor(c)
    assert.equal(s[0].format, "diagnostic", c.id)
    assert.deepEqual(s.filter((x) => x.format === "mock").map((x) => x.number), [...mockSessionsFor(s.length)], c.id)
    assert.ok(s.at(-1).assessments.some((a) => a.kind === "final"), c.id)
    assert.ok(s.some((x) => x.assessments.some((a) => a.kind === "quiz")), c.id)
    assert.ok(s.some((x) => x.assessments.some((a) => a.kind === "cumulative")), c.id)
  }
})

test("every topic in the sequence is taught in every cohort", () => {
  for (const c of ALL_COHORTS) {
    const s = syllabusFor(c)
    for (const track of ["math", "verbal"]) {
      const taught = s.filter((x) => x[track]).map((x) => x[track].title).join(" | ")
      for (const t of TOPICS[c.program][track]) assert.ok(taught.includes(t.title), `${c.id} ${track}: ${t.title}`)
    }
  }
})

test("Digital SAT math sessions include Desmos instruction", () => {
  for (const c of ALL_COHORTS.filter((x) => x.program === "Digital SAT")) {
    for (const x of syllabusFor(c).filter((x) => x.math)) assert.ok(x.math.desmos, `${c.id} session ${x.number}`)
  }
})

test("proposed makeups stay marked as unapproved in the syllabus", () => {
  for (const c of ALL_COHORTS) {
    const makeups = syllabusFor(c).filter((x) => x.kind === "makeup")
    assert.equal(makeups.length, c.makeups.length, c.id)
    for (const m of makeups) assert.equal(m.approved, c.makeups.find((x) => x.iso === m.iso).approved, c.id)
  }
})

test("curriculum pages are drafts, not indexed, and claim no GradeCam integration", () => {
  for (const f of ["app/curriculum-2027/page.tsx", "app/curriculum-2027/[cohort]/page.tsx"]) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), "utf8")
    assert.match(src, /robots: \{ index: false, follow: false \}/, f)
    assert.match(src, /DraftNotice/, f)
  }
  assert.match(GRADECAM_NOTE, /no GradeCam integration/)
  assert.doesNotMatch(readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8"), /curriculum-2027/)
})
