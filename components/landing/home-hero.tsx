import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, ChartLine, Laptop, MapPin, Phone, Tag, Users, type LucideIcon } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import {
  FOUNDING_SEATS_PER_COHORT,
  MAX_CLASS_SIZE,
  TERMS_2027,
  deadlinesFor,
  dollars,
  formatRange,
  priceFor,
  termSummary,
} from "@/lib/cohorts-2027"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { programsHref } from "@/lib/program-finder"

const BENEFITS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Users, label: `Small groups, max ${MAX_CLASS_SIZE} students` },
  { Icon: MapPin, label: "In-person instruction in Astoria" },
  { Icon: CalendarDays, label: "Structured preparation and practice" },
  { Icon: ChartLine, label: "Diagnostics and progress tracking" },
]

const PROGRAM_CARDS = [
  {
    program: "SHSAT" as const,
    title: "SHSAT Preparation",
    subjects: "Math and ELA",
    Icon: BookOpen,
    tone: "border-brand/25 bg-brand-soft",
    badge: "bg-brand",
    arrow: "bg-brand",
    focus: "focus-visible:outline-brand",
  },
  {
    program: "Digital SAT" as const,
    title: "Digital SAT Preparation",
    subjects: "Math and Reading & Writing",
    Icon: Laptop,
    tone: "border-sage/25 bg-sage-soft",
    badge: "bg-sage",
    arrow: "bg-sage",
    focus: "focus-visible:outline-sage",
  },
]

const shortMonthDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" })

/** Winter 2027 tuition strip, derived from the approved catalog so prices and deadlines never drift from cohorts-2027. */
function winterSummary() {
  const winter = TERMS_2027.find((t) => t.id === "winter")!
  const summary = termSummary(winter)
  const price = priceFor(winter.cohorts[0])
  const foundingIsos = winter.cohorts.flatMap((c) => deadlinesFor(c).foundingIso ?? []).sort()
  const first = foundingIsos[0]
  const last = foundingIsos.at(-1)!
  return {
    name: `${winter.name} Cohorts`,
    range: formatRange(summary.startIso, summary.endIso),
    hours: winter.cohorts[0].hours,
    regular: dollars(price.regular),
    founding: price.founding === null ? null : dollars(price.founding),
    foundingDeadlines: first === last ? `by ${shortMonthDay(first)}, ${first.slice(0, 4)}` : `deadlines ${shortMonthDay(first)} – ${shortMonthDay(last)}, ${last.slice(0, 4)} by cohort`,
  }
}

export function HomeHero() {
  const winter = winterSummary()
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-cream">
      <div className="relative overflow-hidden">
        <div className="relative aspect-[16/9] w-full lg:absolute lg:inset-0 lg:aspect-auto">
          <Image
            src="/ahmedprep-hero-books.png"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[78%_center] lg:object-right"
          />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-r from-cream via-cream/85 to-transparent lg:block lg:via-45%" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent lg:hidden" />
        </div>

        <div className="relative mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-6 pb-8 pt-2 lg:min-h-[480px] lg:justify-center lg:py-14">
          <div className="flex max-w-xl flex-col gap-4">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-navy sm:text-sm">
              SHSAT &amp; Digital SAT Preparation
              <span aria-hidden="true" className="h-0.5 w-12 rounded-full bg-gold" />
            </p>
            <h1 id="hero-title" className="text-balance font-serif text-4xl font-bold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
              Find the Right Class for{" "}
              <span className="underline decoration-gold decoration-4 underline-offset-[10px]">Your Child</span>
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-subtle">
              Focused instruction, proven strategies, and small-group SHSAT and Digital SAT preparation in Astoria, Queens.
            </p>
          </div>

          <ul className="grid max-w-2xl grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4" aria-label="Why families choose AhmedPrep">
            {BENEFITS.map(({ Icon, label }) => (
              <li key={label} className="flex flex-col items-start gap-2 sm:items-center sm:text-center">
                <Icon size={28} aria-hidden="true" className="text-brand" />
                <span className="text-sm font-semibold leading-snug text-navy">{label}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <TrackedLink
              href={ENROLLMENT_2027.requestHref}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "request_enrollment" }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 font-extrabold text-navy shadow-sm transition-colors hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Request Enrollment <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/programs-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "view_schedules_tuition" }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-navy bg-paper px-6 font-extrabold text-navy transition-colors hover:bg-navy hover:text-paper"
            >
              View Schedules &amp; Tuition <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={BUSINESS.phoneHref}
              event={EVENTS.phoneClick}
              eventProps={{ location: "home_hero" }}
              className="inline-flex min-h-12 items-center gap-2 px-2 font-bold text-navy underline-offset-4 hover:underline"
            >
              <Phone size={18} aria-hidden="true" className="text-brand" />
              {BUSINESS.phoneDisplay}
            </TrackedLink>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-4 pb-10">
        <ul className="grid gap-4 md:grid-cols-2">
          {PROGRAM_CARDS.map((card) => (
            <li key={card.program}>
              <Link
                href={programsHref({ program: card.program })}
                className={`group flex h-full items-center gap-4 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-5 sm:p-6 ${card.tone} ${card.focus}`}
              >
                <span className={`flex size-14 shrink-0 items-center justify-center rounded-xl text-paper ${card.badge}`} aria-hidden="true">
                  <card.Icon size={28} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-serif text-xl font-bold leading-tight text-navy sm:text-2xl">{card.title}</span>
                  <span className="text-base text-subtle">{card.subjects}</span>
                  <span className="text-sm font-semibold text-navy">Weekday &amp; weekend classes · Choose a season</span>
                </span>
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-paper transition-transform group-hover:translate-x-0.5 ${card.arrow}`}
                  aria-hidden="true"
                >
                  <ArrowRight size={20} />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 shadow-sm lg:flex-row lg:items-center lg:gap-6">
          <div className="flex items-center gap-3">
            <CalendarDays size={32} aria-hidden="true" className="shrink-0 text-brand" />
            <p className="flex flex-col">
              <span className="text-lg font-extrabold text-navy">{winter.name}</span>
              <span className="text-sm text-subtle">
                {winter.range} · {winter.hours} hours
              </span>
            </p>
          </div>
          {winter.founding && (
            <p className="flex items-start gap-3 rounded-xl bg-gold/20 px-4 py-3 lg:flex-1">
              <Tag size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-gold-deep" />
              <span className="flex flex-col">
                <span className="font-extrabold text-navy">Founding-family tuition: {winter.founding}</span>
                <span className="text-xs leading-relaxed text-ink">
                  Winter only · first {FOUNDING_SEATS_PER_COHORT} fully paid enrollments per cohort · {winter.foundingDeadlines}
                </span>
              </span>
            </p>
          )}
          <p className="flex flex-col">
            <span className="font-extrabold text-navy">Regular tuition: {winter.regular}</span>
            <span className="text-xs text-subtle">Discounts do not combine</span>
          </p>
          <Link
            href={programsHref({ season: "winter" })}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 font-extrabold text-navy transition-colors hover:bg-gold-hover lg:ml-auto"
          >
            View Classes &amp; Schedule <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <p className="text-xs leading-relaxed text-subtle">
          Submitting an enrollment request does not reserve a seat or a discounted tuition rate. Seats and tuition are confirmed when AhmedPrep verifies availability and payment.
        </p>
      </div>
    </section>
  )
}
