import { Check } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { DiagnosticForm, type Program } from "@/components/diagnostic-form"
import { ADDRESS_LINE_1, ADDRESS_LINE_2 } from "@/lib/business"

const DEFAULT_POINTS = [
  "A timed, test-style assessment",
  "A clear breakdown of strengths and gaps",
  "A parent consultation with next steps",
  "No cost and no obligation",
]

export function DiagnosticSection({
  program = "",
  location,
  title = "Book a free diagnostic",
  intro = "Tell us about your student. We'll contact you to confirm a diagnostic time at our Astoria location.",
  points = DEFAULT_POINTS,
}: {
  program?: Program | ""
  location: string
  title?: string
  intro?: string
  points?: string[]
}) {
  return (
    <section id="diagnostic" aria-labelledby={`${location}-diagnostic-title`} className="scroll-mt-4 bg-cream py-16 md:py-20">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="eyebrow blue">Free diagnostic</p>
          <h2 id={`${location}-diagnostic-title`} className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            {title}
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">{intro}</p>
          <ul className="flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-ink">
                <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {point}
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-6">
            <p className="text-sm font-semibold text-ink">Prefer to talk first?</p>
            <div className="mt-3">
              <CallTextLinks location={`${location}_diagnostic`} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-subtle">
              {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
            </p>
          </div>
        </div>
        <DiagnosticForm defaultProgram={program} location={location} />
      </div>
    </section>
  )
}
