import { GOOGLE_REVIEWS_CONFIG } from "@/lib/google-reviews"

/**
 * Follow-up templates for after a family has received a service (diagnostic review, a month of classes,
 * end of a program). Send them to every family, not only the ones you expect to be happy, and never offer
 * anything in exchange for a review. Google's policies prohibit both.
 */
export const REVIEW_REQUEST_TEMPLATES = {
  email: {
    subject: "How has AhmedPrep been for your family?",
    body: [
      "Hi [Parent name],",
      "Thank you for trusting AhmedPrep with [Student name]'s [SHSAT / Digital SAT] preparation.",
      "If you have a moment, we'd appreciate hearing about your experience, good or bad, on Google. It helps other NYC families decide whether AhmedPrep is right for them.",
      `Share your experience: ${GOOGLE_REVIEWS_CONFIG.leaveReviewUrl}`,
      "And if anything could be better, please reply to this email directly. We read every message.",
      "Tariq Ahmed\nAhmedPrep",
    ].join("\n\n"),
  },
  text: `Hi [Parent name], this is Tariq from AhmedPrep. If you have a minute, we'd appreciate an honest review of your experience on Google: ${GOOGLE_REVIEWS_CONFIG.leaveReviewUrl} Thank you!`,
} as const
