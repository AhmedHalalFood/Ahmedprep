import type { Metadata } from "next"
import { MapPin } from "lucide-react"
import { ClassCards } from "@/components/enroll-2027/class-cards"
import { EnrollmentSteps } from "@/components/enroll-2027/enrollment-steps"
import { TuitionOptions } from "@/components/enroll-2027/tuition-options"
import { Enrollment2027Form } from "@/components/enrollment-2027-form"
import { Breadcrumbs } from "@/components/landing/primitives"
import { ADDRESS_LINE_1, ADDRESS_LINE_2 } from "@/lib/business"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

const PATH = "/enroll-2027"

export const metadata: Metadata = {
  title: "January 2027 SHSAT & Digital SAT Enrollment",
  description:
    "Enroll in AhmedPrep's January 2027 SHSAT and Digital SAT programs in Astoria: 12 weeks, 72 instructional hours, and no more than 12 students per class.",
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, url: absoluteUrl(PATH) },
}

export default function Enroll2027Page() {
  const E = ENROLLMENT_2027
  const facts = [
    { term: "Programs", value: "SHSAT & Digital SAT" },
    { term: "Length", value: `${E.weeks} weeks · ${E.hours} hours` },
    { term: "Class size", value: `Max ${E.maxClassSize} students` },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "January 2027 Enrollment", href: PATH }]} />

      <section aria-labelledby="enroll-heading" className="border-b-4 border-gold bg-white px-5 pb-10 pt-10 sm:pt-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="eyebrow blue">{E.eyebrow}</p>
            <h1 id="enroll-heading" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
              Enroll for January 2027
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-subtle">
              Small-group SHSAT and Digital SAT preparation in Astoria. Start with a free inquiry and we&apos;ll guide you
              through the rest.
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
              Start Free Inquiry
            </a>
          </div>
        </div>
      </section>

      <div className="bg-warm px-5 py-10 sm:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <ClassCards />
          <TuitionOptions />
          <EnrollmentSteps />
        </div>
      </div>

      <section aria-labelledby="inquiry-heading" className="scroll-mt-4 bg-white px-5 py-10 sm:py-14" id="inquiry-form">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="eyebrow blue">Step 1</p>
            <h2 id="inquiry-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Free enrollment inquiry
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">
              No payment is taken here. We&apos;ll contact you to confirm availability and send payment instructions.
            </p>
          </div>
          <div className="border border-line bg-white p-5 sm:p-8">
            <Enrollment2027Form />
          </div>
        </div>
      </section>
    </>
  )
}
