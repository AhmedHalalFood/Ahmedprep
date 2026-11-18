import Image from "next/image"
import { ArrowRight, CalendarDays, Clock, MapPin, MessageSquare, Phone, Tag, Users } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL } from "@/lib/business"
import {
  CLASS_DATES,
  PRICE_PER_CLASS_CENTS,
  SAT_INTENSIVE_CAPACITY,
  formatClassDate,
  formatUsd,
  quoteFor,
  satIntensiveUrgency,
} from "@/lib/sat-final-intensive"

const FULL = quoteFor(CLASS_DATES[0])

const FACTS = [
  { icon: CalendarDays, label: "Dates", value: "Nov 16 – Dec 3, 2026", note: "No class Thanksgiving (Nov 26)" },
  { icon: Clock, label: "Schedule", value: "Mon–Thu, 6–9 PM ET", note: `${FULL.remainingClasses} classes · ${FULL.remainingHours} hours` },
  { icon: MapPin, label: "In person", value: ADDRESS_LINE_1, note: ADDRESS_LINE_2, href: DIRECTIONS_URL },
  { icon: Users, label: "Class size", value: `Max ${SAT_INTENSIVE_CAPACITY} students`, note: "Small-group, in person" },
] as const

export function SatIntensiveHero() {
  const urgency = satIntensiveUrgency()
  const lateStart = urgency && !urgency.isFirstClass ? urgency.quote : null
  return (
    <section aria-labelledby="sat-intensive-title" className="border-b border-line bg-site-canvas">
      <div className="container grid items-center gap-6 py-6 md:py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-4">
          <p className="flex w-fit flex-wrap items-center gap-x-2 gap-y-0.5 rounded-2xl bg-navy px-3 py-1.5 text-xs font-extrabold uppercase leading-snug tracking-wider text-gold">
            {urgency ? (
              <>
                <span className="break-words">{urgency.examCountdown}</span>
                <span aria-hidden="true" className="hidden min-[420px]:inline">
                  ·
                </span>
                <span className="break-words text-cream">{urgency.nextClassLabel}</span>
              </>
            ) : (
              "For the December 5, 2026 SAT · Enrollment closed"
            )}
          </p>
          <div className="flex flex-col gap-2">
            <h1 id="sat-intensive-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Digital SAT Final Intensive
            </h1>
            <p className="max-w-xl text-pretty leading-relaxed text-ink">
              In-person Math and Reading &amp; Writing review with timed SAT modules, Desmos strategies, and targeted error
              correction. Rolling enrollment: join on any upcoming class date and pay only for the classes that remain.
              Students bring their own laptops.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line min-[440px]:grid-cols-2">
            {FACTS.map(({ icon: Icon, label, value, note, ...rest }) => (
              <div key={label} className="flex items-start gap-3 bg-paper px-4 py-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <dt className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wider text-subtle">{label}</dt>
                  <dd className="break-words text-sm font-extrabold leading-snug text-navy">
                    {"href" in rest ? (
                      <a href={rest.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4 hover:text-brand">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                  <dd className="break-words text-xs leading-snug text-subtle">{note}</dd>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3 bg-navy px-4 py-4 text-cream min-[440px]:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gold">
                  <Tag size={16} aria-hidden="true" />
                  Tuition
                </dt>
                <dd className="text-lg font-extrabold leading-snug text-cream">
                  {formatUsd(PRICE_PER_CLASS_CENTS)} per 3-hour class, per student
                </dd>
                <dd className="text-sm font-bold leading-snug text-cream/90">
                  Full {FULL.remainingClasses}-class program: {formatUsd(FULL.tuitionCents)}
                </dd>
              </div>
              <dd className="flex flex-col gap-1 border-t border-cream/20 pt-3 text-sm leading-snug text-cream/85 sm:max-w-56 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <span className="text-pretty">Rolling enrollment available. Pay upfront for remaining classes.</span>
                {lateStart && (
                  <span className="font-bold text-gold">
                    Starting {formatClassDate(lateStart.firstClassDate)}: {lateStart.remainingClasses} classes ·{" "}
                    {formatUsd(lateStart.tuitionCents)}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#register"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-coral px-7 text-base font-extrabold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-coral-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Request Enrollment <ArrowRight size={18} aria-hidden="true" />
            </a>
            <div className="flex gap-2">
              <a
                href={BUSINESS.phoneHref}
                aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-md border-2 border-navy px-5 text-sm font-extrabold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream"
              >
                <Phone size={16} aria-hidden="true" />
                Call
              </a>
              <a
                href={BUSINESS.smsHref}
                aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-md border-2 border-navy px-5 text-sm font-extrabold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-cream"
              >
                <MessageSquare size={16} aria-hidden="true" />
                Text
              </a>
            </div>
            <a href="#tuition" className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-brand">
              Calculate my tuition
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border-4 border-gold/70 shadow-lg lg:aspect-[4/3]">
          <Image
            src="/images/sat-intensive/study-table-illustration.jpg"
            alt="Illustration of an empty study room set up for SAT practice, with laptops, calculators, and worksheets on a long table beside windows overlooking a Queens street"
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
