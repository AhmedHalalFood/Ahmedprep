import { ArrowUpRight, Star } from "lucide-react"
import { Section } from "@/components/landing/primitives"
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

function ReviewLinks({ readMoreUrl, leaveReviewUrl }: { readMoreUrl: string; leaveReviewUrl: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={readMoreUrl} target="_blank" rel="noopener noreferrer" className="button button-gold">
        Read more reviews on Google <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <a
        href={leaveReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center gap-2 border border-navy/25 px-5 text-xs font-extrabold uppercase tracking-wider text-navy transition-colors hover:bg-navy/5"
      >
        Leave a review <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  )
}

export function GoogleReviews() {
  const { rating, reviewCount, readMoreUrl, leaveReviewUrl } = GOOGLE_REVIEWS_CONFIG

  if (GOOGLE_REVIEWS.length === 0) {
    return (
      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-4 border-y border-line bg-warm py-8">
        <div className="container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow blue">Google reviews</p>
            <h2 id="reviews-heading" className="text-xl font-extrabold text-navy text-balance">
              What AhmedPrep families say
            </h2>
            <p className="text-sm leading-relaxed text-subtle">Read parent and student reviews, or share your own experience.</p>
          </div>
          <ReviewLinks readMoreUrl={readMoreUrl} leaveReviewUrl={leaveReviewUrl} />
        </div>
      </section>
    )
  }

  return (
    <Section id="reviews" tone="warm" eyebrow="Google reviews" title="What AhmedPrep families say">
      {rating !== null && (
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="text-4xl font-extrabold text-navy">{rating.toFixed(1)}</span>
          <div>
            <Stars rating={rating} />
            {reviewCount !== null && <p className="mt-1 text-sm text-subtle">Based on {reviewCount} Google reviews</p>}
          </div>
        </div>
      )}

      {GOOGLE_REVIEWS.length > 0 ? (
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
      ) : (
        <p className="max-w-2xl leading-relaxed text-subtle">
          Read what parents and students have shared about AhmedPrep on our Google Business Profile, and tell other families about your
          experience.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={readMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-gold"
        >
          Read more reviews on Google <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          href={leaveReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 border border-navy/25 px-5 text-xs font-extrabold uppercase tracking-wider text-navy transition-colors hover:bg-navy/5"
        >
          Leave a review <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Section>
  )
}
