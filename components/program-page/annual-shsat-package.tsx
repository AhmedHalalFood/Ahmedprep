import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { ANNUAL_SHSAT_2027, dollars } from "@/lib/cohorts-2027"
import { isAnnualShsatOfferActive } from "@/lib/program-retirement"

const annualInquiry = "mailto:Tariq@ahmedprep.com?subject=" +
  encodeURIComponent("Complete SHSAT 2027 Annual Package Inquiry") +
  "&body=" + encodeURIComponent("Hello AhmedPrep, I am interested in the Complete SHSAT 2027 annual program. Please send enrollment terms and availability. Student grade: ")

export function AnnualShsatPackage({ compact = false }: { compact?: boolean }) {
  const plan = ANNUAL_SHSAT_2027
  if (!isAnnualShsatOfferActive()) return null
  const packageContent = (
    <section id="annual-shsat-package" aria-labelledby="annual-shsat-title" className={compact ? "pt-3" : "scroll-mt-28 border-y border-line bg-white py-7 md:py-9"}>
      <div className="container">
        <div className={`rounded-xl border border-gold/50 bg-cream p-5 md:p-7 ${compact ? "" : "shadow-sm"}`}>
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Complete SHSAT 2027 · Annual package inquiry</p>
          <h2 id="annual-shsat-title" className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
            One four-stage pathway from Winter Foundation to Fall Final Intensive
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink md:text-base">
            All four SHSAT stages meet in person at AhmedPrep’s Astoria, Queens classroom: 336 instructional hours across Winter (72), Spring (72), Summer Intensive (96), and Fall Final Intensive (96).
            Seasonal enrollment remains available separately.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="text-xs font-semibold text-subtle">Combined regular tuition</p>
              <p className="mt-1 text-xl font-extrabold text-navy">{dollars(plan.regular)}</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="text-xs font-semibold text-subtle">Standard annual package · 15% off</p>
              <p className="mt-1 text-xl font-extrabold text-navy">{dollars(plan.standard)}</p>
            </div>
            <div className="rounded-lg border-2 border-navy bg-white p-3">
              <p className="text-xs font-semibold text-subtle">Founding-family annual · 25% off</p>
              <p className="mt-1 text-xl font-extrabold text-navy">{dollars(plan.founding)}</p>
              <p className="text-xs text-subtle">Proposed for the first {plan.foundingSeats} qualifying annual enrollments</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            <Check size={16} className="mr-1 inline text-brand" aria-hidden="true" />
            Proposed annual full-payment deadline: January 8, 2027, at 11:59 PM ET, subject to a completed written enrollment agreement. No installment plans or stacked discounts.
            Annual placement, withdrawal, refund, instructor coverage, and exam-date-adjustment terms must be finalized in writing before any payment is requested.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={annualInquiry} className="button button-gold justify-center">
              Request annual package details <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link href="/programs-2027#class-finder" className="button button-outline justify-center">
              Compare individual cohorts
            </Link>
          </div>
          <p className="mt-2 text-xs text-subtle">Annual pricing is approved for planning; the written contract and enrollment terms are pending. This is an inquiry only. No payment is collected online or requested before the agreement is finalized.</p>
        </div>
      </div>
    </section>
  )
  if (!compact) return packageContent
  return (
    <details className="group rounded-xl border border-line bg-[#FBF8F0] px-4 py-3 sm:px-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-navy marker:hidden">
        <span>Interested in the complete SHSAT 2027 annual package? <span className="font-normal text-subtle">336 hours · from $5,040</span></span>
        <span aria-hidden="true" className="shrink-0 text-xl text-brand group-open:rotate-45">+</span>
      </summary>
      {packageContent}
    </details>
  )
}
