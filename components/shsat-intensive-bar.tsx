import { ArrowRight } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { INTENSIVE_ENROLL_ANCHOR, INTENSIVE_PATH } from "@/lib/shsat-intensive"

export function ShsatIntensiveBar() {
  return (
    <div
      className="relative z-20 border-b border-gold/40 bg-cream text-navy"
      role="region"
      aria-label="SHSAT Final Intensive 2026 announcement"
    >
      <div className="h-[3px] bg-gold" aria-hidden="true" />
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col items-center gap-3 py-4 text-center md:flex-row md:justify-between md:gap-8 md:py-5 md:text-left">
        <div className="flex flex-col items-center gap-1.5 md:items-start">
          <p className="text-balance text-lg font-extrabold uppercase leading-tight tracking-tight text-navy md:text-2xl">
            SHSAT Final Intensive
            <span className="px-2 text-gold-deep" aria-hidden="true">
              |
            </span>
            <span className="sr-only">, </span>
            Late Enrollment Open
          </p>
          <p className="text-sm font-semibold leading-snug text-ink/80">October 12 – November 12, 2026</p>
          <p className="text-sm font-medium leading-snug text-ink/75">
            Monday–Thursday
            <span className="px-1.5 text-gold-deep" aria-hidden="true">
              |
            </span>
            5:00–8:00 PM Eastern from Oct. 22
            <span className="px-1.5 text-gold-deep" aria-hidden="true">
              |
            </span>
            In person only
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <p className="inline-flex items-center rounded-sm bg-gold px-2.5 py-1.5 text-[11px] font-extrabold uppercase leading-none tracking-[0.14em] text-navy">
            Join Classes in Progress
            <span className="px-1.5" aria-hidden="true">
              |
            </span>
            Prorated Tuition
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <ReserveSeatDialog
              location="shsat_intensive_bar"
              trigger={
                <button type="button" className="button button-gold min-h-11 shrink-0 whitespace-nowrap uppercase">
                  Enroll in SHSAT Intensive <ArrowRight size={15} aria-hidden="true" />
                </button>
              }
            />
            <TrackedLink
              href={`${INTENSIVE_PATH}#${INTENSIVE_ENROLL_ANCHOR}`}
              event={EVENTS.shsatIntensiveClick}
              eventProps={{ location: "shsat_intensive_bar" }}
              className="inline-flex min-h-11 items-center text-sm font-bold text-navy underline underline-offset-4 hover:text-gold-deep"
            >
              Remaining dates &amp; prorated tuition
            </TrackedLink>
          </div>
        </div>
      </div>
    </div>
  )
}
