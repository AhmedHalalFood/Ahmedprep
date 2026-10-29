/**
 * January 2027 enrollment details approved by AhmedPrep.
 * Start dates are planned and stay labelled as such until the final calendar is approved.
 */
export const ENROLLMENT_2027 = {
  eyebrow: "January 2027 Enrollment",
  launchNote:
    "Planned start dates are shown below and will be confirmed once the final calendar is approved. Each group receives 72 hours of instruction over 12 weeks, with makeup classes for any cancellations.",
  datesStatus: "planned" as "planned" | "confirmed",
  weeks: 12,
  hours: 72,
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
        "Save $360. First 5 fully paid enrollments per class. Full payment by December 5, 2026, or before all 5 founding-family seats are filled, whichever comes first.",
      points: [
        "Save $360 off regular tuition",
        "Limited to the first 5 fully paid enrollments per class",
        "Full payment by December 5, 2026, or before all 5 founding-family seats are filled, whichever comes first",
      ],
      note: "Limited to the first 5 fully paid enrollments in each class.",
    },
    early: {
      label: "Early Full Payment",
      total: "$1,296",
      savingsLabel: "10% off",
      summary: "10% discount. Full payment must be received by December 26, 2026.",
      points: ["10% discount ($144 off)", "Full payment must be received by December 26, 2026"],
    },
    regular: {
      label: "Regular Tuition",
      total: "$1,440",
      savingsLabel: null,
      summary: "Full payment must be received by January 5, 2027.",
      points: ["Full payment must be received by January 5, 2027"],
    },
    rules: "Discounts cannot be combined. No installment plans for any option.",
    seatNote: "Enrollment is subject to available seats. An inquiry does not reserve a seat.",
  },
  steps: [
    { title: "Submit a free enrollment inquiry", body: "Tell us about your child and the class you prefer. It takes about two minutes." },
    { title: "We confirm your seat and send payment instructions", body: "AhmedPrep contacts you to confirm availability, class dates, and tuition." },
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
        { label: "Weekend group", days: "Saturday & Sunday", time: "10 AM–1 PM ET", start: "Saturday, January 16, 2027" },
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
        { label: "Weekend group", days: "Saturday & Sunday", time: "2–5 PM ET", start: "Saturday, January 16, 2027" },
      ],
    },
  ],
  included: [
    { title: "Original practice materials", body: "Problem sets and practice written for AhmedPrep students." },
    { title: "Personalized feedback", body: "Specific notes on what each student should practice next." },
    { title: "Progress tracking", body: "Regular check-ins so families can see where skills are improving." },
    { title: "Small classes", body: "No more than 12 students in a class." },
    { title: "Makeup classes", body: "If a class is cancelled, a makeup class is scheduled so every group still receives 72 hours." },
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

export const ENROLLMENT_DISCLAIMER =
  "Submitting this form is an inquiry only. It does not guarantee a seat or reserve founding-family tuition, and no payment is taken. AhmedPrep will contact you to confirm availability, class dates, and tuition."
