import type { SourceId } from "./official-sources"

/**
 * Published updates. Every factual date here was verified by a person against the linked official source.
 * The daily source checker never edits this file; it only reports when an official page may have changed.
 *
 * Publishing workflow: review the alert, confirm on the official page, edit the update, and set `dateModified`
 * only when the substance changed. Sitemap and feed dates follow `dateModified` automatically.
 *
 * Body paragraphs support inline links written as [anchor text](/path).
 */

export const UPDATE_FILTERS = [
  { slug: "shsat", label: "SHSAT" },
  { slug: "digital-sat", label: "Digital SAT" },
  { slug: "nyc-admissions", label: "NYC Admissions" },
  { slug: "ahmedprep-programs", label: "AhmedPrep Programs" },
] as const

export type UpdateFilter = (typeof UPDATE_FILTERS)[number]["slug"]

export type UpdateTopic = "Test Dates" | "Registration" | "Practice Resources" | "Application Deadlines" | "Programs"

export type KeyDate = { label: string; date: string }

export type Update = {
  slug: string
  filter: UpdateFilter
  topic: UpdateTopic
  title: string
  metaTitle: string
  description: string
  summary: string
  keyDates: KeyDate[]
  sourceId: SourceId
  featured?: boolean
  datePublished: string
  dateModified: string
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[]
}

