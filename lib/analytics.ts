import { track } from "@vercel/analytics"

export const GA_MEASUREMENT_ID = "G-1MHTHWWWCV"

/**
 * Conversion event names, sent to GA4 (gtag), the dataLayer, and Vercel Analytics.
 */
export const EVENTS = {
  diagnosticFormStarted: "free_diagnostic_start",
  diagnosticFormSubmitted: "free_diagnostic_submit",
  consultationStarted: "consultation_start",
  consultationSubmitted: "consultation_submit",
  phoneClick: "phone_click",
  textClick: "text_click",
  shsatIntensiveClick: "shsat_intensive_click",
  shsatIntensiveLead: "shsat_intensive_lead",
  enrollment2027Lead: "enrollment_2027_lead",
  shsatCtaClick: "shsat_cta_click",
  digitalSatCtaClick: "digital_sat_cta_click",
  diagnosticCtaClick: "diagnostic_cta_click",
  referralSubmitted: "referral_submitted",
  sundayClassCtaClick: "sunday_class_cta_click",
  sundayClassView: "sunday_class_view",
  sundayClassRsvpStarted: "sunday_class_rsvp_start",
  sundayClassRsvpSubmitted: "sunday_class_rsvp_submit",
  resultsCtaClick: "results_cta_click",
  programCtaClick: "program_cta_click",
  toolOpen: "tool_open",
  readinessQuizStarted: "readiness_quiz_start",
  readinessQuizCompleted: "readiness_quiz_complete",
  satGoalPlanCreated: "sat_goal_plan_create",
  teachingVideoPlay: "teaching_video_play",
  googleReviewClick: "google_review_click",
  studentLoginClick: "student_login_click",
  weeklyPracticeView: "weekly_practice_view",
  weeklyPracticeAnswerClick: "weekly_practice_answer_click",
  weeklyPracticeSundayCta: "weekly_practice_sunday_cta",
  weeklyPracticeDiagnosticCta: "weekly_practice_diagnostic_cta",
  practiceLibraryView: "shsat_practice_library_view",
  officialShsatTestClick: "official_shsat_test_click",
  shsatMathPracticeClick: "shsat_math_practice_click",
  shsatElaPracticeClick: "shsat_ela_practice_click",
  weeklyPracticeClick: "weekly_practice_click",
  practiceDiagnosticCta: "practice_diagnostic_cta",
  practiceSundayCta: "practice_sunday_cta",
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]
export type EventProps = Record<string, string | number | boolean | null>

type TrackingWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (command: "event", name: string, params?: EventProps) => void
}

const PII_KEYS = /name|email|phone|address|message|goal|school/i
const CONTACT_HREF = /^(tel:|sms:|mailto:)/i

/** Strips anything that could identify a visitor before it leaves the browser. */
function sanitize(props: EventProps): EventProps {
  const safe: EventProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (PII_KEYS.test(key)) continue
    if (key === "href" && typeof value === "string" && CONTACT_HREF.test(value)) {
      safe.link_type = value.slice(0, value.indexOf(":"))
      continue
    }
    safe[key] = value
  }
  return safe
}

export function trackEvent(name: EventName, props: EventProps = {}) {
  if (typeof window === "undefined") return
  const params = sanitize(props)
  try {
    track(name, params)
  } catch {
    // Analytics must never interrupt the visitor's action.
  }
  const w = window as TrackingWindow
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params)
  } else {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: name, ...params })
  }
}
