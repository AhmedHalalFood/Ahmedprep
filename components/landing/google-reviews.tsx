import { Star } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import { ReviewLink } from "@/components/review-link"
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_CONFIG } from "@/lib/google-reviews"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-gold" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} aria-hidden="true" fill={i < Math.round(rating) ? "currentColor" : "none"} />
      ))}
    </span>
  )
}

function ReviewLinks({ profileUrl, className = "flex flex-col items-start gap-1" }: { profileUrl: string; className?: string }) {
  return (
    <div className={className}>
      <ReviewLink location="reviews_section" className="button button-gold min-h-12">
        <span aria-hidden="true">★</span> Write a Google Review
      </ReviewLink>
      {profileUrl && (
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand underline-offset-2 hover:underline"
        >
          Read AhmedPrep reviews on Google <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  )
}

export function GoogleReviews() {
  const { rating, reviewCount, readMoreUrl } = GOOGLE_REVIEWS_CONFIG

  if (GOOGLE_REVIEWS.length === 0) {
    return (
      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-4 border-y border-line bg-warm py-8">
        <div className="container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow blue">Google reviews</p>
            <h2 id="reviews-heading" className="text-xl font-extrabold text-navy text-balance">
              Share Your AhmedPrep Experience
            </h2>
            <p className="text-sm leading-relaxed text-subtle">
              If AhmedPrep has helped your family, we&apos;d appreciate hearing about your experience.
            </p>
          </div>
          <ReviewLinks profileUrl={readMoreUrl} />
        </div>
      </section>
    )
  }

  return (
    <Section id="reviews" tone="warm" eyebrow="Google reviews" title="Share Your AhmedPrep Experience">
      <p className="mb-8 max-w-2xl leading-relaxed text-subtle">
        If AhmedPrep has helped your family, we&apos;d appreciate hearing about your experience.
      </p>

      {rating !== null && (
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="text-4xl font-extrabold text-navy">{rating.toFixed(1)}</span>
          <div>
            <Stars rating={rating} />
            {reviewCount !== null && <p className="mt-1 text-sm text-subtle">Based on {reviewCount} Google reviews</p>}
          </div>
        </div>
      )}

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GOOGLE_REVIEWS.map((review) => (
          <li key={review.id} className="flex flex-col gap-4 border border-line bg-white p-6">
            <Stars rating={review.rating} />
            <p className="leading-relaxed text-ink">&ldquo;{review.text}&rdquo;</p>
            <p className="mt-auto text-sm">
              <span className="font-bold text-navy">{review.author}</span>
              <span className="text-subtle"> · {review.date} on Google</span>
            </p>
          </li>
        ))}
      </ul>

      <ReviewLinks profileUrl={readMoreUrl} className="mt-8 flex flex-col items-start gap-1" />
    </Section>
  )
}
