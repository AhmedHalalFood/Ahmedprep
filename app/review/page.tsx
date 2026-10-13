import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BUSINESS } from "@/lib/business"
import { GOOGLE_REVIEW_URL } from "@/lib/google-reviews"

export const metadata: Metadata = {
  title: "Share Your AhmedPrep Experience",
  description: "Share your experience with AhmedPrep on Google.",
  robots: { index: false, follow: false },
}

export default function ReviewPage() {
  if (/^https:\/\//i.test(GOOGLE_REVIEW_URL)) {
    redirect(GOOGLE_REVIEW_URL)
  }

  return (
    <section aria-labelledby="review-title" className="bg-warm py-16 md:py-24">
      <div className="container max-w-2xl">
        <div className="border border-line border-t-4 border-t-gold bg-white p-8 md:p-12">
          <p className="eyebrow blue">Google reviews</p>
          <h1 id="review-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Share Your AhmedPrep Experience
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            Our Google review link is coming soon. Thank you for wanting to share your experience!
          </p>
          <div className="mt-8 flex flex-col items-start gap-1 border-t border-line pt-6">
            <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-2 hover:underline">
              Back to home
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-2 hover:underline"
            >
              Call us: {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
