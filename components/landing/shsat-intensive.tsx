import { CalendarDays, Check, Clock, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

const stats = [
  { value: "5", label: "Weeks" },
  { value: "20", label: "Live Classes" },
  { value: "60", label: "Hours of Instruction" },
  { value: "$1,000", label: "Complete Program" },
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

export function ShsatIntensive() {
  return (
    <section
      id="shsat-intensive"
      aria-labelledby="shsat-intensive-title"
      className="scroll-mt-4 border-t-4 border-gold bg-navy py-16 text-white md:py-20"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow gold">Now enrolling · SHSAT November 2026</p>
            <h2
              id="shsat-intensive-title"
              className="mt-3 text-balance text-4xl font-extrabold leading-none tracking-tight md:text-5xl"
            >
              2026 SHSAT Final 5-Week Intensive
            </h2>
            <p className="mt-4 text-xl font-bold text-gold md:text-2xl">The Final Push Before the 2026 SHSAT</p>
            <p className="mt-2 text-lg font-semibold text-white/85">60 Hours of Live SHSAT Preparation Before Test Day</p>
          </div>
          <p className="max-w-xl text-pretty leading-relaxed text-white/75">
            {
              "The SHSAT is only weeks away. Ahmed Prep\u2019s Final Intensive gives students a focused, structured preparation plan before test day. Students strengthen Math and ELA, improve pacing, practice SHSAT-style questions, review mistakes, and develop the confidence and strategy needed for the exam."
            }
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 border border-white/20 lg:grid-cols-4" aria-label="Program at a glance">
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
            October 12 – November 12, 2026
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarDays size={18} className="text-gold" aria-hidden="true" />
            Monday through Thursday
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <Clock size={18} className="text-gold" aria-hidden="true" />
            6:00 PM – 9:00 PM
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-extrabold tracking-tight">What Students Receive</h3>
            <p className="max-w-sm leading-relaxed text-white/75">
              Every part of the Intensive is built to maximize score gains in the final weeks before test day.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <TrackedLink
                href={BUSINESS.phoneHref}
                event={EVENTS.phoneClick}
                eventProps={{ location: "shsat_intensive" }}
                className="button button-gold button-lg"
              >
                <Phone size={16} aria-hidden="true" />
                Call to Enroll: 347-479-5020
              </TrackedLink>
              <TrackedLink
                href={BUSINESS.smsHref}
                event={EVENTS.textClick}
                eventProps={{ location: "shsat_intensive" }}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/85 hover:text-gold"
              >
                <MessageSquare size={15} aria-hidden="true" />
                Text us
              </TrackedLink>
            </div>
          </div>
          <ul className="m-0 grid list-none gap-x-8 border-t border-white/20 p-0 sm:grid-cols-2">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-white/20 py-3.5 text-sm leading-relaxed text-white/90">
                <Check size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
