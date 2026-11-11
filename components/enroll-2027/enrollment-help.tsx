import { HelpCircle, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

const linkClass =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-navy/20 bg-paper px-4 text-sm font-bold text-navy transition-colors hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:flex-none"

/** Call, Text, and Ask a Question stay available beside every enrollment request. */
export function EnrollmentHelp({ location }: { location: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink">Questions first? Reach AhmedPrep directly.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Contact AhmedPrep">
        <TrackedLink
          href={BUSINESS.phoneHref}
          event={EVENTS.phoneClick}
          eventProps={{ location }}
          aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
          className={linkClass}
        >
          <Phone size={16} aria-hidden="true" />
          Call
        </TrackedLink>
        <TrackedLink
          href={BUSINESS.smsHref}
          event={EVENTS.textClick}
          eventProps={{ location }}
          aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
          className={linkClass}
        >
          <MessageSquare size={16} aria-hidden="true" />
          Text
        </TrackedLink>
        <TrackedLink href="/contact" event={EVENTS.programCtaClick} eventProps={{ location, cta: "ask_a_question" }} className={linkClass}>
          <HelpCircle size={16} aria-hidden="true" />
          Ask a Question
        </TrackedLink>
      </div>
    </div>
  )
}
