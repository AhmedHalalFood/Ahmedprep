import { Star } from "lucide-react"
import { ReviewLink } from "@/components/review-link"

export function ReviewInvite() {
  return (
    <section id="google-review" aria-labelledby="google-review-title" className="border-y border-gold/50 bg-gold/15 py-10 md:py-12">
      <div className="container flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 id="google-review-title" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
            Share Your Experience with AhmedPrep
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">
            Have you worked with AhmedPrep? Share your experience on Google to help other families learn about our programs.
          </p>
        </div>
        <ReviewLink location="home_review_invite" className="button button-gold button-lg min-h-12 shrink-0">
          <Star size={18} aria-hidden="true" fill="currentColor" /> Write a Google Review
        </ReviewLink>
      </div>
    </section>
  )
}
