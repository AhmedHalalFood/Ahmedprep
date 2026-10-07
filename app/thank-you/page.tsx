import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, CircleCheck } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your AhmedPrep diagnostic request was received.",
  robots: { index: false, follow: false },
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const { program } = await searchParams
  const isSat = program === "Digital SAT"
  const guideHref = isSat ? "/resources/digital-sat-guide" : "/resources/shsat-guide"
  return (
    <section aria-labelledby="thank-you-title" className="bg-warm py-16 md:py-24">
      <div className="container max-w-2xl">
        <div className="border border-line border-t-4 border-t-gold bg-white p-8 md:p-12">
          <CircleCheck size={40} aria-hidden="true" className="text-brand" />
          <h1 id="thank-you-title" className="mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Thank you for registering with AhmedPrep.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            We received your diagnostic request and will contact you shortly to confirm your appointment.
          </p>
          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm font-semibold text-ink">Need to reach us sooner?</p>
            <div className="mt-3">
              <CallTextLinks location="thank_you" />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link href={guideHref} className="text-link">
              Read the {isSat ? "Digital SAT" : "SHSAT"} guide <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/" className="text-link">
              Back to home <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
