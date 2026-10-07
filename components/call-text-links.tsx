import { MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

/** Secondary CTA: one bordered control split into Call and Text. */
export function CallTextLinks({ location, tone = "light" }: { location: string; tone?: "light" | "dark" }) {
  const base =
    tone === "dark"
      ? "border-white/30 text-white hover:bg-white/10 divide-white/30"
      : "border-navy/25 text-navy hover:bg-navy/5 divide-navy/25"
  return (
    <div className={`inline-flex min-h-12 items-stretch divide-x border bg-transparent ${base}`} role="group" aria-label="Call or text AhmedPrep">
      <TrackedLink
        href={BUSINESS.phoneHref}
        event={EVENTS.phoneClick}
        eventProps={{ location }}
        className="inline-flex items-center gap-2 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors"
        aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
      >
        <Phone size={16} aria-hidden="true" />
        Call
      </TrackedLink>
      <TrackedLink
        href={BUSINESS.smsHref}
        event={EVENTS.textClick}
        eventProps={{ location }}
        className="inline-flex items-center gap-2 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors"
        aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
      >
        <MessageSquare size={16} aria-hidden="true" />
        Text AhmedPrep
      </TrackedLink>
    </div>
  )
}
