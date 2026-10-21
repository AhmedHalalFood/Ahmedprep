import { ArrowUpRight, CalendarDays, Check, Clock, MapPin } from "lucide-react"
import {
  CLASS_DATES,
  CLASS_DAYS,
  CLASS_TIME,
  HOURS_PER_CLASS,
  INTENSIVE_ENROLL_ANCHOR,
  INTENSIVE_NAME,
  INTENSIVE_PATH,
  ORIGINAL_DATES,
  ORIGINAL_HOURS,
  ORIGINAL_TUITION,
  PROGRAM_FORMAT,
  PROGRAM_LOCATION,
  classSession,
  TUITION_PER_CLASS,
  formatClassDate,
  formatUsd,
  remainingWeeks,
  type EnrollmentSnapshot,
} from "@/lib/shsat-intensive"
import { IntensiveCtas } from "@/components/landing/intensive-ctas"
import { EnrollingTodaySummary } from "@/components/landing/intensive-facts"
import { TuitionCalculator } from "@/components/landing/tuition-calculator"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"

const benefits = [
  "Intensive SHSAT Math instruction",
  "Intensive ELA and Reading Comprehension instruction",
  "Timed SHSAT practice",
  "Digital SHSAT preparation",
  "Math word-problem strategies",
  "Reading comprehension and elimination strategies",
  "Detailed review of mistakes and weak areas",
  "Pacing and time-management training",
  "Practice tests and targeted review",
  "Individual progress tracking",
  "Parent progress updates",
  "Final test-day strategy and preparation",
]

