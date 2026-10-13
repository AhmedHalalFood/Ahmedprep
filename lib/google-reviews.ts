/**
 * Verified Google review-writing link (https://g.page/r/.../review or
 * https://search.google.com/local/writereview?placeid=...). Set NEXT_PUBLIC_GOOGLE_REVIEW_URL.
 * Never substitute a Google Maps search URL.
 */
export const GOOGLE_REVIEW_URL = (process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "").trim()

/** Public Google Business Profile URL. Set NEXT_PUBLIC_GOOGLE_PROFILE_URL. */
export const GOOGLE_PROFILE_URL = (process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ?? "").trim()

export type GoogleReview = {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  /** Relative date as shown on Google, e.g. "2 months ago" */
  date: string
  text: string
}

/**
 * Paste genuine Google reviews here (copied verbatim, with the reviewer's displayed name).
 * Leave rating/reviewCount as null until you copy them from the Google Business Profile.
 */
export const GOOGLE_REVIEWS_CONFIG = {
  rating: null as number | null,
  reviewCount: null as number | null,
  /** Empty until NEXT_PUBLIC_GOOGLE_PROFILE_URL is set; the "Read reviews" link is hidden while empty. */
  readMoreUrl: GOOGLE_PROFILE_URL,
  /** Null until NEXT_PUBLIC_GOOGLE_REVIEW_URL is set. All write-a-review CTAs point to /review, which redirects here. */
  leaveReviewUrl: (GOOGLE_REVIEW_URL || null) as string | null,
}

export const GOOGLE_REVIEWS: GoogleReview[] = []