export const UPDATES: Update[] = [
  {
    slug: "shsat-2026-registration-closes-october-30",
    filter: "shsat",
    topic: "Registration",
    featured: true,
    title: "SHSAT Registration for the 2026 Test Closes October 30",
    metaTitle: "SHSAT Registration Closes October 30, 2026 | NYC Parent Update",
    description:
      "NYC Public Schools SHSAT registration opened October 6 and closes Friday, October 30, 2026. What 8th-grade families should confirm before the deadline.",
    summary:
      "Registration opened October 6 and closes Friday, October 30. Students who miss it cannot take the November SHSAT.",
    keyDates: [{ label: "Registration closes", date: "2026-10-30" }],
    sourceId: "nycps-high-school",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "The official deadline",
        paragraphs: [
          "According to NYC Public Schools, high school applications, LaGuardia applications, and SHSAT registration all opened on Tuesday, October 6, 2026. SHSAT registration closes on Friday, October 30, 2026.",
          "Registration is separate from the high school application, which stays open until December 4. Families should not wait for the application deadline to register for the test.",
        ],
      },
      {
        heading: "What to confirm before October 30",
        list: [
          "Your child is registered, through their school counselor or the official NYC Public Schools process.",
          "Your preference order for the eight testing Specialized High Schools. NYC Public Schools asks families to indicate this during the registration period.",
          "Any testing accommodations. NYC Public Schools asks families to confirm or request accommodations during the same registration window.",
        ],
      },
      {
        heading: "After registration",
        paragraphs: [
          "Once registration is done, the focus shifts to preparation. Our [2026 SHSAT dates guide](/resources/2026-shsat-dates-registration-deadline) explains the full fall timeline, and a [free diagnostic](/free-diagnostic) shows where your child stands in Math and ELA right now.",
          "Families looking for structured help can review our [SHSAT prep program](/shsat), the [final 5-week intensive](/shsat-final-intensive-2026), or join the [free Sunday SHSAT class](/free-sunday-classes).",
        ],
      },
    ],
  },
  {
    slug: "2026-shsat-test-dates-november",
    filter: "shsat",
    topic: "Test Dates",
    featured: true,
    title: "2026 SHSAT Test Dates: November 14, 15, 18 and 21",
    metaTitle: "2026 SHSAT Test Dates: Weekend and School-Day Schedule",
    description:
      "The 2026 SHSAT runs on weekend dates November 14, 15 and 21 and a School-Day test on November 18, per NYC Public Schools. How test dates are assigned.",
    summary:
      "Weekend testing runs November 14, 15 and 21. The School-Day SHSAT is Wednesday, November 18. Every registered student is assigned a date.",
    keyDates: [
      { label: "Weekend SHSAT", date: "2026-11-14" },
      { label: "School-Day SHSAT", date: "2026-11-18" },
    ],
    sourceId: "nycps-high-school",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "The official 2026 schedule",
        list: [
          "Weekend SHSAT: Saturday, November 14 and Sunday, November 15, 2026",
          "School-Day SHSAT: Wednesday, November 18, 2026",
          "Weekend SHSAT: Saturday, November 21, 2026",
        ],
        paragraphs: [
          "NYC Public Schools states that all registered students will be scheduled for an SHSAT testing date in November. Families do not choose the date on this page; confirm your child's assignment with their school counselor.",
        ],
      },
      {
        heading: "Planning the final weeks",
        paragraphs: [
          "Students testing on November 14 have less time than students testing on November 21, so build a study plan around the earliest likely date. Our guide to [how the digital SHSAT works](/resources/digital-shsat-2026) covers the test format, and [how to use SHSAT practice tests](/resources/how-to-use-shsat-practice-tests) explains how to review timed work.",
          "AhmedPrep's [2026 SHSAT Final 5-Week Intensive](/shsat-final-intensive-2026) is scheduled to finish before the last test date. You can also start with a [free diagnostic](/free-diagnostic) or learn more about our [SHSAT preparation](/shsat).",
        ],
      },
    ],
  },
  {
    slug: "sat-november-december-2026-registration-deadlines",
    filter: "digital-sat",
    topic: "Registration",
    featured: true,
    title: "November and December 2026 SAT Registration Deadlines",
    metaTitle: "Nov. 7 and Dec. 5, 2026 SAT Registration Deadlines",
    description:
      "College Board deadlines for the November 7 and December 5, 2026 SAT: regular registration, late registration and changes, and device borrowing timing.",
    summary:
      "Register by October 23 for the November 7 SAT or by November 20 for the December 5 SAT. Late registration and changes close four days later.",
    keyDates: [
      { label: "Nov. 7 SAT registration", date: "2026-10-23" },
      { label: "Dec. 5 SAT registration", date: "2026-11-20" },
    ],
    sourceId: "college-board-sat-dates",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "November 7, 2026 SAT",
        list: ["Registration deadline: October 23, 2026", "Late registration and change deadline: October 27, 2026"],
      },
      {
        heading: "December 5, 2026 SAT",
        list: ["Registration deadline: November 20, 2026", "Late registration and change deadline: November 24, 2026"],
      },
      {
        heading: "Before you register",
        paragraphs: [
          "College Board notes that students who need to borrow a testing device must register and request the device at least 30 days before test day. For the November test, that window is already tight.",
          "The SAT is taken in the Bluebook app. Our [Digital SAT guide](/resources/digital-sat-guide) explains the adaptive format, and our [Digital SAT prep program](/digital-sat) helps students build a plan for their chosen date. A [free diagnostic](/free-diagnostic) is a good first step if you have not yet picked a date.",
        ],
      },
    ],
  },
  {
    slug: "nyc-high-school-application-closes-december-4-2026",
    filter: "nyc-admissions",
    topic: "Application Deadlines",
    featured: true,
    title: "NYC High School and LaGuardia Applications Close December 4, 2026",
    metaTitle: "NYC High School Application Deadline: December 4, 2026",
    description:
      "NYC high school and LaGuardia applications close Friday, December 4, 2026. How the application deadline relates to SHSAT registration and Specialized High School offers.",
    summary:
      "The NYC high school and LaGuardia applications close Friday, December 4. SHSAT registration has an earlier, separate deadline.",
    keyDates: [{ label: "Applications close", date: "2026-12-04" }],
    sourceId: "nycps-high-school",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "Two different deadlines",
        paragraphs: [
          "NYC Public Schools lists Friday, December 4, 2026 as the date high school and LaGuardia applications close. SHSAT registration for the eight testing Specialized High Schools closes much earlier, on October 30, 2026.",
          "Students can apply to regular high school programs and also register for the SHSAT. Specialized High School offers are based on SHSAT scores and the preference order students list during SHSAT registration.",
        ],
      },
      {
        heading: "What families can do now",
        paragraphs: [
          "If your child plans to test, register before October 30 and then build the high school application at a steadier pace. Our [SHSAT dates guide](/resources/2026-shsat-dates-registration-deadline) explains the order of steps, and our [SHSAT prep](/shsat) page describes how we support students through the fall.",
        ],
      },
    ],
  },
  {
    slug: "official-shsat-guide-fall-2027-admissions",
    filter: "shsat",
    topic: "Practice Resources",
    title: "Official SHSAT Guide for Students Entering High School in Fall 2027",
    metaTitle: "Official 2026 SHSAT Guide and Practice Materials from NYC",
    description:
      "NYC Public Schools has published its Guide to the SHSAT for students entering high school in fall 2027, alongside official practice tests and preparation materials.",
    summary:
      "NYC Public Schools has posted the official SHSAT guide for this fall's test, along with official practice tests and preparation materials.",
    keyDates: [],
    sourceId: "nycps-specialized",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "Which guide applies this year",
        paragraphs: [
          "Students taking the SHSAT in November 2026 are applying to enter high school in fall 2027. NYC Public Schools has published the Guide to the SHSAT for that admissions cycle on its Specialized High Schools page.",
          "The official guide is the best description of the test your child will actually take. Read it before relying on any third-party material, including ours.",
        ],
      },
      {
        heading: "Using official practice well",
        paragraphs: [
          "Official practice tests are limited, so use them deliberately: take one timed to set a baseline, review every miss, and save the rest for later checkpoints. Our guide on [how to use SHSAT practice tests](/resources/how-to-use-shsat-practice-tests) walks through that process, and the [SHSAT Math topics guide](/resources/shsat-math-topics) helps target review.",
          "If you want an outside read on your child's results, book a [free diagnostic](/free-diagnostic) or try a [free live SHSAT class](/free-sunday-classes).",
        ],
      },
    ],
  },
  {
    slug: "sat-spring-2027-test-dates",
    filter: "digital-sat",
    topic: "Test Dates",
    title: "Spring 2027 SAT Test Dates and Registration Deadlines",
    metaTitle: "Spring 2027 SAT Dates: March 6, May 1 and June 5",
    description:
      "College Board's spring 2027 SAT dates are March 6, May 1 and June 5, with registration deadlines in February, April and May. Plus anticipated fall 2027 dates.",
    summary:
      "Spring 2027 SATs are March 6, May 1 and June 5. Registration is already open for every spring date.",
    keyDates: [
      { label: "March SAT", date: "2027-03-06" },
      { label: "May SAT", date: "2027-05-01" },
      { label: "June SAT", date: "2027-06-05" },
    ],
    sourceId: "college-board-sat-dates",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
    sections: [
      {
        heading: "Spring 2027 dates",
        list: [
          "March 6, 2027: register by February 19; late registration and changes by February 23",
          "May 1, 2027: register by April 16; late registration and changes by April 20",
          "June 5, 2027: register by May 21; late registration and changes by May 25",
        ],
      },
      {
        heading: "Anticipated fall 2027 dates",
        paragraphs: [
          "College Board lists anticipated weekend dates of August 28, September 18, October 9, November 6 and December 4, 2027. Anticipated dates can change, so confirm them on College Board before planning around them.",
        ],
      },
      {
        heading: "Choosing a date",
        paragraphs: [
          "Juniors often pick a spring date to leave room for a second attempt. Our [Digital SAT guide](/resources/digital-sat-guide) explains the test structure, and the [Digital SAT Math](/resources/digital-sat-math-practice) and [Reading and Writing](/resources/digital-sat-reading-writing) guides cover what each section tests. See our [Digital SAT prep program](/digital-sat) for structured support.",
        ],
      },
    ],
  },
  {
    slug: "ahmedprep-2026-shsat-final-intensive",
    filter: "ahmedprep-programs",
    topic: "Programs",
    title: "AhmedPrep 2026 SHSAT Final 5-Week Intensive: October 12 to November 12",
    metaTitle: "AhmedPrep 2026 SHSAT Final Intensive Schedule | Astoria",
    description:
      "AhmedPrep's in-person 2026 SHSAT Final 5-Week Intensive in Astoria runs Monday to Thursday, 5 to 8 PM, from October 12 to November 12, 2026.",
    summary:
      "Twenty live evening classes in Astoria, Monday to Thursday, timed to finish before the November SHSAT dates.",
    keyDates: [{ label: "Intensive begins", date: "2026-10-12" }],
    sourceId: "ahmedprep",
    datePublished: "2026-10-11",
    dateModified: "2026-10-21",
    sections: [
      {
        heading: "Program schedule",
        list: [
          "Monday to Thursday, 5:00 PM to 8:00 PM Eastern (updated from 6:00 to 9:00 PM)",
          "October 12 to November 12, 2026",
          "20 live classes and 60 hours of SHSAT Math, ELA, timed practice, error review and pacing",
          "In person at AhmedPrep in Astoria, Queens",
        ],
      },
      {
        heading: "Who it is for",
        paragraphs: [
          "The intensive is designed for students who are already registered for the November 2026 SHSAT. Registration for the test itself is handled by NYC Public Schools and closes October 30.",
          "Full details, pricing and enrollment are on the [2026 SHSAT Final Intensive](/shsat-final-intensive-2026) page. Families who are not ready to enroll can join the [free Sunday SHSAT class](/free-sunday-classes) online or book a [free diagnostic](/free-diagnostic).",
        ],
      },
    ],
  },
]

