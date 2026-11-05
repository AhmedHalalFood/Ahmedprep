import { Check } from "lucide-react"
import { ENROLLMENT_2027 as E } from "@/lib/enrollment-2027"

export function TuitionOptions() {
  const tiers = [
    { ...E.tuition.founding, featured: true },
    { ...E.tuition.early, featured: false },
    { ...E.tuition.regular, featured: false },
  ]

  return (
    <section aria-labelledby="tuition-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow blue">Tuition</p>
        <h2 id="tuition-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Tuition and deadlines
        </h2>
        <p className="text-pretty leading-relaxed text-subtle">
          {`Tuition covers the full ${E.weeks}-week program and is the same for SHSAT and Digital SAT.`}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {tiers.map((tier) => (
          <li
            key={tier.label}
            className={`flex flex-col gap-4 p-5 ${tier.featured ? "bg-navy text-primary-foreground" : "border border-line bg-white text-navy"}`}
          >
            <div className="flex flex-col gap-1">
              <h3 className={`text-sm font-extrabold uppercase tracking-wider ${tier.featured ? "text-gold" : "text-brand"}`}>
                {tier.label}
              </h3>
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-4xl font-extrabold leading-none">{tier.total}</span>
                {tier.savingsLabel && (
                  <span
                    className={`px-2 py-1 text-sm font-extrabold uppercase tracking-wide ${tier.featured ? "bg-gold text-navy" : "bg-brand-soft text-navy"}`}
                  >
                    <span className="sr-only">{"— "}</span>
                    {tier.savingsLabel}
                  </span>
                )}
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed">
              {tier.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <Check size={16} aria-hidden="true" className={`mt-1 shrink-0 ${tier.featured ? "text-gold" : "text-brand"}`} />
                  <span className={tier.featured ? "text-primary-foreground" : "text-ink"}>{point}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-l-4 border-gold bg-cream px-4 py-3 text-sm leading-relaxed text-navy">
        <p className="font-bold">{E.tuition.rules}</p>
        <p>{E.tuition.seatNote}</p>
      </div>
    </section>
  )
}
