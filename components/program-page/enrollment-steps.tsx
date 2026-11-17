import { CalendarDays, ClipboardCheck, Info, MessageSquareText, ShieldCheck } from "lucide-react"
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
      icon: CalendarDays,
      title: "Review the available cohort",
      body: `Compare the ${program} weekday, weekend, and summer options above by schedule, dates, hours, and tuition.`,
    },
    {
      icon: ClipboardCheck,
      title: "Request a free diagnostic",
      body: "A timed diagnostic in Astoria shows your child's starting point and helps confirm which cohort fits.",
    },
    {
      icon: MessageSquareText,
      title: "Submit an enrollment inquiry",
      body: "Tell us the cohort you are interested in. We reply with next steps and current seat information.",
    },
    {
      icon: ShieldCheck,
      title: "Complete registration and payment",
      body: "Registration and payment are completed through AhmedPrep's approved process when it is available for your cohort.",
    },
  ]
  return (
    <Section id="enrollment" tone="warm" eyebrow="How enrollment works" title={`Enrolling in ${program} classes for 2027`}>
      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <li
              key={step.title}
              className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[#D7E4EC] bg-white p-5 shadow-sm sm:p-6"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#93BDD8]" />
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-[#EAF3F9] text-sm font-extrabold text-navy">
                  {i + 1}
                </span>
                <Icon size={23} aria-hidden="true" className="text-[#35769F]" />
              </div>
              <h3 className="text-lg font-extrabold leading-snug text-navy">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-subtle">{step.body}</p>
            </li>
          )
        })}
      </ol>
      <div className="mt-6 rounded-2xl border border-[#D7E4EC] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3 rounded-xl bg-[#F1F7FB] p-4">
          <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-ink">
            <strong className="text-navy">An inquiry is not an enrollment.</strong> Submitting an inquiry does not reserve a
            seat. A seat is confirmed only after registration is complete and payment has been received and confirmed by
            AhmedPrep. Classes are limited to 12 students.
          </p>
        </div>
        <p className="mt-5 text-base font-extrabold text-navy">Ready to take the next step?</p>
        <ProgramCtas program={program} location={location} diagnosticEvent={diagnosticEvent} className="mt-3" />
      </div>
    </Section>
  )
}
