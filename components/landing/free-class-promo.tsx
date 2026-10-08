import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FreeClassDetails } from "@/components/landing/free-class-details"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS } from "@/lib/free-class"

export function FreeClassPromo() {
  return (
    <section id="free-shsat-class" aria-labelledby="free-class-promo-title" className="scroll-mt-4 bg-mist py-16 md:py-20">
      <div className="container grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="eyebrow blue">Free weekly class</p>
          <h2 id="free-class-promo-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Free Live SHSAT Class Every Sunday
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-subtle">
            A free, instructor-led hour of SHSAT instruction, guided practice, and strategy, taught live on Zoom by {FREE_CLASS.instructor}.
            RSVP is required and seats are limited.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.freeShsatClassCtaClicked}
              eventProps={{ location: "home_promo" }}
              className="button button-gold button-lg"
            >
              Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
            <Link href={`${FREE_CLASS.path}#class`} className="text-link">
              What&apos;s covered <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <FreeClassDetails />
      </div>
    </section>
  )
}
