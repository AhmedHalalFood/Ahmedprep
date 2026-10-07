import { track } from "@vercel/analytics"

/**
 * Conversion event names. Map these in Google Analytics / Google Ads (via GTM dataLayer or gtag)
 * when those tools are installed. Vercel Analytics receives them automatically in production.
 */
export const EVENTS = {
  diagnosticFormStarted: "diagnostic_form_started",
  diagnosticFormSubmitted: "diagnostic_form_submitted",
  phoneClick: "phone_click",
  textClick: "text_click",
  shsatCtaClick: "shsat_cta_click",
  digitalSatCtaClick: "digital_sat_cta_click",
  diagnosticCtaClick: "diagnostic_cta_click",
  referralSubmitted: "referral_submitted",
  freeShsatClassCtaClicked: "free_shsat_class_cta_clicked",
  freeShsatClassRsvpStarted: "free_shsat_class_rsvp_started",
  freeShsatClassRsvpSubmitted: "free_shsat_class_rsvp_submitted",
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]
export type EventProps = Record<string, string | number | boolean | null>

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[]
  gtag?: (command: "event", name: string, params?: EventProps) => void
}

export function trackEvent(name: EventName, props: EventProps = {}) {
  if (typeof window === "undefined") return
  try {
    track(name, props)
  } catch {
    // Analytics must never interrupt the visitor's action.
  }
  const w = window as TrackingWindow
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: name, ...props })
  if (typeof w.gtag === "function") w.gtag("event", name, props)
}
