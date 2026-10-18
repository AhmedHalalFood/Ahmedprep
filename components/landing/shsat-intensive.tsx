import { ArrowUpRight, CalendarDays, Check, Clock, MessageSquare, Phone } from "lucide-react"
import {
  HOURS_PER_CLASS,
  INTENSIVE_ENROLL_ANCHOR,
  INTENSIVE_PATH,
  ORIGINAL_HOURS,
  ORIGINAL_TUITION,
  PRORATED_SCHEDULE,
  TUITION_PER_CLASS,
  formatClassDate,
  formatUsd,
} from "@/lib/shsat-intensive"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TuitionCalculator } from "@/components/landing/tuition-calculator"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

const stats = [
  { value: "5", label: "Weeks" },
  { value: "20", label: "Live Classes" },
  { value: "60", label: "Hours of Instruction" },
  { value: "$800", label: "Late Enrollment From Oct. 19" },
]

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

export function ShsatIntensive({ variant = "home" }: { variant?: "home" | "page" }) {
  const isHome = variant === "home"
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
              2026 SHSAT Final 5-Week Intensive
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
            Full details: 2026 SHSAT Final Intensive <ArrowUpRight size={15} aria-hidden="true" />
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
              {stat.value === "$800" && (
                <>
                  <dd className="order-3 m-0 text-sm font-semibold text-white/85">
                    48 remaining hours <span className="text-white/40" aria-hidden="true">•</span> prorated
                  </dd>
                  <dd className="order-4 m-0 mt-2 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/65">
                    <span className="font-bold uppercase tracking-widest text-white/80">Original tuition</span>
                    <br />
                    <s>$1,000</s> for 60 hours
                  </dd>
                </>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-px flex flex-col gap-4 bg-white/5 px-6 py-5 md:flex-row md:items-center md:gap-10 md:px-8">
          <p className="eyebrow gold shrink-0">Schedule</p>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarDays size={18} className="text-gold" aria-hidden="true" />
            October 12 – November 12, 2026
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarDays size={18} className="text-gold" aria-hidden="true" />
            Monday through Thursday
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <Clock size={18} className="text-gold" aria-hidden="true" />
            6:00 PM – 9:00 PM Eastern
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
              <p className="eyebrow gold">Late enrollment open | Prorated tuition</p>
              <h3 className="text-balance text-2xl font-extrabold tracking-tight md:text-3xl">Join the remaining classes</h3>
              <p className="max-w-2xl text-pretty text-lg font-semibold leading-relaxed text-white md:text-xl">
                For students beginning October 19: <span className="text-gold">48 remaining instructional hours for $800.</span>
              </p>
            </div>

            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Prorated tuition schedule by start week</caption>
              <thead>
                <tr className="border-b border-white/30 text-xs font-bold uppercase tracking-widest text-white/70">
                  <th scope="col" className="py-2 pr-3 font-bold">
                    Start week
                  </th>
                  <th scope="col" className="py-2 pr-3 font-bold">
                    Hours left
                  </th>
                  <th scope="col" className="py-2 text-right font-bold">
                    Tuition
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRORATED_SCHEDULE.map((row) => (
                  <tr key={row.start} className="border-b border-white/15">
                    <th scope="row" className="py-3 pr-3 font-semibold text-white">
                      {formatClassDate(row.start, "long").split(", ")[1]}
                    </th>
                    <td className="py-3 pr-3 text-white/85">{row.hours} hours</td>
                    <td className="py-3 text-right text-lg font-extrabold text-gold">{formatUsd(row.tuition)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="max-w-2xl text-pretty leading-relaxed text-white/80">
              {`Tuition is based on the actual instructional hours remaining: ${formatUsd(TUITION_PER_CLASS)} per ${HOURS_PER_CLASS}-hour class (about $16.67 per hour). For students joining midweek, tuition is calculated using the remaining scheduled sessions.`}
            </p>

            <TuitionCalculator />

            <p className="text-sm leading-relaxed text-white/65">
              Original tuition: <s>{formatUsd(ORIGINAL_TUITION)}</s> for the full {ORIGINAL_HOURS}-hour program.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ReserveSeatDialog location="shsat_intensive_enroll" />
              <TrackedLink
                href={BUSINESS.phoneHref}
                event={EVENTS.phoneClick}
                eventProps={{ location: "shsat_intensive" }}
                className="button button-lg justify-center border border-white/40 uppercase text-white hover:border-gold hover:text-gold"
              >
                <Phone size={16} aria-hidden="true" />
                Call to Enroll: 347-479-5020
              </TrackedLink>
              <TrackedLink
                href={BUSINESS.smsHref}
                event={EVENTS.textClick}
                eventProps={{ location: "shsat_intensive" }}
                className="inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-bold uppercase tracking-wider text-white/85 hover:text-gold"
              >
                <MessageSquare size={15} aria-hidden="true" />
                Text us
              </TrackedLink>
            </div>
          </div>
          <aside
            aria-label="Key SHSAT dates"
            className="flex flex-col justify-center gap-3 border-t border-white/20 bg-white/5 p-6 md:p-10 lg:border-l lg:border-t-0"
          >
            <p className="text-sm font-extrabold uppercase tracking-widest text-gold">SHSAT testing begins November 14</p>
            <p className="font-semibold text-white">School-Day SHSAT: November 18, 2026</p>
            <p className="flex items-center gap-2 text-sm text-white/75">
              <span className="size-1.5 shrink-0 bg-gold" aria-hidden="true" />
              Late enrollment open for the remaining classes
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
