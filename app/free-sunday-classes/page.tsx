import type { Metadata } from "next"
import { ArrowUpRight, BookOpenCheck, Calculator, MessageCircleQuestion, PencilLine, Timer, Zap } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { FreeClassRsvpForm } from "@/components/free-class-rsvp-form"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { SundayClassViewTracker } from "@/components/sunday-classes/sunday-class-view-tracker"
import { NextDatePendingCard, ThisSundayCard } from "@/components/sunday-classes/this-sunday-card"
import { UpcomingClasses } from "@/components/sunday-classes/upcoming-classes"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS, SITE_URL } from "@/lib/business"
import {
  FREE_CLASS,
  RSVP_PROGRAMS,
  classMatchesProgram,
  findUpcomingSunday,
  getUpcomingSundays,
  rsvpDayHref,
  scheduleSummary,
} from "@/lib/free-class"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

// Rendered per request so the next class rolls over exactly when each session ends.
export const dynamic = "force-dynamic"

const title = "Free SHSAT & Digital SAT Classes Online | AhmedPrep"

export function generateMetadata(): Metadata {
  const description =
    scheduleSummary().schedule === "weekly_2026"
      ? "Free live online Sunday SHSAT and Digital SAT classes from AhmedPrep, Sundays 4–5 PM ET. Beginning in January 2027: every other Sunday, SHSAT 6:00–6:45 PM ET and Digital SAT 7:00–7:45 PM ET. RSVP required."
      : "Free live online SHSAT and Digital SAT classes from AhmedPrep, every other Sunday: SHSAT 6:00–6:45 PM ET, Digital SAT 7:00–7:45 PM ET. RSVP required."
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(FREE_CLASS.path) },
    robots: { index: true, follow: true },
    openGraph: { ...baseOpenGraph, title, description, url: absoluteUrl(FREE_CLASS.path) },
    twitter: { card: "summary_large_image", title, description },
  }
}

const expectations = [
  { icon: BookOpenCheck, title: "Live instruction from AhmedPrep", body: "A real lesson taught in real time, not a recording." },
  { icon: PencilLine, title: "Guided exam-style questions", body: "Students work through test-style problems step by step with the instructor." },
  { icon: Calculator, title: "Math and reading/writing strategies", body: "Methods for the question types that cost students the most points." },
  { icon: Timer, title: "Timed practice", body: "Short timed sets that build pacing and focus under real test conditions." },
  { icon: MessageCircleQuestion, title: "Question-and-answer time", body: "Students ask questions while the material is still fresh." },
  { icon: Zap, title: "Practical preparation", body: "Strategies students can use immediately on homework and practice tests." },
]

const SCHEDULE_FAQ_2026: FaqItem = {
  q: "How does the schedule work?",
  a: "Through December 27, 2026, one class meets every Sunday from 4:00–5:00 PM ET. The 1st and 3rd Sundays are SHSAT, the 2nd and 4th are Digital SAT, and a 5th Sunday is a special workshop. Beginning in January 2027, classes meet every other Sunday: SHSAT 6:00–6:45 PM ET, then Digital SAT 7:00–7:45 PM ET. The first January date will be announced soon.",
}
const SCHEDULE_FAQ_2027: FaqItem = {
  q: "How does the schedule work?",
  a: "Beginning in January 2027, classes meet every other Sunday. Each class Sunday has two sessions: SHSAT from 6:00–6:45 PM ET, then Digital SAT from 7:00–7:45 PM ET. Seats are subject to registration and available capacity.",
}

const faqs = (scheduleFaq: FaqItem): FaqItem[] => [
  {
    q: "Are the Sunday classes really free?",
    a: "Yes. Every Sunday class is free, subject to registration and available capacity. RSVP is required so we can send the live class access information, and registering does not commit you to any paid program.",
  },
  scheduleFaq,
  {
    q: "Can my student attend both classes on the same Sunday?",
    a: "Yes. On the 2027 schedule, RSVP separately for the SHSAT class and the Digital SAT class.",
  },
  {
    q: "How do we get the class link?",
    a: "After you RSVP, the live class access information is sent privately to the parent email on the registration. The link is never posted publicly on the website.",
  },
  {
    q: "Is this a sales presentation?",
    a: "No. The hour is genuine instruction: a focused lesson, guided practice, timed questions, and time for students to ask questions.",
  },
  {
    q: "What does my student need?",
    a: "A computer or tablet with a reliable internet connection, and a pencil with scratch paper. Digital SAT students may also want the Desmos calculator open in a browser.",
  },
]

