import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/landing/primitives"
import { EnrollmentFlow } from "@/components/enroll/enrollment-flow"

export const metadata: Metadata = {
  title: "Enroll in SHSAT or Digital SAT Prep",
  description:
    "Choose a program and class schedule, add student and parent details, and review AhmedPrep tuition options.",
  // Design preview: keep out of search results until payments are approved and live.
  robots: { index: false, follow: false },
}

export default function EnrollPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Enroll", href: "/enroll" }]} />
      <section className="bg-warm px-4 py-8 text-navy sm:px-5 sm:py-14">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <header className="flex flex-col gap-3">
            <p className="eyebrow blue">AhmedPrep Enrollment</p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Enroll your student</h1>
            <p className="text-pretty leading-relaxed text-subtle">
              Five short steps: choose a program and class, add your details, pick a tuition option, and review
              everything before payment. Small classes of no more than 12 students.
            </p>
          </header>
          <EnrollmentFlow />
        </div>
      </section>
    </>
  )
}
