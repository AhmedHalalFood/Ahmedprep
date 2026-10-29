/**
 * AhmedPrep free-access policy: up to two free Sunday Zoom classes and up to two free diagnostic assessments per
 * student, each counted across SHSAT and Digital SAT combined. Pure logic with no imports, so it can be unit tested
 * directly with Node (tests/free-access-policy.test.mjs) and shared by the API routes and the admin page.
 */

export const FREE_ACCESS_LIMITS = { sunday_class: 2, diagnostic: 2 } as const
export type FreeAccessKind = keyof typeof FREE_ACCESS_LIMITS

export const FREE_ACCESS_POLICY_TEXT =
  "Each student is welcome to attend up to two free Sunday classes and receive up to two free diagnostic assessments. Advance registration and confirmation are required."

export const ATTENDANCE_STATUSES = ["registered", "attended", "no_show", "cancelled"] as const
export const ASSESSMENT_STATUSES = ["requested", "completed", "no_show", "cancelled"] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]
export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number]

export const STATUS_LABELS: Record<AttendanceStatus | AssessmentStatus, string> = {
  registered: "Registered",
  requested: "Requested",
  attended: "Attended",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
}

/** Only these count against the allowance. Cancellations, no-shows and unfinished registrations never do. */
const COUNTED: Record<FreeAccessKind, string> = { sunday_class: "attended", diagnostic: "completed" }
const PENDING: Record<FreeAccessKind, string> = { sunday_class: "registered", diagnostic: "requested" }

/** How long an uncompleted diagnostic request reserves a slot before it stops blocking new requests. */
export const DIAGNOSTIC_HOLD_DAYS = 45

export type Identity = { studentName: string; parentEmail: string; parentPhone: string }

export type UsageRecord = Identity & {
  id: number
  /** dedupe_key (Sunday) or idempotency_key (diagnostic), so a repeat of the same booking is recognised. */
  key: string
  status: string | null
  /** ISO date until which a pending record still reserves a slot (class date, or request date + hold days). */
  heldUntil: string | null
}

export type AccessException = Identity & { id: number; extraAllowance: number }

export type MatchStrength = "same" | "uncertain" | "different"

export type FreeAccessDecision = {
  outcome: "allow" | "review" | "block"
  reason?: "limit_reached" | "upcoming_bookings" | "possible_duplicate"
  allowance: number
  used: number
  held: number
  remaining: number
  /** Records on a possibly-related family, for the administrator to review. */
  relatedIds: number[]
}

export function normalizeName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export const normalizeEmail = (value: string) => value.trim().toLowerCase()

/** Last ten digits, so "+1 (347) 479-5020" and "347.479.5020" match. Empty when fewer than ten digits. */
export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 10 ? digits.slice(-10) : ""
}

function editDistance(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = temp
    }
  }
  return prev[b.length]
}

/** "same" only for an identical normalized name. Nicknames, typos and missing surnames are "similar". */
export function compareNames(a: string, b: string): "same" | "similar" | "different" {
  const x = normalizeName(a)
  const y = normalizeName(b)
  if (!x || !y) return "different"
  if (x === y) return "same"
  const xs = x.split(" ")
  const ys = y.split(" ")
  if (xs[0] === ys[0]) return "similar"
  if (xs.every((t) => ys.includes(t)) || ys.every((t) => xs.includes(t))) return "similar"
  if (Math.min(x.length, y.length) >= 4 && editDistance(x, y) <= 2) return "similar"
  return "different"
}

/**
 * Same parent contact + same student name: the same student.
 * Same parent contact + similar name (sibling? typo?), or same full name under different contact details
 * (second parent? new email?): uncertain, so a person decides instead of the website rejecting a real family.
 */
export function matchIdentity(a: Identity, b: Identity): MatchStrength {
  const emailA = normalizeEmail(a.parentEmail)
  const phoneA = normalizePhone(a.parentPhone)
  const sameContact =
    (emailA !== "" && emailA === normalizeEmail(b.parentEmail)) || (phoneA !== "" && phoneA === normalizePhone(b.parentPhone))
  const names = compareNames(a.studentName, b.studentName)
  if (sameContact) return names === "same" ? "same" : names === "similar" ? "uncertain" : "different"
  return names === "same" && normalizeName(a.studentName).includes(" ") ? "uncertain" : "different"
}

function occupiesSlot(kind: FreeAccessKind, record: UsageRecord, today: string) {
  const status = record.status ?? PENDING[kind]
  if (status === COUNTED[kind]) return "used" as const
  if (status === PENDING[kind] && record.heldUntil !== null && record.heldUntil >= today) return "held" as const
  return null
}

/**
 * Decides whether a new free booking may be accepted.
 * - block: the student's attended/completed sessions plus upcoming bookings already reach the allowance.
 * - review: accepted, but a possibly-related record would put the family over the limit, so it is flagged.
 * - allow: everything else, including a repeat of a booking that already exists (the caller dedupes it).
 */
export function decideFreeAccess({
  kind,
  applicant,
  bookingKey,
  records,
  exceptions,
  today,
}: {
  kind: FreeAccessKind
  applicant: Identity
  bookingKey: string
  records: UsageRecord[]
  exceptions: AccessException[]
  /** ISO date in New York. */
  today: string
}): FreeAccessDecision {
  const allowance =
    FREE_ACCESS_LIMITS[kind] +
    exceptions.filter((e) => matchIdentity(applicant, e) === "same").reduce((sum, e) => sum + Math.max(0, e.extraAllowance), 0)

  let used = 0
  let held = 0
  let uncertainSlots = 0
  const relatedIds: number[] = []

  for (const record of records) {
    const match = matchIdentity(applicant, record)
    if (match === "different") continue
    if (match === "same" && record.key === bookingKey) {
      return { outcome: "allow", allowance, used: 0, held: 0, remaining: allowance, relatedIds: [] }
    }
    const slot = occupiesSlot(kind, record, today)
    if (match === "same") {
      if (slot === "used") used++
      else if (slot === "held") held++
    } else if (slot) {
      uncertainSlots++
      relatedIds.push(record.id)
    }
  }

  const remaining = Math.max(0, allowance - used - held)
  const base = { allowance, used, held, remaining, relatedIds }
  if (used >= allowance) return { ...base, outcome: "block", reason: "limit_reached" }
  if (used + held >= allowance) return { ...base, outcome: "block", reason: "upcoming_bookings" }
  if (used + held + uncertainSlots >= allowance) return { ...base, outcome: "review", reason: "possible_duplicate" }
  return { ...base, outcome: "allow" }
}

const NOUN: Record<FreeAccessKind, { plural: string; verb: string }> = {
  sunday_class: { plural: "free Sunday classes", verb: "attended" },
  diagnostic: { plural: "free diagnostic assessments", verb: "completed" },
}

/** Shown to the parent when a booking is declined. The forms add AhmedPrep's call/text link after it. */
export function limitMessage(kind: FreeAccessKind, reason: FreeAccessDecision["reason"]) {
  const { plural, verb } = NOUN[kind]
  return reason === "upcoming_bookings"
    ? `Thank you for your interest! Our records show this student is already registered for the maximum of two ${plural}, so we can’t add another right now. If you need to change a booking, or believe this is a mistake, please contact us and we’ll gladly help.`
    : `Thank you for your interest! Our records show this student has already ${verb} the two ${plural} included in our free program. We’d love to keep working together — please contact us about enrollment options, or if you believe this is a mistake.`
}
