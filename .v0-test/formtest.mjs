import { randomUUID } from "node:crypto"

const BASE = "http://localhost:3000"
const RUN = process.env.RUN_TAG || `t${Date.now().toString(36)}`
const results = []
let ipSeq = Math.floor(Math.random() * 200)
const nextIp = () => `198.51.100.${(ipSeq++ % 250) + 1}`

async function post(path, body, ip = nextIp()) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ website: "", elapsedMs: 4000, ...body }),
  })
  let json = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}

function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail })
}

const email = (tag) => `delivered+${RUN}-${tag}@resend.dev`

const forms = {
  diagnostic: () => ({
    path: "/api/diagnostic",
    body: { studentName: `TEST Diag ${RUN}`, studentGrade: "7th Grade", parentName: "TEST Parent", parentPhone: "212-555-0101",
      parentEmail: email("diag"), program: "SHSAT", preferredDate: "2026-11-07", currentScore: "", target: "", notes: "automated test" },
  }),
  dsat: () => ({
    path: "/api/diagnostic",
    body: { studentName: `TEST DSAT ${RUN}`, studentGrade: "11th Grade", parentName: "TEST Parent", parentPhone: "212-555-0102",
      parentEmail: email("dsat"), program: "Digital SAT", preferredDate: "2026-11-08", notes: "automated test" },
  }),
  contact: () => ({
    path: "/api/contact",
    body: { name: `TEST Contact ${RUN}`, email: email("contact"), phone: "212-555-0103", grade: "10th Grade", program: "Digital SAT",
      level: "", goal: "1400+", message: "automated test" },
  }),
  referral: () => ({
    path: "/api/referral",
    body: { referrerName: `TEST Referrer ${RUN}`, referrerEmail: email("referral"), referrerPhone: "212-555-0104",
      studentName: `TEST Referred ${RUN}`, parentContact: "test contact only", program: "SHSAT" },
  }),
  intensive: () => ({
    path: "/api/shsat-intensive",
    body: { parentName: "TEST Parent", studentName: `TEST Intensive ${RUN}`, studentGrade: "8th Grade", phone: "212-555-0105",
      email: email("intensive"), currentSchool: "Test School", startDate: "2026-10-27", paymentOption: process.env.PAY_OPTION,
      message: "automated test", tuition: 1, totalTuition: 1, totalTuitionUsd: "1", remainingClasses: "99" },
  }),
}

const mode = process.argv[2] || "main"

if (mode === "main") {
  for (const [key, make] of Object.entries(forms)) {
    const { path, body } = make()
    const submissionId = randomUUID()
    const r = await post(path, { ...body, submissionId })
    check(`${key}: submit`, r.status === 200 && r.json?.success && !r.json?.duplicate, `${r.status} ${JSON.stringify(r.json)}`)
    const again = await post(path, { ...body, submissionId })
    check(`${key}: repeat is duplicate`, again.status === 200 && again.json?.duplicate === true, `${again.status} ${JSON.stringify(again.json)}`)
  }

  {
    const { path, body } = forms.contact()
    const submissionId = randomUUID()
    const b = { ...body, name: `TEST Concurrent ${RUN}`, submissionId }
    const [a, c] = await Promise.all([post(path, b), post(path, b)])
    const dupCount = [a, c].filter((x) => x.json?.duplicate).length
    check("contact: two simultaneous clicks -> one delivery, one duplicate",
      a.status === 200 && c.status === 200 && dupCount === 1, `${a.status}/${c.status} duplicates=${dupCount}`)
  }

  {
    const { path, body } = forms.intensive()
    const bad = await post(path, { ...body, startDate: "2026-13-45", submissionId: randomUUID() })
    check("intensive: invalid date rejected", bad.status === 400, `${bad.status} ${bad.json?.error}`)
    const past = await post(path, { ...body, startDate: "2026-10-20", submissionId: randomUUID() })
    check("intensive: past date rejected", past.status === 400, `${past.status} ${past.json?.error}`)
    const badPay = await post(path, { ...body, paymentOption: "Free", submissionId: randomUUID() })
    check("intensive: unknown payment option rejected", badPay.status === 400, `${badPay.status}`)
  }

  {
    const ip = "203.0.113.77"
    const statuses = []
    for (let i = 0; i < 6; i++) statuses.push((await post("/api/referral", { submissionId: randomUUID() }, ip)).status)
    check("rate limit: 6th request blocked", statuses.slice(0, 5).every((s) => s === 400) && statuses[5] === 429, statuses.join(","))
  }

  {
    let done = false
    for (const classDate of ["2026-10-25", "2026-11-01", "2026-11-08"]) {
      for (const classType of ["SHSAT", "Digital SAT"]) {
        const body = { studentName: `TEST Sunday ${RUN}`, studentGrade: process.env.SUNDAY_GRADE || "7th Grade", parentName: "TEST Parent",
          parentEmail: email("sunday"), parentPhone: "212-555-0106", classType, classDate, currentSchool: "", consent: "yes" }
        const r = await post("/api/free-sunday-class", body)
        if (r.status === 400) continue
        check(`sunday (${classType} ${classDate}): submit`, r.status === 200 && r.json?.success && !r.json?.duplicate, `${r.status} ${JSON.stringify(r.json).slice(0, 160)}`)
        const again = await post("/api/free-sunday-class", body)
        check("sunday: repeat is duplicate", again.status === 200 && again.json?.duplicate === true, `${again.status}`)
        done = true
        break
      }
      if (done) break
    }
    if (!done) check("sunday: submit", false, "every candidate date/program returned 400")
  }
}

if (mode === "emailfail") {
  for (const key of ["diagnostic", "intensive"]) {
    const { path, body } = forms[key]()
    const r = await post(path, { ...body, studentName: `TEST EmailFail ${key} ${RUN}`, submissionId: randomUUID() })
    check(`${key} with email down: still saved, parent told success`, r.status === 200 && r.json?.success, `${r.status} ${JSON.stringify(r.json)}`)
  }
  const body = { studentName: `TEST EmailFail Sunday ${RUN}`, studentGrade: process.env.SUNDAY_GRADE || "7th Grade", parentName: "TEST Parent",
    parentEmail: email("sundayfail"), parentPhone: "212-555-0107", classType: process.env.SUNDAY_TYPE, classDate: process.env.SUNDAY_DATE,
    currentSchool: "", consent: "yes" }
  const r = await post("/api/free-sunday-class", body)
  check("sunday with email down: still saved, parent told success", r.status === 200 && r.json?.success, `${r.status} ${JSON.stringify(r.json).slice(0, 200)}`)
}

console.log(`RUN_TAG=${RUN}`)
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}  | ${r.detail}`)
console.log(`${results.filter((r) => r.ok).length}/${results.length} passed`)
