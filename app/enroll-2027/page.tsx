import type { Metadata } from "next"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { ClassCards } from "@/components/enroll-2027/class-cards"
import { EnrollmentSteps } from "@/components/enroll-2027/enrollment-steps"
import { EnrollmentHelp } from "@/components/enroll-2027/enrollment-help"
import { PayNowSlot } from "@/components/enroll-2027/pay-now-slot"
import { SelectedClassSummary } from "@/components/enroll-2027/selected-class-summary"
import { TERM_IDS, cohortTitle, findCohort, termStartLabel } from "@/lib/cohorts-2027"
import { TuitionOptions } from "@/components/enroll-2027/tuition-options"
import { Enrollment2027Form } from "@/components/enrollment-2027-form"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { Breadcrumbs } from "@/components/landing/primitives"
import { ADDRESS_LINE_1, ADDRESS_LINE_2 } from "@/lib/business"
import { isCohortFull } from "@/lib/cohort-capacity"
import { ENROLLMENT_2027, ENROLLMENT_ACTIONS, REQUEST_NOT_GUARANTEE } from "@/lib/enrollment-2027"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { programsHref } from "@/lib/program-finder"

const PATH = "/enroll-2027"

const ATTENDANCE_FAQS: FaqItem[] = [
  {
    q: "Do classes continue during school holidays?",
    a: "Yes. AhmedPrep follows its published cohort calendar. Approved holiday closures are covered by scheduled makeup sessions; other school breaks do not automatically cancel classes.",
  },
  {
    q: "What happens if AhmedPrep cancels a class?",
    a: "We will provide the published makeup session or equivalent live instruction at no additional cost, preserving the promised 72 hours.",
  },
  {
    q: "What if my child misses a class?",
    a: "Parents may request missed assignments and available class materials. Individual makeup classes are not guaranteed.",
  },
  {
    q: "What happens during severe weather?",
    a: "Classes may move online or be rescheduled. Parents will receive instructions from AhmedPrep.",
  },
  {
    q: "Will my child receive all 72 program hours?",
    a: "Yes. Each program includes 72 hours of scheduled live instruction. Holiday closures and any AhmedPrep cancellations are covered by makeup instruction.",
  },
]

