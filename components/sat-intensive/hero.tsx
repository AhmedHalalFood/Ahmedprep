import Image from "next/image"
import { ArrowRight, CalendarDays, Clock, MapPin, Phone, Tag, Users } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL } from "@/lib/business"
import { CLASS_DATES, PRICE_PER_CLASS_CENTS, SAT_INTENSIVE_CAPACITY, formatUsd, quoteFor } from "@/lib/sat-final-intensive"

const FULL = quoteFor(CLASS_DATES[0])

const FACTS = [
  { icon: CalendarDays, label: "Dates", value: "Nov 16 – Dec 3, 2026", note: "Mon–Thu · no class Nov 26" },
  { icon: Clock, label: "Time", value: "6:00–9:00 PM ET", note: `${FULL.remainingClasses} classes · ${FULL.remainingHours} hours` },
  { icon: MapPin, label: "Location", value: ADDRESS_LINE_1, note: ADDRESS_LINE_2, href: DIRECTIONS_URL },
  { icon: Users, label: "Class size", value: `Max ${SAT_INTENSIVE_CAPACITY} students`, note: "In person only" },
] as const

export function SatIntensiveHero() {
  return (
    <section aria-labelledby="sat-intensive-title" className="border-b border-line bg-cream">
      <div className="container grid items-center gap-6 py-6 md:py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="flex flex-col gap-4">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-navy px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-gold">
            For the December 5, 2026 SAT · Enrollment open
          </p>
          <div className="flex flex-col gap-2">
            <h1 id="sat-intensive-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Digital SAT Final Intensive
            </h1>
            <p className="max-w-xl text-pretty leading-relaxed text-ink">
              In-person Math and Reading &amp; Writing review with Bluebook-style timed practice and personal feedback. Join on any
              upcoming class date and pay only for the classes that remain.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {FACTS.map(({ icon: Icon, label, value, note, ...rest }) => (
              <div key={label} className="flex gap-2.5 bg-paper p-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                <div className="flex min-w-0 flex-col">
                  <dt className="text-[11px] font-extrabold uppercase tracking-wider text-subtle">{label}</dt>
                  <dd className="text-sm font-extrabold leading-snug text-navy">
                    {"href" in rest ? (
                      <a href={rest.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4 hover:text-brand">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                  <dd className="text-xs leading-snug text-subtle">{note}</dd>
                </div>
              </div>
            ))}
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-navy px-4 py-3 text-cream">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gold">
                <Tag size={16} aria-hidden="true" />
                Tuition
              </dt>
              <dd className="text-sm font-bold">
                <span className="text-lg font-extrabold text-cream">{formatUsd(PRICE_PER_CLASS_CENTS)}</span> per class ·{" "}
                {formatUsd(FULL.tuitionCents)} for all {FULL.remainingClasses}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coral px-7 text-base font-extrabold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-coral-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Enroll Now <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#tuition" className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-brand">
              Calculate my tuition
            </a>
            <a href={BUSINESS.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-1.5 px-2 text-sm font-bold text-navy hover:text-brand sm:ml-auto">
              <Phone size={16} aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border-4 border-gold/70 shadow-lg lg:aspect-[4/3]">
          <Image
            src="/images/sat-intensive/hero-students.png"
            alt="High school students working on SAT practice with laptops and printed questions in a small Astoria classroom"
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