const NEW_YORK_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" })

/** Today's calendar date in New York as YYYY-MM-DD. */
export function todayInNewYork(now = new Date()) {
  return NEW_YORK_DATE.format(now)
}

export function formatDate(isoDate: string, style: "long" | "short" = "long") {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getUpdate(slug: string) {
  return UPDATES.find((u) => u.slug === slug)
}

export function filterLabel(filter: UpdateFilter) {
  return UPDATE_FILTERS.find((f) => f.slug === filter)?.label ?? filter
}

/** The next key date that has not passed, if any. */
export function nextKeyDate(update: Update, today = todayInNewYork()) {
  return update.keyDates.find((d) => d.date >= today)
}

/** Newest first by modification date, then publication date. */
export function updatesChronological(list = UPDATES) {
  return [...list].sort(
    (a, b) => b.dateModified.localeCompare(a.dateModified) || b.datePublished.localeCompare(a.datePublished),
  )
}

/** Featured updates with an upcoming date, soonest first. Falls back to the most recent updates. */
export function homepageUpdates(limit = 4, today = todayInNewYork()) {
  const upcoming = UPDATES.filter((u) => u.featured && nextKeyDate(u, today))
    .sort((a, b) => nextKeyDate(a, today)!.date.localeCompare(nextKeyDate(b, today)!.date))
  const rest = updatesChronological().filter((u) => !upcoming.includes(u))
  return [...upcoming, ...rest].slice(0, limit)
}

export const latestUpdateModified = () => updatesChronological()[0]?.dateModified
