export type Campaign = {
  id: string
  enabled: boolean
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  /** Use "#diagnostic" to scroll to the form on the current page, or a path such as "/shsat#diagnostic". */
  href: string
  program?: "SHSAT" | "Digital SAT"
}

/**
 * Seasonal promotions. To change the banner, edit the active campaign or set ACTIVE_CAMPAIGN_ID
 * to another entry. Keep exam dates out of permanent copy so the banner never goes stale.
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: "shsat-final-countdown",
    enabled: true,
    eyebrow: "Seasonal program",
    title: "SHSAT Final Countdown",
    body: "November SHSAT preparation is underway. Get a diagnostic assessment and targeted final preparation before test day.",
    ctaLabel: "Reserve Your Diagnostic",
    href: "/shsat#diagnostic",
    program: "SHSAT",
  },
  {
    id: "digital-sat-intensive",
    enabled: true,
    eyebrow: "Seasonal program",
    title: "Digital SAT Intensive",
    body: "Focused Math and Reading & Writing review with full-length adaptive practice before test day.",
    ctaLabel: "Reserve Your Diagnostic",
    href: "/digital-sat#diagnostic",
    program: "Digital SAT",
  },
  {
    id: "summer-shsat-prep",
    enabled: true,
    eyebrow: "Summer program",
    title: "Summer SHSAT Prep",
    body: "Use the summer to build Math and ELA foundations before the school year gets busy.",
    ctaLabel: "Reserve Your Diagnostic",
    href: "/shsat#diagnostic",
    program: "SHSAT",
  },
  {
    id: "fall-shsat-prep",
    enabled: true,
    eyebrow: "Fall program",
    title: "Fall SHSAT Prep",
    body: "Structured weekly preparation, timed practice, and progress reviews through the fall.",
    ctaLabel: "Reserve Your Diagnostic",
    href: "/shsat#diagnostic",
    program: "SHSAT",
  },
  {
    id: "sat-spring-intensive",
    enabled: true,
    eyebrow: "Spring program",
    title: "SAT Spring Intensive",
    body: "Targeted spring preparation built around a diagnostic and a clear score goal.",
    ctaLabel: "Reserve Your Diagnostic",
    href: "/digital-sat#diagnostic",
    program: "Digital SAT",
  },
]

export const ACTIVE_CAMPAIGN_ID: string | null = "shsat-final-countdown"

export function getActiveCampaign() {
  return CAMPAIGNS.find((c) => c.id === ACTIVE_CAMPAIGN_ID && c.enabled) ?? null
}
