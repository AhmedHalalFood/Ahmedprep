import type { ReactNode } from "react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { HAS_REVIEW_URL, REVIEW_HREF } from "@/lib/google-reviews"

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
  const external = HAS_REVIEW_URL ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <TrackedLink
      href={REVIEW_HREF}
      event={EVENTS.googleReviewClick}
      eventProps={{ location }}
      className={className}
      {...external}
    >
      {children}
    </TrackedLink>
  )
}
