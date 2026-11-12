import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
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

const T = ENROLLMENT_2027.tuition
export const PRICE_2027 = "$20 per scheduled instructional hour (2027 small group)"
export const PRICE_2027_NOTE = `Winter and Spring 2027 cohorts: 72 hours, ${T.regular.total} regular tuition. Summer 2027: $1,920 weekday intensive (96 hours) or $960 weekend (48 hours). Winter 2027: founding-family tuition saves 25% for the first 5 fully paid enrollments per cohort, paid in full by December 12, 2026 at 11:59 PM ET, subject to seat availability; Winter has no separate early-payment tier. Spring and Summer 2027: early-payment tuition saves 10% when paid in full at least 30 calendar days before the selected cohort begins; there is no founding-family discount. Only one discount applies. Private tutoring is priced separately.`

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
    summary: "Free live Sunday classes in SHSAT and Digital SAT topics.",
    audience: "SHSAT and Digital SAT students who want structured, regular practice.",
    format: `Live online, taught by ${FREE_CLASS.instructor}. RSVP required.`,
    benefits: ["One focused topic each class", "Strategy and worked examples", "A low-pressure way to meet AhmedPrep"],
    schedule: "Paused until January. Resumes Sunday, January 10, 2027: every other Sunday, SHSAT (Math and ELA) 6:00–6:45 PM ET and Digital SAT (Math and Reading/Writing) 7:00–7:45 PM ET. RSVPs open December 13, 2026; RSVP separately for each class. The last class before the summer break is June 27, 2027; there are no Sunday classes in July or August 2027",
    price: "Free",
    cta: { label: "Reserve a Free Seat", href: `${FREE_CLASS.path}#rsvp` },
  },
  {
    id: "shsat",
    name: "SHSAT Preparation",
    href: "/shsat-prep",
    summary: "Math and ELA preparation for NYC Specialized High Schools admissions.",
    audience: "NYC students preparing for the SHSAT, typically in grades 7 and 8.",
    format: "Winter, Spring, and Summer 2027 small-group classes meet in person in Astoria, Queens. Private tutoring is available in person or online.",
    benefits: ["Diagnostic-based plan", "Targeted Math and ELA instruction", "Timed practice and strategy for the computer-adaptive SHSAT"],
    price: PRICE_2027,
    priceNote: PRICE_2027_NOTE,
    cta: DIAGNOSTIC_CTA,
  },
  {
    id: "digital_sat",
    name: "Digital SAT Preparation",
    href: "/digital-sat-prep",
    summary: "Reading & Writing and Math preparation for the adaptive Digital SAT.",
    audience: "High school students preparing for the Digital SAT.",
    format: "Winter, Spring, and Summer 2027 small-group classes meet in person in Astoria, Queens. Private tutoring is available in person or online.",
    benefits: ["Starts from a baseline practice score", "Desmos and adaptive-test strategy", "Practice testing with score analysis"],
    price: PRICE_2027,
    priceNote: PRICE_2027_NOTE,
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
    schedule: "SHSAT Final Intensive 2026: Oct. 12–Nov. 12, 2026, Mon–Thu, 5:00–8:00 PM Eastern from Oct. 22, in person only · Late enrollment open",
    price: "$50 per remaining class",
    priceNote: "Original program: 60 instructional hours for $1,000. Late-enrollment tuition is prorated at $50 per remaining 3-hour class; see the program page for today's total.",
    cta: { label: "View the 2026 Intensive", href: INTENSIVE_PATH },
  },
]

/** Program list with the 2026 Intensive card removed once its promotion has ended. */
export function visiblePrograms(showIntensive: boolean) {
  return showIntensive ? PROGRAMS : PROGRAMS.filter((p) => p.id !== "intensive")
}

export function getProgram(id: ProgramId) {
  return PROGRAMS.find((p) => p.id === id)
}
