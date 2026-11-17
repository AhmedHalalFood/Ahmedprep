import { ChevronDown, Flag } from "lucide-react"
import { CLASS_DATES, TIMELINE, formatClassDate } from "@/lib/sat-final-intensive"

const PHASE_DATES = [CLASS_DATES.slice(0, 7), CLASS_DATES.slice(7)]

export function SatIntensiveTimeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="scroll-mt-4 bg-site-canvas py-8 md:py-10">
      <div className="container">
        <details className="group rounded-xl border border-line bg-paper">
          <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
            <div className="flex flex-col gap-1">
              <h2 id="timeline-title" className="text-xl font-extrabold text-navy">
                Class timeline: all {CLASS_DATES.length} dates
              </h2>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-subtle" aria-label="Timeline summary">
                {TIMELINE.map((phase) => (
                  <li key={phase.range}>
                    <span className="font-bold text-navy">{phase.range}</span> · {phase.classes} classes
                  </li>
                ))}
                <li>
                  <span className="font-bold text-navy">Dec 5</span> · SAT test day
                </li>
              </ul>
            </div>
            <span className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-navy/20 px-4 text-sm font-bold text-navy sm:self-auto">
              <span className="group-open:hidden">Show dates</span>
              <span className="hidden group-open:inline">Hide dates</span>
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>

          <ol className="grid gap-4 border-t border-line p-5 md:grid-cols-[1fr_1fr_0.8fr]">
            {TIMELINE.map((phase, i) => (
              <li key={phase.range} className="flex flex-col gap-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">
                  Phase {i + 1} · {phase.classes} classes
                </p>
                <h3 className="text-lg font-extrabold text-navy">{phase.range}</h3>
                <p className="text-sm leading-relaxed text-subtle">{phase.focus}</p>
                <ul className="flex flex-wrap gap-1.5" aria-label={`Class dates, ${phase.range}`}>
                  {PHASE_DATES[i].map((d) => (
                    <li key={d} className="rounded-md border border-line bg-cream px-2 py-1 text-xs font-bold text-navy">
                      {formatClassDate(d)}
                    </li>
                  ))}
                </ul>
                {i === 0 && <p className="text-xs font-semibold text-subtle">No class Thursday, Nov 26 (Thanksgiving).</p>}
              </li>
            ))}
            <li className="flex flex-col gap-2 rounded-lg bg-navy p-4 text-cream">
              <Flag size={20} className="text-gold" aria-hidden="true" />
              <h3 className="font-extrabold leading-snug">December 5, 2026: Official SAT</h3>
              <p className="text-sm leading-relaxed text-cream/80">Students register for the SAT separately through the College Board.</p>
            </li>
          </ol>
        </details>
      </div>
    </section>
  )
}
