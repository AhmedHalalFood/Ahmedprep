import { Section } from "@/components/landing/primitives"
import { STATS, STATS_DISCLAIMER } from "@/lib/business"

export function ResultsSection({ title = "Results families can measure" }: { title?: string }) {
  return (
    <Section id="results" tone="navy" eyebrow="Results" title={title}>
      <dl className="grid grid-cols-2 border-t border-white/15 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-2 border-b border-white/15 py-8 pr-4 ${i % 2 === 1 ? "pl-6" : ""} lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
          >
            <dt className="order-2 text-sm font-semibold text-white/70">{stat.label}</dt>
            <dd className="text-3xl font-extrabold tracking-tight text-gold md:text-4xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/60">* {STATS_DISCLAIMER}</p>
    </Section>
  )
}
