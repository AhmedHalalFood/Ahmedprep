import type { Metadata } from "next"
import Link from "next/link"
import { ReviewLink } from "@/components/review-link"
import { BUSINESS } from "@/lib/business"

export const metadata: Metadata = {
  title: "Share Your AhmedPrep Experience",
  description: "Share your experience with AhmedPrep on Google.",
  robots: { index: false, follow: false },
}

export default function ReviewPage() {
  return (
    <section aria-labelledby="review-title" className="bg-warm py-16 md:py-24">
      <div className="container max-w-2xl">
        <div className="border border-line border-t-4 border-t-gold bg-white p-8 md:p-12">
          <p className="eyebrow blue">Google reviews</p>
          <h1 id="review-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Share Your AhmedPrep Experience
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            Thank you for choosing AhmedPrep. If you&rsquo;d like to share your experience, we&rsquo;d be grateful for your feedback on Google.
          </p>
          <div className="mt-8">
            <ReviewLink location="review_page" className="button button-gold min-h-12">
              Leave AhmedPrep a Google Review
            </ReviewLink>
            <p className="mt-3 text-sm text-subtle">Opens Google in a new tab.</p>
          </div>
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