export const metadata: Metadata = {
  title: "2027 SHSAT & Digital SAT Enrollment: Winter, Spring, Summer",
  description:
    "Request enrollment in AhmedPrep's Winter, Spring, or Summer 2027 SHSAT and Digital SAT cohorts in Astoria: small in-person classes of up to 12 students at $20 per instructional hour.",
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, url: absoluteUrl(PATH) },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function Enroll2027Page({ searchParams }: Props) {
  const params = await searchParams
  const cohortParam = first(params.cohort)
  const previewFull = first(params.previewFull) === "1"
  const preset = {
    program: first(params.program),
    term: first(params.term),
    cohortId: cohortParam,
    // Only an exact cohort that is actually full (or preview-full off production) opens the form in waitlist mode.
    waitlist: first(params.intent) === "waitlist" && Boolean(cohortParam) && isCohortFull(cohortParam ?? "", { previewFull }),
    previewFull,
  }
  const E = ENROLLMENT_2027
  const selected = cohortParam ? findCohort(cohortParam) : undefined
  const unknownCohort = Boolean(cohortParam) && !selected
  const facts = [
    { term: "Programs", value: "SHSAT & Digital SAT" },
    { term: "Classes start", value: "January · April · July 2027" },
    { term: "Class size", value: `Max ${E.maxClassSize} students` },
  ]

  const inquirySection = (
    <section aria-labelledby="inquiry-heading" className="scroll-mt-4 bg-white px-5 py-10 sm:py-14" id="inquiry-form">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow blue">{preset.waitlist ? "Waitlist" : "Enrollment request"}</p>
          <h2 id="inquiry-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {preset.waitlist ? "Join this class's waitlist" : ENROLLMENT_ACTIONS.request}
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">No payment is taken here. {REQUEST_NOT_GUARANTEE}</p>
        </div>
        {unknownCohort && (
          <p role="alert" className="border-l-4 border-gold bg-cream p-4 text-sm font-semibold leading-relaxed text-navy">
            We couldn&apos;t find that class. Please choose when to start, the program, and a schedule below.
          </p>
        )}
        <div className="border border-line bg-white p-5 sm:p-8">
          <Enrollment2027Form preset={preset} />
        </div>
        <EnrollmentHelp location="enroll_2027_page" />
      </div>
    </section>
  )

  if (selected) {
    return (
      <>
        <Breadcrumbs items={[{ label: "2027 Enrollment", href: PATH }, { label: cohortTitle(selected), href: `${PATH}?cohort=${selected.id}` }]} />

        <section aria-labelledby="enroll-heading" className="bg-white px-5 pb-10 pt-6 sm:pb-14 sm:pt-10" id="inquiry-form">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="eyebrow blue">{preset.waitlist ? "Class full · Waitlist" : "2027 Enrollment"}</p>
              <h1 id="enroll-heading" className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
                {preset.waitlist ? "Join the waitlist" : ENROLLMENT_ACTIONS.request}
              </h1>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                <span>{`${E.location}: ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`}</span>
              </p>
            </div>

            <SelectedClassSummary cohort={selected} full={preset.waitlist} />
            <PayNowSlot cohort={selected} full={preset.waitlist} />

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-extrabold text-navy">Your details</h2>
              <p className="text-sm leading-relaxed text-subtle">
                {preset.waitlist ? "No payment is taken. Joining the waitlist does not reserve a seat." : `No payment is taken. ${REQUEST_NOT_GUARANTEE}`}
              </p>
            </div>
            <div className="border border-line bg-white p-5 sm:p-8">
              <Enrollment2027Form preset={preset} selectionShownAbove />
            </div>
            <EnrollmentHelp location="enroll_2027_selected" />
            <Link href={programsHref({ season: selected.term })} className="inline-flex min-h-11 items-center self-start text-sm font-bold text-brand underline">
              Compare all {termStartLabel(selected.term)} classes
            </Link>
          </div>
        </section>

        <div className="bg-warm px-5 py-10 sm:py-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-12">
            <EnrollmentSteps />
          </div>
        </div>

        <Faq id="attendance-faq" title="Class attendance and holidays" items={ATTENDANCE_FAQS} />
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "2027 Enrollment", href: PATH }]} />

      <section aria-labelledby="enroll-heading" className="border-b-4 border-gold bg-white px-5 pb-10 pt-10 sm:pt-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="eyebrow blue">2027 Enrollment</p>
            <h1 id="enroll-heading" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
              Enroll in 2027 SHSAT &amp; Digital SAT Prep
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-subtle">
              Classes starting January, April and July 2027 in Astoria. Request enrollment and we&apos;ll confirm availability
              and guide you through the rest.
            </p>
          </div>

          <dl className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
            {facts.map((fact, i) => (
              <div key={fact.term} className={`flex flex-col gap-0.5 py-3 ${i > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-4" : ""}`}>
                <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{fact.term}</dt>
                <dd className="text-lg font-extrabold text-navy">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
              <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <span>
                <span className="font-bold">{`${E.location} location: `}</span>
                {`${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`}
              </span>
            </p>
            <a href="#inquiry-form" className="button button-gold button-lg self-start sm:self-auto">
              {ENROLLMENT_ACTIONS.request}
            </a>
          </div>
        </div>
      </section>

      <div className="bg-warm px-5 py-10 sm:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex flex-col gap-2 border-l-4 border-brand bg-white p-5 text-sm leading-relaxed text-ink">
            <p className="font-extrabold text-navy">Choose when to start</p>
            <p>The classes and tuition below are for January 2027 classes, the only start date with founding-family pricing (25% off, paid in full by December 12, 2026). Spring and Summer offer early-payment pricing instead.</p>
            <ul className="flex flex-col">
              {TERM_IDS.map((id) => (
                <li key={id}>
                  <Link href={programsHref({ season: id })} className="inline-flex min-h-11 items-center font-bold text-brand underline">
                    {`${termStartLabel(id)}: schedules and tuition`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-12">
            <p className="eyebrow blue">Classes starting January 2027</p>
            <ClassCards />
            <TuitionOptions />
          </div>
          <EnrollmentSteps />
        </div>
      </div>

      {inquirySection}

      <Faq id="attendance-faq" title="Class attendance and holidays" items={ATTENDANCE_FAQS} />
    </>
  )
}
