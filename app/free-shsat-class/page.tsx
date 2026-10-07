import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, BookOpenCheck, MessageCircleQuestion, PencilLine, Target } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { FreeClassRsvpForm } from "@/components/free-class-rsvp-form"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { FreeClassDetails } from "@/components/landing/free-class-details"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS, SITE_URL } from "@/lib/business"
import { FREE_CLASS, getNextClass } from "@/lib/free-class"

export const revalidate = 1800

const description =
  "Join a free, live online SHSAT class every Sunday from 4–5 PM, taught by Tariq Ahmed of AhmedPrep in Astoria, Queens. Instruction, guided practice, and strategy for NYC students. RSVP required."

export const metadata: Metadata = {
  title: "Free Live SHSAT Class Every Sunday | Online via Zoom",
  description,
  alternates: { canonical: FREE_CLASS.path },
  openGraph: {
    title: "Free Live SHSAT Class Every Sunday | AhmedPrep",
    description,
    url: `${SITE_URL}${FREE_CLASS.path}`,
    type: "website",
  },
}

const classParts = [
  {
    icon: BookOpenCheck,
    title: "Live instruction",
    body: "A focused lesson on SHSAT Math or English Language Arts concepts, taught in real time rather than from a recording.",
  },
  {
    icon: PencilLine,
    title: "Guided practice",
    body: "Students work through SHSAT-style questions together with the instructor, so they see how each problem is approached.",
  },
  {
    icon: Target,
    title: "SHSAT strategies",
    body: "Practical test-taking approaches for pacing, eliminating answer choices, and handling the questions that slow students down.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Time for questions",
    body: "Students can ask questions during the class, so confusing topics get cleared up while the material is still fresh.",
  },
]

const faqs: FaqItem[] = [
  {
    q: "Is the class really free?",
    a: "Yes. The Sunday class is free to attend. RSVP is required because seats are limited, and registering does not commit you to any paid program.",
  },
  {
    q: "Who is this SHSAT class for?",
    a: "It is designed for NYC students preparing for the Specialized High Schools Admissions Test, typically students in 7th and 8th grade. Younger students who are starting early are welcome to register.",
  },
  {
    q: "How do we get the Zoom link?",
    a: "After you RSVP, the Zoom meeting details are sent privately to the parent email address on the registration. The link is never posted publicly on the website.",
  },
  {
    q: "What does my student need?",
    a: "A computer or tablet with a reliable internet connection, the Zoom app or a web browser, and a pencil with scratch paper for practice questions.",
  },
  {
    q: "Is this the same as the free diagnostic?",
    a: "No. The live class is a group lesson. The free diagnostic is a separate, individual assessment at our Astoria location that shows exactly where a student stands and what to work on next.",
  },
]

export default function FreeShsatClassPage() {
  const nextClass = getNextClass()
  const pageUrl = `${SITE_URL}${FREE_CLASS.path}`

  return (
    <>
      <Breadcrumbs items={[{ label: "Free SHSAT Class", href: FREE_CLASS.path }]} />

      <section aria-labelledby="free-class-title" className="bg-navy py-14 text-white md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="eyebrow gold">Free weekly SHSAT class</p>
            <h1 id="free-class-title" className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Free Live SHSAT Class Every Sunday
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-white/80">
              Join AhmedPrep for a free, instructor-led SHSAT class every Sunday from 4:00 PM to 5:00 PM.
            </p>
            <ul className="flex flex-col gap-2 border-l-4 border-gold pl-5 text-sm font-extrabold uppercase tracking-widest" aria-label="Class details">
              <li className="text-gold">Live online via Zoom</li>
              <li>Sundays • 4:00 PM–5:00 PM</li>
              <li>Free • RSVP required • Limited seats</li>
            </ul>
            <div>
              <TrackedLink
                href="#rsvp"
                event={EVENTS.freeShsatClassCtaClicked}
                eventProps={{ location: "free_class_hero" }}
                className="button button-gold button-lg"
              >
                Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>
          <FreeClassDetails nextClassLabel={nextClass.shortLabel} />
        </div>
      </section>

      <Section
        id="class"
        eyebrow="What happens in class"
        title="A 60-minute live SHSAT class"
        intro="Each Sunday session is a real class, not a sales presentation. Students learn, practice, and ask questions in one focused hour."
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {classParts.map(({ icon: Icon, title, body }) => (
            <article key={title} className="flex flex-col gap-3 bg-white p-6 sm:p-8">
              <Icon size={24} aria-hidden="true" className="text-brand" />
              <h3 className="text-lg font-extrabold text-navy">{title}</h3>
              <p className="leading-relaxed text-subtle">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="instructor" tone="warm" eyebrow="Your instructor" title="Taught live by Tariq Ahmed">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-subtle">
            Every Sunday class is taught live by Tariq Ahmed, {FREE_CLASS.instructorRole} of AhmedPrep. AhmedPrep prepares students from
            across New York City, including Astoria, Long Island City, and the rest of Queens, for the SHSAT and the Digital SAT.
          </p>
          <dl className="flex flex-col border-t border-line">
            {[
              ["Education", "New York University"],
              ["Classroom", "NYC DOE Educator"],
              ["Experience", "12+ Years of Teaching & Test-Prep Experience"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-line py-4">
                <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{label}</dt>
                <dd className="font-semibold text-navy">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <section id="rsvp" aria-labelledby="rsvp-title" className="scroll-mt-4 bg-white py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow blue">RSVP required</p>
            <h2 id="rsvp-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Reserve a free seat
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">
              Seats are limited. Register below for the upcoming class on <strong className="text-navy">{nextClass.shortLabel}</strong>,{" "}
              {FREE_CLASS.timeLabel}. The Zoom details will be sent privately to the email you provide.
            </p>
            <div className="border-t border-line pt-5">
              <p className="text-sm font-semibold text-ink">Questions before registering?</p>
              <div className="mt-3">
                <CallTextLinks location="free_class_page" />
              </div>
            </div>
            <p className="text-sm text-subtle">
              Want an individual assessment instead?{" "}
              <Link href="/free-diagnostic" className="font-semibold text-navy underline underline-offset-2 hover:text-brand">
                Book a free SHSAT diagnostic
              </Link>
              .
            </p>
          </div>
          <FreeClassRsvpForm location="free_class_page" />
        </div>
      </section>

      <Faq id="free-class-faq" title="Free SHSAT class questions" items={faqs} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: `${FREE_CLASS.name} by AhmedPrep`,
          description,
          url: pageUrl,
          startDate: nextClass.startDate,
          endDate: nextClass.endDate,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          isAccessibleForFree: true,
          inLanguage: "en-US",
          location: { "@type": "VirtualLocation", url: pageUrl },
          eventSchedule: {
            "@type": "Schedule",
            repeatFrequency: "P1W",
            byDay: "https://schema.org/Sunday",
            startTime: "16:00:00",
            endTime: "17:00:00",
            scheduleTimezone: FREE_CLASS.timeZone,
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
            url: `${pageUrl}#rsvp`,
          },
          organizer: { "@type": "EducationalOrganization", name: BUSINESS.name, url: SITE_URL, telephone: BUSINESS.phoneE164 },
          performer: { "@type": "Person", name: FREE_CLASS.instructor, jobTitle: FREE_CLASS.instructorRole },
        }}
      />
    </>
  )
}
