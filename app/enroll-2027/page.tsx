import type { Metadata } from "next"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import { activeTermIds, isCohortActive, isTermActive, nyCalendarDate } from "@/lib/program-retirement"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { EnrollmentSteps } from "@/components/enroll-2027/enrollment-steps"
import { AnnualShsatPackage } from "@/components/program-page/annual-shsat-package"
import { EnrollmentHelp } from "@/components/enroll-2027/enrollment-help"
import { PayNowSlot } from "@/components/enroll-2027/pay-now-slot"
import { SelectedClassSummary } from "@/components/enroll-2027/selected-class-summary"
import { isOnlineCohort, cohortTitle, findCohort, termStartLabel, WINTER_FOUNDING_DEADLINE_ISO, FOUNDING_SEATS_PER_COHORT, DEADLINE_TIME_LABEL, dollars, priceFor } from "@/lib/cohorts-2027"
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
    q: "Are classes held during school holidays or severe weather?",
    a: "AhmedPrep follows each cohort's published calendar. If an AhmedPrep class is canceled for a holiday, severe weather, or another reason, families will be notified and live makeup instruction arranged to preserve the scheduled hours. Proposed makeup dates are confirmed before enrollment is finalized.",
  },
  {
    q: "What if my child misses a class?",
    a: "Parents may request missed assignments and available class materials. Individual makeup instruction for student absences is not guaranteed.",
  },
  {
    q: "How many instructional hours are included?",
    a: "Winter and Spring classes include 72 instructional hours; the Summer and Fall SHSAT intensives include 96. Summer and Fall Digital SAT weekend intensives include 72 instructional hours, excluding a 30-minute break from each five-hour session.",
  },
]

export const metadata: Metadata = {
  title: "2027 SHSAT & Digital SAT Enrollment: Winter through Fall",
  description:
    "Request enrollment in AhmedPrep's Winter, Spring, Summer, or Fall 2027 SHSAT and Digital SAT cohorts in Astoria: small-group classes of up to 12 students, including live online Winter and Spring weekday Digital SAT, at $20 per instructional hour.",
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, url: absoluteUrl(PATH) },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function Enroll2027Page({ searchParams }: Props) {
  await connection()
  if (!activeTermIds().length) redirect("/free-diagnostic")
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
  const winterActive = isTermActive("winter")
  const foundingOfferOpen = winterActive && nyCalendarDate() <= WINTER_FOUNDING_DEADLINE_ISO
  const winterTuition = priceFor({term:"winter", hours:72})
  const requested = cohortParam ? findCohort(cohortParam) : undefined
  const selected = requested && isCohortActive(requested) ? requested : undefined
  const unknownCohort = Boolean(cohortParam) && !selected


  const inquirySection = (
    <section aria-labelledby="inquiry-heading" className="scroll-mt-4 bg-white px-5 py-8 sm:py-10" id="inquiry-form">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow blue">{preset.waitlist ? "Waitlist" : "Enrollment request"}</p>
          <h2 id="inquiry-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {preset.waitlist ? "Join this class's waitlist" : ENROLLMENT_ACTIONS.request}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-subtle">Start by choosing a class. Add your contact details next, and AhmedPrep will follow up about availability and payment.</p>
        </div>
        {unknownCohort && (
          <p role="alert" className="border-l-4 border-gold bg-cream p-4 text-sm font-semibold leading-relaxed text-navy">
            This class may have ended or is no longer offered. Please choose from the available programs in the form.
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
                <span>{isOnlineCohort(selected) ? "Live online via Zoom · 6:30–9:30 PM Eastern" : `${E.location}: ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`}</span>
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


      <section aria-labelledby="enroll-heading" className="border-b-4 border-gold bg-white px-5 pb-7 pt-7 sm:pb-9 sm:pt-9">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="eyebrow blue">{winterActive ? "2027 Enrollment · Winter classes open" : "2027 Enrollment"}</p>
            <h1 id="enroll-heading" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              Enroll in SHSAT or Digital SAT Prep
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-subtle sm:text-base">
              Choose a 2027 class personally taught by founder Tariq Ahmed. Small groups in Astoria; Winter and Spring weekday Digital SAT classes meet live on Zoom.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-navy">
              <span>Winter · Spring · Summer · Fall</span>
              <span>Maximum {E.maxClassSize} students per class</span>
            </div>
            {winterActive && (
              <div id="winter-tuition" className="scroll-mt-6 rounded-xl border border-[#E8D5A2] bg-[#FFF8E7] p-4 text-navy sm:p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#79570A]">
                  {foundingOfferOpen ? "Winter 2027 · Founding-family tuition" : "Winter 2027 · Regular tuition"}
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <strong className="text-3xl font-black leading-tight">{dollars(foundingOfferOpen ? winterTuition.founding! : winterTuition.regular)}</strong>
                  {foundingOfferOpen && <span className="text-sm font-medium text-navy/75">Regular {dollars(winterTuition.regular)}</span>}
                </div>
                <p className="mt-1 text-sm font-bold">{foundingOfferOpen ? "Save $360 (25%)" : "24 classes"} · 72 instructional hours · Max 12 students per class</p>
                <div className="mt-3 space-y-1.5 border-t border-[#E8D5A2] pt-3 text-sm leading-relaxed">
                  {foundingOfferOpen ? (
                    <>
                      <p>Limited to the first {FOUNDING_SEATS_PER_COHORT} fully paid students per class, subject to seat availability.</p>
                      <p className="font-bold">Full payment due by December 12, 2026 at {DEADLINE_TIME_LABEL}.</p>
                    </>
                  ) : <p>Full payment is required to confirm enrollment.</p>}
                  <p className="text-xs text-navy/80">Submitting an inquiry does not reserve a seat or tuition rate. No online payment is collected on this page.</p>
                </div>
              </div>
            )}
            <Link href="/programs-2027" className="inline-flex min-h-10 items-center self-start text-sm font-bold text-brand underline underline-offset-4">
              Compare all 2027 programs and tuition
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
              <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <span>In-person classes: <strong>{ADDRESS_LINE_1}, {ADDRESS_LINE_2}</strong></span>
            </p>
            <a href="#inquiry-form" className="button button-gold button-lg self-start sm:self-auto">
              Choose a class &amp; request enrollment
            </a>
          </div>
        </div>
      </section>

      {inquirySection}

      <div className="bg-white px-5 pb-8 pt-2">
        <div className="mx-auto max-w-5xl">
          <AnnualShsatPackage compact />
        </div>
      </div>

      <div className="bg-warm px-5 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <EnrollmentSteps />
        </div>
      </div>

      <Faq id="attendance-faq" title="Class attendance and holidays" items={ATTENDANCE_FAQS} />
    </>
  )
}
