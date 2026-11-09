import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { MAX_CLASS_SIZE, TERMS_2027, dollars, priceFor } from "@/lib/cohorts-2027"

const lowestTuition = dollars(
  Math.min(...TERMS_2027.flatMap((term) => term.cohorts.map((cohort) => priceFor(cohort).regular))),
)

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 bg-cream py-6">
      <div className="container flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex shrink-0 flex-col gap-1 lg:w-96 lg:border-r lg:border-line lg:pr-6">
          <p className="eyebrow">Our 2027 programs</p>
          <h2
            id="programs-pricing-title"
            className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy md:text-[1.7rem]"
          >
            SHSAT &amp; Digital SAT <br className="hidden lg:block" />
            in Winter, Spring &amp; Summer
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-1 text-pretty leading-relaxed text-ink lg:px-8">
          <p>
            Small groups in Astoria <span aria-hidden="true">·</span> Maximum {MAX_CLASS_SIZE} students per class
          </p>
          <p>
            Tuition from {lowestTuition}. Founding-family pricing for Winter only; early-payment discounts for Spring
            &amp; Summer. See individual program pricing:{" "}
            <Link href="/shsat-prep" className="font-bold text-brand underline underline-offset-4 hover:text-navy">
              SHSAT Prep
            </Link>{" "}
            <span aria-hidden="true">·</span>{" "}
            <Link href="/digital-sat-prep" className="font-bold text-brand underline underline-offset-4 hover:text-navy">
              Digital SAT Prep
            </Link>
          </p>
        </div>
        <TrackedLink
          href="/programs-2027"
          event={EVENTS.programCtaClick}
          eventProps={{ location: "home_programs_preview", cta: "compare_all" }}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-md border-2 border-navy bg-background px-6 font-extrabold text-navy transition-colors hover:bg-navy hover:text-primary-foreground lg:self-center"
        >
          Compare All Programs <ArrowRight size={18} aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  )
}
