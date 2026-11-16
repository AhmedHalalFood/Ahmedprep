/**
 * Digital SAT Final Intensive (December 5, 2026 SAT). Pure schedule and pricing rules shared by the
 * calculator, the registration form, the server-side validation, the emails and the tests.
 * The server always recomputes everything here from the selected date; nothing price-related is trusted from the browser.
 */

export const SAT_INTENSIVE_PATH = "/digital-sat-final-intensive-december-2026"
export const SAT_INTENSIVE_PROGRAM_KEY = "sat-final-intensive-dec-2026"
export const SAT_INTENSIVE_NAME = "AhmedPrep Digital SAT Final Intensive"
export const SAT_TEST_DATE_ISO = "2026-12-05"
export const SAT_TEST_DATE_LABEL = "December 5, 2026"

export const CLASS_TIMEZONE = "America/New_York"
export const CLASS_START_TIME = "18:00"
export const CLASS_TIME_LABEL = "6:00–9:00 PM Eastern"
export const HOURS_PER_CLASS = 3
export const PRICE_PER_CLASS_CENTS = 7500
export const SAT_INTENSIVE_CAPACITY = 12
/** How long an unpaid registration holds a seat before it is released to other families. */
export const PAYMENT_HOLD_MINUTES = 20

/** Monday–Thursday, Nov 16 – Dec 3, 2026. No class Thursday Nov 26 (Thanksgiving). */
export const CLASS_DATES = [
  "2026-11-16",
  "2026-11-17",
  "2026-11-18",
  "2026-11-19",
  "2026-11-23",
  "2026-11-24",
  "2026-11-25",
  "2026-11-30",
  "2026-12-01",
  "2026-12-02",
  "2026-12-03",
] as const

export type ClassDate = (typeof CLASS_DATES)[number]

export const GRADE_OPTIONS = ["9th grade", "10th grade", "11th grade", "12th grade", "Other"] as const

export const SAT_REGISTRATION_OPTIONS = [
  { value: "registered", label: "Yes, registered for the December 5, 2026 SAT" },
  { value: "not_yet", label: "Not registered yet" },
  { value: "unsure", label: "Not sure" },
] as const

export type SatRegistrationStatus = (typeof SAT_REGISTRATION_OPTIONS)[number]["value"]

export const TIMELINE = [
  {
    range: "November 16–25",
    classes: 7,
    focus: "Foundational review, high-yield skills, and targeted practice.",
  },
  {
    range: "November 30–December 3",
    classes: 4,
    focus: "Timed practice, error correction, and final exam preparation.",
  },
] as const

export function isClassDate(value: unknown): value is ClassDate {
  return typeof value === "string" && (CLASS_DATES as readonly string[]).includes(value)
}

export type TuitionQuote = {
  firstClassDate: ClassDate
  remainingDates: ClassDate[]
  remainingClasses: number
  remainingHours: number
  tuitionCents: number
}

export function quoteFor(firstClassDate: ClassDate): TuitionQuote {
  const remainingDates = CLASS_DATES.filter((d) => d >= firstClassDate)
  return {
    firstClassDate,
    remainingDates,
    remainingClasses: remainingDates.length,
    remainingHours: remainingDates.length * HOURS_PER_CLASS,
    tuitionCents: remainingDates.length * PRICE_PER_CLASS_CENTS,
  }
}

