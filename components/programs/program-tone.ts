import type { ProgramId } from "@/lib/cohorts-2027"

/** SHSAT is always blue and Digital SAT is always green across class selection and enrollment. */
export const PROGRAM_TONE: Record<
  ProgramId,
  { subjects: string; selected: string; ring: string; badge: string; text: string; soft: string; border: string; page: string }
> = {
  SHSAT: {
    subjects: "Math and ELA",
    selected: "border-brand bg-brand-soft",
    ring: "ring-2 ring-brand",
    badge: "bg-brand text-paper",
    text: "text-brand",
    soft: "bg-brand-soft",
    border: "border-brand",
    page: "/shsat-prep",
  },
  "Digital SAT": {
    subjects: "Math and Reading & Writing",
    selected: "border-sage bg-sage-soft",
    ring: "ring-2 ring-sage",
    badge: "bg-sage text-paper",
    text: "text-sage-deep",
    soft: "bg-sage-soft",
    border: "border-sage",
    page: "/digital-sat-prep",
  },
}

export const NEUTRAL_TONE = { selected: "border-navy bg-cream", ring: "ring-2 ring-navy", badge: "bg-navy text-paper" }
