import type { ReactNode } from "react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { REVIEW_HREF } from "@/lib/google-reviews"

/** Every "write a Google review" CTA uses this, so the URL and the GA4 event live in one place. */
export function ReviewLink({
  location,
  className,
  children,
}: {
  location: string
  className?: string
  children: ReactNode
}) {
  return (
    <TrackedLink
      href={REVIEW_HREF}
      event={EVENTS.googleReviewClick}
      eventProps={{ location }}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </TrackedLink>
  )
}
