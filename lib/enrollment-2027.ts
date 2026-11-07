/**
 * January 2027 enrollment details approved by AhmedPrep.
 * Start dates and cohort schedules approved in AhmedPrep 2027 Master Plan v3.0.
 */
export const ENROLLMENT_2027 = {
  eyebrow: "January 2027 Enrollment",
  launchNote:
    "Approved start dates are shown below. Each group receives 72 hours of scheduled live instruction over 12 weeks, with holiday makeup sessions as published. If AhmedPrep cancels a scheduled class, we will provide a makeup class or equivalent live instruction at no additional cost.",
  datesStatus: "confirmed" as "planned" | "confirmed",
  weeks: 12,
  hours: 72,
  hoursLabel: "72 hours of scheduled live instruction",
  maxClassSize: 12,
  location: "Astoria",
  requestHref: "/enroll-2027",
  diagnosticHref: "#diagnostic",
  intensive2026Href: "/shsat-final-intensive-2026",
  availabilityStatus: "Enrollment inquiries open — Seats limited to 12 per class.",
  tuition: {
    founding: {
      label: "Founding-Family",
      total: "$1,080",
      savingsLabel: "Save $360",
      summary:
        "Save $360. First 5 fully paid enrollments per class. Full payment by the cohort-specific founding-family deadline (42 days before the first class), or before all 5 founding-family seats are filled, whichever comes first.",
      points: [
        "Save $360 off regular tuition",
        "Limited to the first 5 fully paid enrollments per class",
        "Full payment by the cohort-specific deadline: November 28 (weekend SHSAT or Digital SAT), November 30 (weekday SHSAT), or December 1 (weekday Digital SAT), 2026; first five fully paid seats per cohort only",
      ],
      note: "Limited to the first 5 fully paid enrollments in each class.",
    },
    early: {
      label: "Early Full Payment",
      total: "$1,296",
      savingsLabel: "10% off",
      summary: "10% discount. Full payment is due by the cohort-specific early-payment deadline, 21 days after its founding-family deadline: December 19 (weekend SHSAT or Digital SAT), December 21 (weekday SHSAT), or December 22 (weekday Digital SAT), 2026.",
      points: ["10% discount ($144 off)", "Full payment by December 19 (weekend groups), December 21 (weekday SHSAT), or December 22 (weekday Digital SAT), 2026"],
    },
    regular: {
      label: "Regular Tuition",
      total: "$1,440",
      savingsLabel: null,
      summary: "Full payment is required before the student’s first scheduled class.",
      points: ["Full payment is required before the student’s first scheduled class"],
    },
    rules: "Discounts cannot be combined. Payment and installment terms will be confirmed before payment is requested.",
    seatNote: "Enrollment is subject to available seats. An inquiry does not reserve a seat.",
  },
  steps: [
    { title: "Submit a free enrollment inquiry", body: "Tell us about your child and the class you prefer. It takes about two minutes." },
    { title: "We confirm availability and send payment instructions.", body: "AhmedPrep contacts you to confirm availability, class dates, and tuition." },
    { title: "Enrollment is confirmed after full payment", body: "Your seat is confirmed once full payment is verified and accepted." },
  ],
  programs: [
    {
      id: "shsat",
      name: "SHSAT Prep",
      kicker: "Specialized High School admissions",
      body: "Math and ELA preparation for the NYC Specialized High Schools Admissions Test, built around each student’s diagnostic results.",
      href: "/shsat",
      schedules: [
        { label: "Weekday group", days: "Monday & Wednesday", time: "5:30–8:30 PM ET", start: "Monday, January 11, 2027" },
        { label: "Weekend group", days: "Saturday & Sunday", time: "10 AM–1 PM ET", start: "Saturday, January 9, 2027" },
      ],
    },
    {
      id: "digital-sat",
      name: "Digital SAT Prep",
      kicker: "College admissions testing",
      body: "Reading & Writing and Math preparation for the adaptive Digital SAT, including Desmos and pacing strategy.",
      href: "/digital-sat",
      schedules: [
        { label: "Weekday group", days: "Tuesday & Thursday", time: "5:30–8:30 PM ET", start: "Tuesday, January 12, 2027" },
        { label: "Weekend group", days: "Saturday & Sunday", time: "2–5 PM ET", start: "Saturday, January 9, 2027" },
      ],
    },
  ],
  included: [
    { title: "Original practice materials", body: "Problem sets and practice written for AhmedPrep students." },
    { title: "Personalized feedback", body: "Specific notes on what each student should practice next." },
    { title: "Progress tracking", body: "Regular check-ins so families can see where skills are improving." },
    { title: "Small classes", body: "No more than 12 students in a class." },
    { title: "Makeup classes", body: "If AhmedPrep cancels a scheduled class, we will provide a makeup class or equivalent live instruction at no additional cost." },
    { title: "Instructor accessibility", body: "Families can reach the instructor with questions between classes." },
  ],
} as const

export const ENROLLMENT_2027_NAME = "January 2027 Enrollment"
export const SCHEDULE_UNSURE = "Not sure yet"
export const GRADES_2027 = ["6th grade", "7th grade", "8th grade", "9th grade", "10th grade", "11th grade", "12th grade", "Other"]
export const FOUNDING_INTEREST_OPTIONS = [
  "Yes, please tell me if founding-family tuition is available",
  "No, regular tuition is fine",
  "Not sure yet",
] as const

export type Program2027 = (typeof ENROLLMENT_2027.programs)[number]

export const programByName = (name: string): Program2027 | undefined =>
  ENROLLMENT_2027.programs.find((p) => p.name === name)

/** One readable line per group, e.g. "Weekday group: Monday & Wednesday, 5:30–8:30 PM ET". */
export const scheduleLabel = (s: Program2027["schedules"][number]) => `${s.label}: ${s.days}, ${s.time}`

/** e.g. "Planned start: Monday, January 11, 2027". Drops "Planned" once dates are confirmed. */
export const startLabel = (s: Program2027["schedules"][number]) =>
  `${ENROLLMENT_2027.datesStatus === "planned" ? "Planned start" : "Starts"}: ${s.start}`

/** The schedule choices valid for a program. The server accepts only these values. */
export const scheduleOptionsFor = (programName: string): string[] => {
  const program = programByName(programName)
  return program ? [...program.schedules.map(scheduleLabel), SCHEDULE_UNSURE] : []
}

/**
 * Only an explicit "sent" from the server confirms the parent's email. A failed or skipped send, and a repeat
 * submission (saved earlier, so nothing is sent again), are reported as received but unconfirmed.
 */
export function inquiryReceivedMessage(result: unknown, parentName: string, email: string, name: string = ENROLLMENT_2027_NAME) {
  const confirmed =
    typeof result === "object" && result !== null && (result as { confirmation?: unknown }).confirmation === "sent"
  return {
    confirmed,
    text: confirmed
      ? `Thank you, ${parentName}. We received your ${name} inquiry and sent a confirmation to ${email}.`
      : `Thank you, ${parentName}. We received your ${name} inquiry, but we could not confirm that a confirmation email was sent to ${email}.`,
  }
}

export const ENROLLMENT_DISCLAIMER =
  "Submitting this form is an inquiry only. It does not guarantee a seat or reserve founding-family tuition, and no payment is taken. AhmedPrep will contact you to confirm availability, class dates, and tuition."
