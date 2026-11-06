import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { ALL_COHORTS, sessionCalendar } from "@/lib/cohorts-2027"
import {
  SESSION_BLOCKS, SMART_METHOD, TOPICS, syllabusFor, mockSessionsFor, GRADECAM_NOTE, OFFICIAL_PRACTICE_TESTS, weekOf,
} from "@/lib/curriculum-2027"

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8")

test("session blocks follow the approved 75 / 75 / 30 three-hour structure", () => {
  assert.deepEqual(SESSION_BLOCKS.map((b) => b.minutes), [75, 75, 30])
})

test("SMART uses the owner's definition", () => {
  assert.deepEqual(SMART_METHOD.map((s) => `${s.letter} = ${s.name}`), [
    "S = Simplify", "M = Memorize meaningfully", "A = Apply", "R = Retrieve and review", "T = Test strategically",
  ])
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

test("diagnostic first, mock exams by course length, reports after each, final report last", () => {
  for (const c of ALL_COHORTS) {
    const s = syllabusFor(c)
    assert.equal(s[0].format, "diagnostic", c.id)
    assert.deepEqual(s.filter((x) => x.format === "mock").map((x) => x.number), [...mockSessionsFor(s.length)], c.id)
    for (const x of s.filter((x) => x.format !== "instruction")) assert.ok(x.assessments.some((a) => a.kind === "report"), `${c.id} ${x.number}`)
    assert.ok(s.at(-1).assessments.some((a) => a.kind === "final"), c.id)
    assert.ok(s.some((x) => x.assessments.some((a) => a.kind === "cumulative")), c.id)
  }
})

test("every calendar week has exactly one weekly quiz, or an explicit note when it has no lesson", () => {
  for (const c of ALL_COHORTS) {
    const weeks = new Map()
    for (const x of syllabusFor(c)) weeks.set(weekOf(x.iso), [...(weeks.get(weekOf(x.iso)) ?? []), x])
    for (const [week, list] of weeks) {
      const quizzes = list.flatMap((x) => x.assessments.filter((a) => a.kind === "quiz").map(() => x))
      const notes = list.flatMap((x) => x.assessments.filter((a) => a.kind === "quiz-note"))
      const hasLesson = list.some((x) => x.format === "instruction")
      assert.equal(quizzes.length + notes.length, 1, `${c.id} week of ${week}`)
      if (hasLesson) assert.equal(quizzes[0]?.format, "instruction", `${c.id} week of ${week}`)
    }
  }
})

test("topics progress foundations → advanced → mixed, and every topic is taught", () => {
  const order = { foundations: 0, advanced: 1, mixed: 2 }
  for (const c of ALL_COHORTS) {
    const lessons = syllabusFor(c).filter((x) => x.format === "instruction")
    const stages = lessons.map((x) => order[x.stage])
    assert.deepEqual(stages, [...stages].sort((a, b) => a - b), c.id)
    assert.equal(lessons.at(-1).stage, "mixed", c.id)
    for (const track of ["math", "verbal"]) {
      const taught = lessons.map((x) => x[track].title).join(" | ")
      for (const t of TOPICS[c.program][track]) assert.ok(taught.includes(t.title), `${c.id} ${track}: ${t.title}`)
      if (c.sessions >= 24) {
        const advanced = lessons.filter((x) => x.stage === "advanced").map((x) => x[track])
        assert.ok(advanced.length > 0 && advanced.every((t, i) => t.priority || i >= TOPICS[c.program][track].filter((p) => p.priority).length), c.id)
      }
    }
    for (const x of lessons) assert.equal(x.smart.map((a) => a.letter).join(""), "SMART", `${c.id} ${x.number}`)
  }
})

test("Digital SAT math sessions include Desmos instruction", () => {
  for (const c of ALL_COHORTS.filter((x) => x.program === "Digital SAT")) {
    for (const x of syllabusFor(c).filter((x) => x.math)) assert.ok(x.math.desmos, `${c.id} session ${x.number}`)
  }
})

test("unverified official tests are not claimed; exams are labeled original AhmedPrep tests", () => {
  for (const c of ALL_COHORTS) {
    const exams = syllabusFor(c).filter((x) => x.format !== "instruction").map((x) => x.assessments[0].label)
    for (const label of exams) {
      if (!OFFICIAL_PRACTICE_TESTS[c.program].verified) assert.match(label, /original AhmedPrep practice test/, c.id)
      assert.match(label, c.program === "SHSAT" ? /180 minutes/ : /2 × 32 min .* 2 × 35 min/, c.id)
    }
  }
})

test("proposed makeups stay unapproved; August 29 is an additional session; no same-day overlaps", () => {
  const toMin = (t) => {
    const [, h, m = "0", ap] = t.match(/^(\d+)(?::(\d+))?\s*(AM|PM)?/)
    return ((+h % 12) + (ap === "PM" || (!ap && /PM/.test(t)) ? 12 : 0)) * 60 + +m
  }
  const range = (t) => {
    const [a, b] = t.split("–")
    const end = toMin(b)
    let start = toMin(a + (/(AM|PM)/.test(a) ? "" : b.match(/AM|PM/)[0]))
    return [start, end]
  }
  const all = []
  for (const c of ALL_COHORTS) {
    const s = syllabusFor(c)
    const makeups = s.filter((x) => x.kind === "makeup")
    assert.equal(makeups.length, c.makeups.length, c.id)
    for (const m of makeups) {
      assert.equal(m.approved, c.makeups.find((x) => x.iso === m.iso).approved, c.id)
      assert.ok(!c.closures.some((x) => x.iso === m.iso), `${c.id} makeup on a closure`)
    }
    if (c.label === "Weekday Intensive") {
      const aug29 = makeups.find((m) => m.iso === "2027-08-29")
      assert.ok(aug29?.additional, c.id)
      assert.ok(!sessionCalendar(c).some((x) => x.iso === "2027-07-05"), c.id)
    }
    for (const x of s) all.push({ id: c.id, iso: x.iso, r: range(x.time) })
  }
  for (const a of all) for (const b of all) {
    if (a.id < b.id && a.iso === b.iso) assert.ok(a.r[1] <= b.r[0] || b.r[1] <= a.r[0], `${a.id} / ${b.id} overlap on ${a.iso}`)
  }
  assert.match(read("app/curriculum-2027/[cohort]/page.tsx"), /Proposed makeup — not yet approved/)
})

test("curriculum pages are drafts, not indexed, not in navigation or sitemap, and claim no GradeCam integration", () => {
  for (const f of ["app/curriculum-2027/page.tsx", "app/curriculum-2027/[cohort]/page.tsx", "app/curriculum-2027/progress-report/page.tsx"]) {
    const src = read(f)
    assert.match(src, /robots: \{ index: false, follow: false \}/, f)
    assert.match(src, /DraftNotice/, f)
  }
  assert.match(GRADECAM_NOTE, /no GradeCam integration/)
  assert.doesNotMatch(read("app/sitemap.ts"), /curriculum-2027/)
  const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
  const root = new URL("..", import.meta.url).pathname
  const outside = [...walk(join(root, "components")), ...walk(join(root, "app"))]
    .filter((f) => /\.(tsx?|mjs)$/.test(f) && !f.includes("/curriculum-2027") && !f.includes("/components/curriculum/"))
  for (const f of outside) assert.doesNotMatch(readFileSync(f, "utf8"), /curriculum-2027/, f)
})
