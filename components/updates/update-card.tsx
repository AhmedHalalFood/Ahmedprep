import Link from "next/link"
import { ArrowUpRight, ShieldCheck } from "lucide-react"
import { getSource } from "@/lib/official-sources"
import { filterLabel, formatDate, nextKeyDate, type Update } from "@/lib/updates"

export function UpdateCard({ update, headingLevel = "h3" }: { update: Update; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  const source = getSource(update.sourceId)
  const keyDate = nextKeyDate(update) ?? update.keyDates.at(-1)
  const passed = keyDate && !nextKeyDate(update)
  const href = `/updates/${update.slug}`

  return (
    <article className="flex h-full flex-col border border-line bg-white p-6">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] font-extrabold uppercase tracking-[0.14em]">
        <span className="text-brand">{filterLabel(update.filter)}</span>
        <span aria-hidden="true" className="text-line">
          /
        </span>
        <span className="text-subtle">{update.topic}</span>
      </p>
      <Heading className="mt-4 text-pretty text-lg font-extrabold leading-snug text-navy">
        <Link href={href} className="hover:text-brand">
          {update.title}
        </Link>
      </Heading>
      <p className="mt-2 text-sm leading-relaxed text-subtle">{update.summary}</p>

      {keyDate && (
        <dl className="mt-5 flex items-baseline justify-between gap-3 bg-warm px-4 py-3">
          <dt className="text-xs font-bold text-subtle">{keyDate.label}</dt>
          <dd className={`text-sm font-extrabold ${passed ? "text-subtle line-through" : "text-navy"}`}>
            <time dateTime={keyDate.date}>{formatDate(keyDate.date, "short")}</time>
            {passed && <span className="sr-only"> (date has passed)</span>}
          </dd>
        </dl>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-5">
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-subtle">
          <ShieldCheck size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-gold-deep" />
          <span>
            {source.official ? "Verified" : "Updated"} <time dateTime={source.lastVerified}>{formatDate(source.lastVerified, "short")}</time>
            {" · "}
            Source: {source.name}
          </span>
        </p>
        <Link href={href} className="text-link self-start">
          Read more <span className="sr-only">about {update.title}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
