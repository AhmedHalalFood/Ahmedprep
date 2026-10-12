import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { GOOGLE_REVIEWS_CONFIG } from "@/lib/google-reviews"

/** Secondary, optional review link. No incentives and shown to everyone, per Google's review policies. */
export function ShareExperienceLink({ location, lead }: { location: string; lead: string }) {
  const { leaveReviewUrl } = GOOGLE_REVIEWS_CONFIG
  if (!leaveReviewUrl) return null

  return (
    <p className="text-sm leading-relaxed text-subtle">
      {lead}{" "}
      <TrackedLink
        href={leaveReviewUrl}
        event={EVENTS.reviewLinkClick}
        eventProps={{ location }}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-semibold text-brand underline-offset-2 hover:underline"
      >
        Share Your AhmedPrep Experience <ArrowUpRight size={14} aria-hidden="true" />
      </TrackedLink>
    </p>
  )
}
