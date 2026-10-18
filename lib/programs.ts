import { FREE_CLASS } from "@/lib/free-class"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"

export type ProgramId = "free_diagnostic" | "free_sunday" | "shsat" | "digital_sat" | "private_tutoring" | "intensive"

export type Program = {
  id: ProgramId
  name: string
  href: string
  summary: string
  audience: string
  format: string
  benefits: string[]
  schedule?: string
  /** Only fill in with pricing AhmedPrep has confirmed. `null` shows a contact CTA instead. */
  price: string | null
  priceNote?: string
  cta: { label: string; href: string }
}

const DIAGNOSTIC_CTA = { label: "Book Free Diagnostic", href: "/free-diagnostic" }
const CONTACT_CTA = { label: "Contact AhmedPrep", href: "/contact" }

export const PROGRAMS: Program[] = [
  {
    id: "free_diagnostic",
    name: "Free Diagnostic",
    href: "/free-diagnostic",
    summary: "A focused starting-point assessment for SHSAT or Digital SAT students.",
    audience: "Any student considering SHSAT or Digital SAT preparation.",
    format: "In person in Astoria, Queens, with a review of strengths and gaps afterward.",
    benefits: ["Shows where the student stands today", "Identifies the skills to work on first", "No obligation to enroll"],
    schedule: "Scheduled with each family after you submit a request.",
    price: "Free",
    cta: DIAGNOSTIC_CTA,
  },
  {
    id: "free_sunday",
    name: "Free Sunday Classes",
    href: FREE_CLASS.path,
    summary: "A free weekly live class that alternates between SHSAT and Digital SAT topics.",
    audience: "SHSAT and Digital SAT students who want structured weekly practice.",
    format: `Live online, taught by ${FREE_CLASS.instructor}. RSVP required.`,
    benefits: ["One focused topic each week", "Strategy and worked examples", "A low-pressure way to meet AhmedPrep"],
    schedule: `Sundays, ${FREE_CLASS.timeLabel}`,
    price: "Free",
    cta: { label: "Reserve a Free Seat", href: `${FREE_CLASS.path}#rsvp` },
  },
  {
    id: "shsat",
    name: "SHSAT Preparation",
    href: "/shsat",
    summary: "Math and ELA preparation for NYC Specialized High Schools admissions.",
    audience: "NYC students preparing for the SHSAT, typically in grades 7 and 8.",
    format: "Small-group and individual instruction in Astoria, Queens and online.",
    benefits: ["Diagnostic-based plan", "Targeted Math and ELA instruction", "Timed practice on the computer-adaptive format"],
    price: null,
    cta: DIAGNOSTIC_CTA,
  },
  {
    id: "digital_sat",
    name: "Digital SAT Preparation",
    href: "/digital-sat",
    summary: "Reading & Writing and Math preparation for the adaptive Digital SAT.",
    audience: "High school students preparing for the Digital SAT.",
    format: "Small-group and individual instruction in Astoria, Queens and online.",
    benefits: ["Starts from a baseline practice score", "Desmos and adaptive-test strategy", "Practice testing with score analysis"],
    price: null,
    cta: DIAGNOSTIC_CTA,
  },
  {
    id: "private_tutoring",
    name: "Private Tutoring",
    href: "/contact",
    summary: "One-on-one sessions built entirely around a single student.",
    audience: "Students who need a fully individual schedule, pace, or focus.",
    format: "One-on-one, in person in Astoria, Queens or online.",
    benefits: ["Instruction paced to one student", "Flexible scheduling", "Direct access to the instructor"],
    price: null,
    cta: CONTACT_CTA,
  },
  {
    id: "intensive",
    name: "Seasonal Intensives",
    href: INTENSIVE_PATH,
    summary: "Short, high-volume programs before major test dates.",
    audience: "Students in the final weeks before an official test.",
    format: "Live classes with timed practice and strategy review.",
    benefits: ["Concentrated practice before test day", "Full-length timed sections", "Final strategy review"],
    schedule: "2026 SHSAT Final Intensive: classes in progress, Oct. 12–Nov. 12, 2026 · Late enrollment open",
    price: "$800",
    priceNote: "Prorated tuition for 48 remaining hours when starting Oct. 19, based on hours remaining. Original tuition: $1,000 for 60 hours.",
    cta: { label: "View the 2026 Intensive", href: INTENSIVE_PATH },
  },
]

export function getProgram(id: ProgramId) {
  return PROGRAMS.find((p) => p.id === id)
}
