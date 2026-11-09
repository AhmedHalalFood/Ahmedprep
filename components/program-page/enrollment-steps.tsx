import { Info } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import { ProgramCtas } from "@/components/program-page/program-ctas"
import type { EventName } from "@/lib/analytics"
import type { ProgramId } from "@/lib/cohorts-2027"

export function EnrollmentSteps({
  program,
  location,
  diagnosticEvent,
}: {
  program: ProgramId
  location: string
  diagnosticEvent: EventName
}) {
  const steps = [
    {
      title: "Review the available cohort",
      body: `Compare the ${program} weekday, weekend, and summer options above by schedule, dates, hours, and tuition.`,
    },
    {
      title: "Request a free diagnostic",
      body: "A timed diagnostic in Astoria shows your child's starting point and helps confirm which cohort fits.",
    },
    {
      title: "Submit an enrollment inquiry",
      body: "Tell us the cohort you are interested in. We reply with next steps and current seat information.",
    },
    {
      title: "Complete registration and payment",
      body: "Registration and payment are completed through AhmedPrep's approved process when it is available for your cohort.",
    },
  ]
  return (
    <Section id="enrollment" tone="warm" eyebrow="How enrollment works" title={`Enrolling in ${program} classes for 2027`}>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-2 border-t-4 border-navy bg-background p-6">
            <span className="text-sm font-extrabold text-brand">Step {i + 1}</span>
            <h3 className="text-lg font-extrabold text-navy">{step.title}</h3>
            <p className="leading-relaxed text-subtle">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 flex max-w-3xl items-start gap-3 border border-line bg-background p-5 leading-relaxed text-ink">
        <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
        <span>
          <strong className="text-navy">An inquiry is not an enrollment.</strong> Submitting an inquiry does not reserve a
          seat. A seat is confirmed only after registration is complete and payment has been received and confirmed by
          AhmedPrep. Classes are limited to 12 students.
        </span>
      </p>
      <ProgramCtas program={program} location={location} diagnosticEvent={diagnosticEvent} className="mt-8" />
    </Section>
  )
}