const programLinks = [
  { label: "SHSAT Prep", href: "/shsat", event: EVENTS.shsatCtaClick },
  { label: "Digital SAT Prep", href: "/digital-sat", event: EVENTS.digitalSatCtaClick },
  { label: "Free Diagnostic", href: "/free-diagnostic", event: EVENTS.diagnosticCtaClick },
]

const PROGRAM_VALUES = new Set<string>(RSVP_PROGRAMS.map((p) => p.value))

export default async function FreeSundayClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const days = getUpcomingSundays(4)
  const classes = days.flatMap((d) => d.sessions)
  const nextDay = days[0] as (typeof days)[number] | undefined
  const firstSession = nextDay?.sessions[0]
  const summary = scheduleSummary()
  const pageUrl = absoluteUrl(FREE_CLASS.path)

  const requestedDate = typeof params.date === "string" ? params.date : undefined
  const requestedProgram = typeof params.class === "string" && PROGRAM_VALUES.has(params.class) ? params.class : ""
  const selectedDay = findUpcomingSunday(requestedDate, 4)
  const onlySession = selectedDay?.sessions.length === 1 ? selectedDay.sessions[0] : undefined
  const initialProgram = requestedProgram || (onlySession && onlySession.type !== "workshop" ? onlySession.type : "")
  const initialDate =
    selectedDay && (!initialProgram || selectedDay.sessions.some((s) => classMatchesProgram(s, initialProgram))) ? selectedDay.isoDate : ""

  return (
    <>
      <Breadcrumbs items={[{ label: "Free Sunday Classes", href: FREE_CLASS.path }]} />
      {nextDay && firstSession && <SundayClassViewTracker classType={firstSession.type} classDate={nextDay.isoDate} />}

      <section aria-labelledby="free-class-title" className="bg-academic py-10 text-white md:py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-16 lg:gap-y-6">
          <div className="flex flex-col gap-4 lg:self-end">
            <p className="eyebrow gold">Free live Sunday test prep</p>
            <h1 id="free-class-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Free Sunday SHSAT & Digital SAT Classes
            </h1>
            <p className="text-sm font-extrabold uppercase tracking-widest text-gold">
              {summary.cadence} <span aria-hidden="true">•</span> {summary.times} <span aria-hidden="true">•</span> Live Online
            </p>
          </div>

          <div className="lg:row-span-2 lg:self-center">
            {nextDay ? <ThisSundayCard day={nextDay} /> : <NextDatePendingCard />}
          </div>

          <div className="flex flex-col gap-6 lg:self-start">
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-white/80">
              {summary.schedule === "weekly_2026"
                ? "Join AhmedPrep on Sundays for live online test preparation. SHSAT and Digital SAT classes alternate weekly, giving students focused instruction, guided practice, and practical test-taking strategies at no cost."
                : "Join AhmedPrep every other Sunday for live online test preparation: a 45-minute SHSAT class, then a 45-minute Digital SAT class. Students get focused instruction, guided practice, and practical test-taking strategies at no cost."}
            </p>
            {summary.upcomingChange && (
              <p className="max-w-xl border-l-4 border-gold pl-4 text-pretty text-sm font-semibold leading-relaxed text-white">
                {summary.upcomingChange}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              {nextDay && firstSession && (
                <TrackedLink
                  href={rsvpDayHref(nextDay)}
                  event={EVENTS.sundayClassCtaClick}
                  eventProps={{
                    location: "free_class_hero",
                    class_type: nextDay.sessions.length === 1 ? firstSession.type : "both",
                    class_date: nextDay.isoDate,
                  }}
                  className="button button-gold button-lg"
                >
                  Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
                </TrackedLink>
              )}
              <CallTextLinks location="free_class_hero" tone="dark" />
            </div>
            <p className="text-sm font-semibold text-white/70">
              No cost <span aria-hidden="true">•</span> Live instruction <span aria-hidden="true">•</span> RSVP required{" "}
              <span aria-hidden="true">•</span> Call {BUSINESS.phoneDisplay}
            </p>
          </div>
        </div>
      </section>

      {days.length > 0 && <UpcomingClasses days={days} />}

      <section aria-labelledby="expect-title" className="bg-white py-14 md:py-20">
        <div className="container flex flex-col gap-10">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Real instruction</p>
            <h2 id="expect-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              What Students Can Expect
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-subtle">
              Each Sunday hour is a genuine class, not a sales presentation. Students learn, practice, and leave with strategies they can use
              right away.
            </p>
          </div>
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {expectations.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex flex-col gap-3 bg-white p-6">
                <Icon size={22} aria-hidden="true" className="text-brand" />
                <h3 className="font-extrabold text-navy">{title}</h3>
                <p className="text-sm leading-relaxed text-subtle">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="parents-title" className="bg-cream py-14 md:py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow blue">For parents</p>
            <h2 id="parents-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy">
              A Simple Way to Experience AhmedPrep
            </h2>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-subtle">
              The Free Sunday Test Prep Series gives families an opportunity to experience AhmedPrep&apos;s teaching style before choosing a
              longer preparation program. Students learn useful strategies while parents can see whether the program is a good fit.
            </p>
          </div>
          <nav aria-label="AhmedPrep programs" className="flex flex-col border-t border-line">
            {programLinks.map((link) => (
              <TrackedLink
                key={link.href}
                href={link.href}
                event={link.event}
                eventProps={{ location: "free_class_parents" }}
                className="flex items-center justify-between border-b border-line py-4 font-extrabold text-navy hover:text-brand"
              >
                {link.label} <ArrowUpRight size={17} aria-hidden="true" />
              </TrackedLink>
            ))}
          </nav>
        </div>
      </section>

      <section id="rsvp" aria-labelledby="rsvp-title" className="scroll-mt-4 bg-white py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow blue">RSVP required</p>
            <h2 id="rsvp-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Reserve a free seat
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">
              Choose SHSAT or Digital SAT and pick a Sunday. The live class access information is sent privately to the email you provide.
              {summary.schedule === "biweekly_2027" || days.some((d) => d.sessions.length > 1)
                ? " To attend both classes on the same Sunday, submit one RSVP for each."
                : ""}
            </p>
            <div className="border-t border-line pt-5">
              <p className="text-sm font-semibold text-ink">Questions before registering?</p>
              <div className="mt-3">
                <CallTextLinks location="free_class_page" />
              </div>
            </div>
          </div>
          <FreeClassRsvpForm
            key={`${initialProgram}-${initialDate}`}
            location="free_class_page"
            classes={classes}
            initialProgram={initialProgram}
            initialDate={initialDate}
          />
        </div>
      </section>

      <Faq id="free-class-faq" title="Free Sunday class questions" items={faqs(summary.schedule === "weekly_2026" ? SCHEDULE_FAQ_2026 : SCHEDULE_FAQ_2027)} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": classes.map((c) => ({
            "@type": "Event",
            "@id": `${pageUrl}#class-${c.id}`,
            name: `${c.title}: ${c.topic}`,
            description: `${c.title} by AhmedPrep: ${c.topic}. ${c.focus}. Live online, ${c.timeLabel}. Free, RSVP required.`,
            url: `${pageUrl}?${c.type === "workshop" ? "" : `class=${c.type}&`}date=${c.isoDate}`,
            startDate: c.startDate,
            endDate: c.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            isAccessibleForFree: true,
            inLanguage: "en-US",
            image: [`${SITE_URL}/ahmedprep-hero.png`],
            location: { "@type": "VirtualLocation", url: pageUrl },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${pageUrl}#rsvp`,
            },
            organizer: { "@type": "EducationalOrganization", name: BUSINESS.name, url: SITE_URL, telephone: BUSINESS.phoneE164 },
            performer: { "@type": "Person", name: FREE_CLASS.instructor },
          })),
        }}
      />
    </>
  )
}
