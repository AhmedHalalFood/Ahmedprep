import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { OFFICIAL_DATES } from "@/lib/official-dates"
import { getSource, type SourceId } from "@/lib/official-sources"
import { formatDate, todayInNewYork } from "@/lib/updates"

export function OfficialDates({ className = "" }: { className?: string }) {
  const today = todayInNewYork()
  const sourceIds = [...new Set(OFFICIAL_DATES.map((g) => g.sourceId))] as SourceId[]
  const lastVerified = sourceIds.map((id) => getSource(id).lastVerified).sort()[0]

  return (
    <section aria-labelledby="official-dates-title" className={`border-t-4 border-t-gold bg-navy p-6 text-primary-foreground ${className}`}>
      <p className="eyebrow gold">Official dates</p>
      <h2 id="official-dates-title" className="mt-2 text-xl font-extrabold">
        Official dates at a glance
      </h2>

      <div className="mt-5 flex flex-col gap-5">
        {OFFICIAL_DATES.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-extrabold">
              <Link href={`/updates/${group.updateSlug}`} className="hover:text-gold">
                {group.title}
              </Link>
            </h3>
            <dl className="mt-2 flex flex-col">
              {group.rows.map((row) => {
                const passed = (row.endDate ?? row.date) < today
                return (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-primary-foreground/15 py-2 last:border-b-0">
                    <dt className="text-sm text-primary-foreground/75">{row.label}</dt>
                    <dd className={`text-right text-sm font-bold ${passed ? "text-primary-foreground/50 line-through" : ""}`}>
                      <time dateTime={row.date}>{row.display ?? formatDate(row.date, "short")}</time>
                      {passed && <span className="sr-only"> (passed)</span>}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-primary-foreground/15 pt-4 text-xs text-primary-foreground/75">
        <p>
          Last verified: <time dateTime={lastVerified}>{formatDate(lastVerified)}</time>
        </p>
        <ul className="flex flex-col gap-1.5">
          {sourceIds.map((id) => {
            const source = getSource(id)
            return (
              <li key={id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-gold hover:underline">
                  Official source: {source.publisher}
                  <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
