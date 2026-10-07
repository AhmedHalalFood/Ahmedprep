import { MAPS_URL } from "@/lib/business"

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
  /** Replace with the Google Business Profile reviews link once available. */
  readMoreUrl: MAPS_URL,
  /** Replace with the "Ask for reviews" link from Google Business Profile (https://g.page/r/.../review). */
  leaveReviewUrl: MAPS_URL,
}

export const GOOGLE_REVIEWS: GoogleReview[] = []
