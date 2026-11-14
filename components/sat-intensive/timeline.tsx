import { Flag } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import { CLASS_DATES, TIMELINE, formatClassDate } from "@/lib/sat-final-intensive"

const PHASE_DATES = [CLASS_DATES.slice(0, 7), CLASS_DATES.slice(7)]

export function SatIntensiveTimeline() {
  return (
    <Section id="timeline" eyebrow="Course timeline" title="Three weeks, two phases, one test day">
      <ol className="relative grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
        {TIMELINE.map((phase, i) => (
          <li key={phase.range} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Phase {i + 1}</p>
              <p className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">{phase.classes} classes</p>
            </div>
            <h3 className="text-2xl font-extrabold text-navy">{phase.range}</h3>
            <p className="leading-relaxed text-subtle">{phase.focus}</p>
            <ul className="flex flex-wrap gap-2" aria-label={`Class dates, ${phase.range}`}>
              {PHASE_DATES[i].map((d) => (
                <li key={d} className="rounded-md border border-line bg-warm px-2.5 py-1 text-xs font-bold text-navy">
                  {formatClassDate(d)}
                </li>
              ))}
            </ul>
            {i === 0 && <p className="text-sm font-semibold text-subtle">No class Thursday, Nov 26 (Thanksgiving).</p>}
          </li>
        ))}
        <li className="flex flex-col justify-center gap-3 rounded-xl border-2 border-gold bg-navy p-6 text-white">
          <Flag size={28} className="text-gold" aria-hidden="true" />
          <p className="text-xs font-extrabold uppercase tracking-wider text-gold">Reminder</p>
          <h3 className="text-2xl font-extrabold leading-tight">December 5, 2026: Official SAT Exam</h3>
          <p className="text-sm leading-relaxed text-white/75">
            Students register for the SAT separately through the College Board.
          </p>
        </li>
      </ol>
    </Section>
  )
}
