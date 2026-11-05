import { ENROLLMENT_2027 as E } from "@/lib/enrollment-2027"

export function EnrollmentSteps() {
  return (
    <section aria-labelledby="steps-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow blue">How to enroll</p>
        <h2 id="steps-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Three simple steps
        </h2>
      </div>
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {E.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 border border-line bg-white p-5">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center bg-gold text-base font-extrabold text-navy"
            >
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-extrabold leading-snug text-navy">{step.title}</h3>
              <p className="text-sm leading-relaxed text-subtle">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
