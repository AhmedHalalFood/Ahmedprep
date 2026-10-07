import type { Metadata } from "next"
import { Check } from "lucide-react"
import { Breadcrumbs } from "@/components/landing/primitives"
import { ReferralForm } from "@/components/referral-form"

export const metadata: Metadata = {
  title: "Refer a Family to AhmedPrep",
  description: "Know a family preparing for the SHSAT or Digital SAT? Refer them to AhmedPrep in Astoria, Queens.",
  alternates: { canonical: "/referral" },
}

const steps = ["Share the family's contact details below.", "We reach out to them personally and offer a free diagnostic.", "We'll let you know once they've connected with us."]

export default function ReferralPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Referral", href: "/referral" }]} />
      <section aria-labelledby="referral-title" className="bg-warm py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="eyebrow blue">Referral program</p>
            <h1 id="referral-title" className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Know a family who could use AhmedPrep?
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-subtle">
              Most of our families find us through people they trust. If you know a student preparing for the SHSAT or Digital SAT, we&apos;d
              be glad to help.
            </p>
            <ul className="flex flex-col gap-3">
              {steps.map((step) => (
                <li key={step} className="flex items-start gap-3 text-ink">
                  <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                  {step}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-subtle">Please share a family&apos;s details only with their permission.</p>
          </div>
          <ReferralForm />
        </div>
      </section>
    </>
  )
}
