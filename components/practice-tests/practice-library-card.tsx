import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PRACTICE_LIBRARY_PATH } from "@/lib/shsat-practice-tests"

export function PracticeLibraryCard() {
  return (
    <section aria-labelledby="practice-library-card-title" className="bg-white pb-8">
      <div className="container">
        <div className="flex flex-col gap-4 border border-line p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-1">
            <h2
              id="practice-library-card-title"
              className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep"
            >
              Free SHSAT Practice Tests
            </h2>
            <p className="text-pretty leading-relaxed text-ink">
              Official digital tests + AhmedPrep Math, ELA and weekly practice
            </p>
          </div>
          <Link href={PRACTICE_LIBRARY_PATH} className="text-link shrink-0">
            Explore Practice Tests <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
