import Link from "next/link"
import { ArrowRight, Megaphone } from "lucide-react"
import { SAT_INTENSIVE_PATH, satIntensiveUrgency } from "@/lib/sat-final-intensive"

/** Slim homepage bar for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncementBar() {
  if (!satIntensiveUrgency()) return null

  return (
    <aside aria-label="December 5 Digital SAT Final Intensive" className="border-y border-gold-deep/20 bg-gold text-navy">
      <div className="container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          <p className="flex items-center gap-2 text-sm font-extrabold leading-snug md:text-base">
            <Megaphone size={18} aria-hidden="true" className="shrink-0" />
            Dec 5 Digital SAT Final Intensive
          </p>
          <p className="text-xs font-semibold leading-snug text-navy/85 md:border-l md:border-navy/30 md:pl-4 md:text-sm">
            Rolling enrollment
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            Mon – Thu, 6:00 – 9:00 PM
          </p>
        </div>
        <Link
          href={`${SAT_INTENSIVE_PATH}#register`}
          style={{ color: "var(--cream)" }}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-navy px-3 text-sm font-bold transition-colors hover:bg-navy/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          Request Enrollment
          <ArrowRight size={15} aria-hidden="true" className="shrink-0" />
        </Link>
      </div>
    </aside>
  )
}
