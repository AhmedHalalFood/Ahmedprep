import Image from "next/image"
import { ArrowDown, ArrowRight, Check } from "lucide-react"
import { BUSINESS } from "@/lib/business"

const BENEFITS = [
  "Targeted SAT Math and Reading & Writing review",
  "Realistic SAT practice questions",
  "Bluebook-style timed practice",
  "Personalized feedback",
  "Small-group instruction, maximum 12 students",
  "In-person classes in Astoria, Queens",
] as const

const FACTS = [
  { label: "Dates", value: "Nov 16 – Dec 3" },
  { label: "Schedule", value: "Mon–Thu, 6–9 PM" },
  { label: "Program", value: "11 classes · 33 hrs" },
  { label: "Class size", value: "Max 12 students" },
] as const

export function SatIntensiveHero() {
  return (
    <section aria-labelledby="sat-intensive-title" className="relative overflow-hidden bg-navy text-white">
      <div className="container grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-gold">
            December 5, 2026 SAT
          </p>
          <div className="flex flex-col gap-3">
            <h1
              id="sat-intensive-title"
              className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Digital SAT <span className="text-gold">Final Intensive</span>
            </h1>
            <p className="text-xl font-extrabold text-gold sm:text-2xl">Rolling Enrollment Now Open!</p>
            <p className="text-lg font-bold">Join anytime. Pay only for the remaining classes.</p>
          </div>
          <p className="max-w-xl text-pretty leading-relaxed text-white/80">
            Make your final weeks count with focused, in-person Digital SAT preparation in Astoria, Queens.
          </p>

          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2" aria-label="Program benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm font-semibold leading-snug text-white/90">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <a
              href="#register"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-8 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-black/20 transition-colors hover:bg-coral-hover focus-visible:outline-gold"
            >
              Enroll Now <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href="#tuition"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border-2 border-white/30 px-6 text-sm font-bold text-white transition-colors hover:border-gold hover:text-gold"
            >
              Calculate my tuition <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="text-sm text-white/70">
            Questions? Call or text{" "}
            <a href={BUSINESS.phoneHref} className="font-bold text-white underline decoration-gold underline-offset-4">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-4 border-gold/80 shadow-2xl shadow-black/40">
            <Image
              src="/images/sat-intensive/hero-students.png"
              alt="High school students working on SAT practice with laptops and printed questions in a small Astoria classroom"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:-mt-10 lg:mx-4 lg:relative">
            {FACTS.map((fact) => (
              <div key={fact.label} className="rounded-lg bg-white px-3 py-3 text-center shadow-lg">
                <dt className="text-[11px] font-extrabold uppercase tracking-wider text-gold-deep">{fact.label}</dt>
                <dd className="mt-1 text-sm font-extrabold text-navy">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