/** Wall-clock date and time in New York, formatted "YYYY-MM-DD HH:MM" so it compares as a string. */
export function newYorkWallClock(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: CLASS_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`
}

/** A class can be chosen as a first class until its 6:00 PM Eastern start time. */
export function hasClassStarted(date: ClassDate, now: Date) {
  return newYorkWallClock(now) >= `${date} ${CLASS_START_TIME}`
}

export function availableStartDates(now: Date): ClassDate[] {
  return CLASS_DATES.filter((d) => !hasClassStarted(d, now))
}

export const formatUsd = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 })

const parseIso = (iso: string) => new Date(`${iso}T12:00:00Z`)

export const formatClassDate = (iso: string) =>
  parseIso(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })

export const formatClassDateLong = (iso: string) =>
  parseIso(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

export const WHAT_TO_BRING = [
  "Your own fully charged laptop and charger, with the College Board Bluebook app installed if possible",
  "A graphing or scientific calculator, if your student uses one",
  "Pencils and scratch paper",
  "Any recent SAT or PSAT score report",
  "A water bottle and a light snack",
] as const

/**
 * AhmedPrep has not yet approved written refund, withdrawal or cancellation terms for this program. While this is
 * null the form shows no policy checkbox and no policy terms; once approved text is supplied it becomes a required
 * acknowledgment.
 */
export const APPROVED_REFUND_POLICY: string | null = null
export const POLICY_PENDING_NOTE =
  "AhmedPrep’s refund, withdrawal and cancellation terms for this program will be provided before tuition is collected."

export const PAYMENT_METHODS = ["zelle", "cash", "check"] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = { zelle: "Zelle", cash: "Cash", check: "Check" }
export const isPaymentMethod = (value: string): value is PaymentMethod => (PAYMENT_METHODS as readonly string[]).includes(value)

export const OFFLINE_PAYMENT_STATEMENT = "Pay by Zelle, cash, or check. Enrollment is confirmed after payment verification."
export const REGISTRATION_RECEIVED_STATEMENT =
  "Registration received. Your seat will be confirmed after AhmedPrep verifies your tuition payment."
export const PENDING_SEAT_STATEMENT = "Your registration is pending payment verification. Your seat is not confirmed yet."

/** No recipient, account or payee details are shown until AhmedPrep supplies and approves them. */
export const PAYMENT_METHOD_INSTRUCTIONS: Record<PaymentMethod, string> = {
  zelle: "AhmedPrep will contact you directly with Zelle payment instructions. Please do not send a payment until you receive them from AhmedPrep.",
  cash: "Payment arrangements can be made with AhmedPrep at the classroom. Contact AhmedPrep to arrange a time before the first class.",
  check: "Payment arrangements can be made with AhmedPrep at the classroom. Contact AhmedPrep for check details before writing a check.",
}

export type RegistrationInput = {
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  firstClassDate: string
  paymentMethod: string
  previousScore: string
  targetScore: string
  satRegistration: string
  /** The family confirms the approved tuition terms (seat confirmed only after full payment is verified). */
  policyAcknowledged: boolean
}

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SCORE_PATTERN = /^\d{3,4}$/

export function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits
}

function scoreError(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (!SCORE_PATTERN.test(trimmed)) return "Enter a score as a number, for example 1250."
  const score = Number(trimmed)
  return score < 320 || score > 1600 ? "SAT and PSAT scores are between 320 and 1600." : undefined
}

/** Used by both the browser form and the server; the server additionally checks the date against the current time. */
export function validateRegistration(input: RegistrationInput, now: Date): RegistrationErrors {
  const errors: RegistrationErrors = {}
  const text = (v: string, max: number) => v.trim().length > 0 && v.trim().length <= max
  if (!text(input.studentName, 120)) errors.studentName = "Enter the student’s full name."
  if (!(GRADE_OPTIONS as readonly string[]).includes(input.studentGrade)) errors.studentGrade = "Select the student’s grade."
  if (!text(input.parentName, 120)) errors.parentName = "Enter the parent or guardian’s full name."
  if (!EMAIL_PATTERN.test(input.parentEmail.trim()) || input.parentEmail.length > 200)
    errors.parentEmail = "Enter a valid email address."
  if (phoneDigits(input.parentPhone).length !== 10) errors.parentPhone = "Enter a 10-digit U.S. phone number."
  if (!isClassDate(input.firstClassDate)) errors.firstClassDate = "Select the student’s first class date."
  else if (hasClassStarted(input.firstClassDate, now))
    errors.firstClassDate = "That class has already started. Please choose an upcoming class date."
  const previous = scoreError(input.previousScore)
  if (previous) errors.previousScore = previous
  const target = scoreError(input.targetScore)
  if (target) errors.targetScore = target
  if (!SAT_REGISTRATION_OPTIONS.some((o) => o.value === input.satRegistration))
    errors.satRegistration = "Tell us whether the student is registered for the December 5 SAT."
  if (!isPaymentMethod(input.paymentMethod)) errors.paymentMethod = "Choose how you plan to pay: Zelle, cash, or check."
  if (!input.policyAcknowledged) errors.policyAcknowledged = "Please confirm that you understand how tuition and seat confirmation work."
  return errors
}

/** Launch registration: an inquiry only. Nothing is reserved, held, or charged when it is submitted. */
export const INQUIRY_RECEIVED_STATEMENT =
  "Registration request received. AhmedPrep will contact you to confirm availability and arrange payment."
export const INQUIRY_PAYMENT_STATEMENT =
  "Payment is accepted by Zelle, cash, or check after instructions are confirmed directly with AhmedPrep. No card payments are taken on this website."
export const INQUIRY_NOT_RESERVED_STATEMENT =
  "Submitting this form does not reserve or confirm a seat. Seats are limited to 12 students."

export type InquiryInput = Pick<
  RegistrationInput,
  "studentName" | "studentGrade" | "parentName" | "parentEmail" | "parentPhone" | "firstClassDate" | "paymentMethod"
>
export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>

/** Used by both the browser form and the server; the server's clock decides which start dates are still open. */
export function validateInquiry(input: InquiryInput, now: Date): InquiryErrors {
  const all = validateRegistration(
    { ...input, previousScore: "", targetScore: "", satRegistration: SAT_REGISTRATION_OPTIONS[0].value, policyAcknowledged: true },
    now,
  )
  const errors: InquiryErrors = {}
  for (const key of ["studentName", "studentGrade", "parentName", "parentEmail", "parentPhone", "firstClassDate", "paymentMethod"] as const) {
    if (all[key]) errors[key] = all[key]
  }
  if (errors.paymentMethod) errors.paymentMethod = "Choose your preferred payment method: Zelle, cash, or check."
  return errors
}

/** Public promotion (sitemap, homepage, Digital SAT page) runs while at least one class has not started. */
export const isSatIntensiveEnrollmentOpen = (now = new Date()) => availableStartDates(now).length > 0

const DAY_MS = 86_400_000

/** Promotion urgency derived only from the class calendar and the exam date, never from enrollment numbers. */
export function satIntensiveUrgency(now = new Date()) {
  const open = availableStartDates(now)
  const next = open[0]
  if (!next) return null
  const today = newYorkWallClock(now).slice(0, 10)
  const daysToExam = Math.round((Date.parse(`${SAT_TEST_DATE_ISO}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS)
  const isFirstClass = next === CLASS_DATES[0]
  const when = next === today ? "tonight at 6 PM" : `${formatClassDate(next)}, 6 PM`
  return {
    quote: quoteFor(next),
    isFirstClass,
    daysToExam,
    examCountdown: `December 5 SAT is ${daysToExam} ${daysToExam === 1 ? "day" : "days"} away`,
    nextClassLabel: `${isFirstClass ? "Classes begin" : "Next class"} ${when}`,
  }
}

/** Same student + same parent email is one enrollment, regardless of capitalisation or extra spaces. */
export function studentKey(parentEmail: string, studentName: string) {
  return `${parentEmail.trim().toLowerCase()}|${studentName.trim().toLowerCase().replace(/\s+/g, " ")}`
}
