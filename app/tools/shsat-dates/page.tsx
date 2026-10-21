import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { ToolHero } from "@/components/tools/tool-hero"
import { OFFICIAL_DATES } from "@/lib/official-dates"
import { getSource } from "@/lib/official-sources"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"
import { formatDate, todayInNewYork } from "@/lib/updates"

export const revalidate = 3600

const PATH = "/tools/shsat-dates"
const TITLE = "2026 SHSAT Dates & Registration Deadline"
const DESCRIPTION = "Verified 2026 SHSAT registration deadline and test dates from NYC Public Schools, with days remaining."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH) },
}

const DAY = 86_400_000

function daysUntil(isoDate: string, today: string) {
  return Math.round((Date.parse(`${isoDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY)
}

function countdownLabel(days: number, endDays: number) {
  if (endDays < 0) return "Passed"
  if (days <= 0) return days === 0 ? "Today" : "Underway"
  return days === 1 ? "Tomorrow" : `${days} days left`
}

export default function ShsatDatesPage() {
  const group = OFFICIAL_DATES.find((g) => g.title.includes("SHSAT"))!
  const source = getSource(group.sourceId)
  const today = todayInNewYork()

  return (
    <>
      <JsonLd data={webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION })} />
      <Breadcrumbs items={[{ label: "Free Tools", href: "/tools" }, { label: "SHSAT Dates", href: PATH }]} />
      <ToolHero id="dates-title" eyebrow="Free tool · SHSAT" title="2026 SHSAT Dates & Deadline">
        <p>
          Dates published by NYC Public Schools, last verified by AhmedPrep on <time dateTime={source.lastVerified}>{formatDate(source.lastVerified)}</time>.
        </p>
      </ToolHero>

      <section aria-label="Dates" className="bg-warm pb-14">
        <div className="container max-w-3xl">
          <ul className="flex flex-col border-t-4 border-t-gold bg-white">
            {group.rows.map((row) => {
              const days = daysUntil(row.date, today)
              const endDays = daysUntil(row.endDate ?? row.date, today)
              const passed = endDays < 0
              return (
                <li key={row.label} className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                  <div>
                    <p className={`font-extrabold ${passed ? "text-subtle line-through" : "text-navy"}`}>{row.label}</p>
                    <p className="mt-1 text-sm text-ink">
                      <time dateTime={row.date}>{row.display ?? formatDate(row.date)}</time>
                    </p>
                  </div>
                  <p className={`px-3 py-1.5 text-sm font-extrabold ${passed ? "bg-warm text-subtle" : "bg-brand-soft text-navy"}`}>
                    {countdownLabel(days, endDays)}
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-subtle">
            <p>
              Dates can change. Families register through MySchools, and each student&apos;s test ticket shows their assigned date and
              location. Always confirm on the official page before you plan.
            </p>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
              {source.publisher}: official page <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-line pt-6">
            <Link href={`/updates/${group.updateSlug}`} className="text-link">
              Read the full SHSAT update <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/shsat-final-intensive-2026" className="text-link">
              SHSAT Final Intensive 2026 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/free-diagnostic" className="text-link">
              Book Free Diagnostic <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
