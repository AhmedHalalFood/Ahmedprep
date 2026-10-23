/**
 * January 2027 enrollment details approved by AhmedPrep.
 * Exact calendar dates are intentionally absent until they are confirmed.
 */
export const ENROLLMENT_2027 = {
  eyebrow: "January 2027 Enrollment",
  launchNote: "Planned January 2027 launch. Exact class dates will be confirmed before enrollment begins.",
  weeks: 12,
  hours: 72,
  maxClassSize: 10,
  requestHref: "/contact#contact",
  diagnosticHref: "#diagnostic",
  intensive2026Href: "/shsat-final-intensive-2026",
  tuition: {
    regular: { label: "Regular tuition", total: "$1,440", installments: "or 3 installments of $480" },
    founding: {
      label: "Founding-family tuition",
      total: "$1,080",
      installments: "or 3 installments of $360",
      note: "Limited availability. Ask us whether founding-family tuition is still open when you request enrollment information.",
    },
  },
  programs: [
    {
      id: "shsat",
      name: "SHSAT Prep",
      kicker: "Specialized High School admissions",
      body: "Math and ELA preparation for the NYC Specialized High Schools Admissions Test, built around each student’s diagnostic results.",
      href: "/shsat",
      schedules: [
        { label: "Weekday group", days: "Monday & Wednesday", time: "5–8 PM ET" },
        { label: "Weekend group", days: "Saturday & Sunday", time: "10 AM–1 PM ET" },
      ],
    },
    {
      id: "digital-sat",
      name: "Digital SAT Prep",
      kicker: "College admissions testing",
      body: "Reading & Writing and Math preparation for the adaptive Digital SAT, including Desmos and pacing strategy.",
      href: "/digital-sat",
      schedules: [
        { label: "Weekday group", days: "Tuesday & Thursday", time: "5–8 PM ET" },
        { label: "Weekend group", days: "Saturday & Sunday", time: "2–5 PM ET" },
      ],
    },
  ],
  included: [
    { title: "Original practice materials", body: "Problem sets and practice written for AhmedPrep students." },
    { title: "Personalized feedback", body: "Specific notes on what each student should practice next." },
    { title: "Progress tracking", body: "Regular check-ins so families can see where skills are improving." },
    { title: "Small classes", body: "No more than 10 students in a class." },
    { title: "Instructor accessibility", body: "Families can reach the instructor with questions between classes." },
  ],
} as const