export function ShsatIntensive({ variant = "home", snapshot }: { variant?: "home" | "page"; snapshot: EnrollmentSnapshot }) {
  const isHome = variant === "home"
  const stats = [
    { value: "5", label: "Weeks (original program)" },
    { value: String(CLASS_DATES.length), label: "Scheduled classes" },
    { value: String(ORIGINAL_HOURS), label: "Instructional hours" },
    { value: formatUsd(ORIGINAL_TUITION), label: `Original tuition, ${ORIGINAL_HOURS} hours` },
  ]
  const weeks = remainingWeeks(snapshot.remainingDates)
  return (
    <section
      id="shsat-intensive"
      aria-labelledby={isHome ? "shsat-intensive-title" : undefined}
      aria-label={isHome ? undefined : "Program details"}
      className="scroll-mt-4 border-t-4 border-gold bg-academic py-12 text-white md:py-20"
    >
      <div className="container">
        {isHome && (
        <div className="grid gap-5 md:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow gold">Now enrolling · SHSAT November 2026</p>
            <h2
              id="shsat-intensive-title"
              className="mt-2 text-balance text-3xl font-extrabold leading-tight tracking-tight md:mt-3 md:text-5xl md:leading-none"
            >
              {INTENSIVE_NAME}
            </h2>
            <p className="mt-3 text-lg font-bold leading-snug text-gold md:mt-4 md:text-2xl">The Final Push Before the 2026 SHSAT</p>
            <p className="mt-1 text-base font-semibold leading-snug text-white/85 md:mt-2 md:text-lg">
              60 Hours of Live SHSAT Preparation Before Test Day
            </p>
          </div>
          <p className="max-w-xl text-pretty leading-relaxed text-white/75 md:hidden">
            Five weeks of focused SHSAT preparation covering Math, ELA, pacing, timed practice, error review, and test-day strategy.
          </p>
          <p className="hidden max-w-xl text-pretty leading-relaxed text-white/75 md:block">
            {
              "The SHSAT is only weeks away. Ahmed Prep\u2019s Final Intensive gives students a focused, structured preparation plan before test day. Students strengthen Math and ELA, improve pacing, practice SHSAT-style questions, review mistakes, and develop the confidence and strategy needed for the exam."
            }
          </p>
          <TrackedLink
            href={INTENSIVE_PATH}
            event={EVENTS.shsatIntensiveClick}
            eventProps={{ location: "home_intensive_section" }}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold underline-offset-4 hover:underline lg:col-start-2"
          >
            Full details: SHSAT Final Intensive 2026 <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
        )}

        <dl className={`${isHome ? "mt-8 md:mt-12" : ""} grid grid-cols-2 border border-white/20 lg:grid-cols-4`} aria-label="Program at a glance">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 border-white/20 p-6 md:p-8 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="order-2 text-xs font-bold uppercase tracking-widest text-white/70">{stat.label}</dt>
              <dd className="order-1 m-0 text-4xl font-extrabold leading-none tracking-tight text-gold md:text-5xl">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-px flex flex-col gap-4 bg-white/5 px-6 py-5 md:flex-row md:items-center md:gap-10 md:px-8">
          <p className="eyebrow gold shrink-0">Schedule</p>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarDays size={18} className="text-gold" aria-hidden="true" />
            {ORIGINAL_DATES}
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarDays size={18} className="text-gold" aria-hidden="true" />
            {CLASS_DAYS}
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <Clock size={18} className="text-gold" aria-hidden="true" />
            {`${CLASS_TIME} from Oct. 22`}
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <MapPin size={18} className="text-gold" aria-hidden="true" />
            {`${PROGRAM_FORMAT} · ${PROGRAM_LOCATION}`}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-3 md:gap-6">
            <h3 className="text-3xl font-extrabold tracking-tight">What Students Receive</h3>
            <p className="max-w-sm leading-relaxed text-white/75">
              Every part of the Intensive is designed to maximize preparation, strengthen weak areas, and build test-day confidence in the
              final weeks before the SHSAT.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-x-8 border-t border-white/20 p-0 sm:grid-cols-2">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-white/20 py-2.5 text-[0.9375rem] leading-snug text-white/90 md:py-3.5 md:text-sm md:leading-relaxed">
                <Check size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div id={INTENSIVE_ENROLL_ANCHOR} className="mt-10 grid scroll-mt-4 border border-white/20 md:mt-14 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="flex flex-col gap-5 p-5 md:gap-6 md:p-10">
            <div className="flex flex-col gap-2">
              <p className="eyebrow gold">Schedule and tuition</p>
              <h3 className="text-balance text-2xl font-extrabold tracking-tight md:text-3xl">What you receive when you enroll today</h3>
            </div>

            <div className="border border-white/20">
              <EnrollingTodaySummary snapshot={snapshot} />
            </div>

            {weeks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {`Remaining class dates (${CLASS_TIME})`}
                </h4>
                <ul className="m-0 flex list-none flex-col p-0">
                  {weeks.map((week) => (
                    <li key={week.start} className="flex flex-col gap-1 border-b border-white/15 py-3 sm:flex-row sm:gap-6">
                      <span className="shrink-0 text-sm font-bold text-white/70 sm:w-36">
                        {`Week of ${formatClassDate(week.start, "long").split(", ")[1]}`}
                      </span>
                      <span className="font-semibold text-white">
                        {week.dates
                          .map((date) =>
                            classSession(date).label === CLASS_TIME
                              ? formatClassDate(date)
                              : `${formatClassDate(date)} (${classSession(date).label})`,
                          )
                          .join(" \u00b7 ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/70">How tuition is calculated</h4>
              <p className="max-w-2xl text-pretty leading-relaxed text-white/80">
                {`The original program is ${ORIGINAL_HOURS} instructional hours for ${formatUsd(ORIGINAL_TUITION)}, which is ${formatUsd(TUITION_PER_CLASS)} per ${HOURS_PER_CLASS}-hour class. Late-enrollment tuition is prorated: you pay ${formatUsd(TUITION_PER_CLASS)} for each scheduled class from your child\u2019s first class through November 12. Classes held before your child joins are not included, are not made up, and are not charged.`}
              </p>
            </div>

            {snapshot.remainingDates.length > 1 && <TuitionCalculator dates={snapshot.remainingDates} />}

            <IntensiveCtas location="shsat_intensive_enroll" showEnroll={snapshot.nextClass !== null} />
          </div>
          <aside
            aria-label="Key SHSAT dates"
            className="flex flex-col justify-center gap-3 border-t border-white/20 bg-white/5 p-6 md:p-10 lg:border-l lg:border-t-0"
          >
            <p className="text-sm font-extrabold uppercase tracking-widest text-gold">SHSAT testing begins November 14</p>
            <p className="font-semibold text-white">School-Day SHSAT: November 18, 2026</p>
            <p className="flex items-center gap-2 text-sm text-white/75">
              <span className="size-1.5 shrink-0 bg-gold" aria-hidden="true" />
              {`The Intensive\u2019s last class is ${formatClassDate(CLASS_DATES[CLASS_DATES.length - 1], "long")}`}
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
