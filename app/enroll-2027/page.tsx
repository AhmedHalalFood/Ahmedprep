import type { Metadata } from "next"
import { Enrollment2027Form } from "@/components/enrollment-2027-form"
import { Breadcrumbs } from "@/components/landing/primitives"
import { ENROLLMENT_2027, scheduleLabel, startLabel } from "@/lib/enrollment-2027"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

const PATH = "/enroll-2027"

export const metadata: Metadata = {
  title: "January 2027 SHSAT & Digital SAT Enrollment Inquiry",
  description:
    "Request enrollment information for AhmedPrep's January 2027 SHSAT and Digital SAT programs: 12 weeks, 72 hours, small classes of no more than 10 students.",
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, url: absoluteUrl(PATH) },
}

export default function Enroll2027Page() {
  const E = ENROLLMENT_2027
  return (
    <>
      <Breadcrumbs items={[{ label: "January 2027 Enrollment", href: PATH }]} />
      <section className="bg-white px-5 py-10 text-navy sm:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-6 lg:w-80 lg:shrink-0">
            <div className="flex flex-col gap-3">
              <p className="eyebrow blue">{E.eyebrow}</p>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Enrollment Inquiry</h1>
              <p className="text-pretty leading-relaxed text-subtle">
                {`${E.weeks} weeks, ${E.hours} instructional hours, and no more than ${E.maxClassSize} students per class. ${E.launchNote}`}
              </p>
            </div>
            <div className="flex flex-col gap-4 border-t-4 border-gold pt-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider">Class schedules</h2>
              {E.programs.map((p) => (
                <div key={p.id} className="flex flex-col gap-1">
                  <h3 className="font-bold">{p.name}</h3>
                  <ul className="flex flex-col gap-2 text-sm leading-relaxed text-subtle">
                    {p.schedules.map((s) => (
                      <li key={s.label} className="flex flex-col">
                        <span>{scheduleLabel(s)}</span>
                        <span className="font-semibold text-brand">{startLabel(s)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 border-t border-line pt-4 text-sm leading-relaxed">
              <p>
                <span className="font-bold">{E.tuition.regular.label}:</span>{" "}
                {`${E.tuition.regular.total} ${E.tuition.regular.installments}`}
              </p>
              <p>
                <span className="font-bold">{E.tuition.founding.label}:</span>{" "}
                {`${E.tuition.founding.total} ${E.tuition.founding.installments}`}
              </p>
              <p className="text-subtle">{`Founding families save ${E.tuition.founding.savings}. Founding-family tuition has limited availability.`}</p>
            </div>
          </div>
          <div className="flex-1 border border-line bg-white p-5 sm:p-8">
            <Enrollment2027Form />
          </div>
        </div>
      </section>
    </>
  )
}
