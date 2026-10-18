import { CalendarDays, Clock, MapPin, MessageSquare, Phone } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { INTENSIVE_NAME } from "@/lib/shsat-intensive"

const details = [
  { icon: CalendarDays, text: "October 12\u2013November 12, 2026" },
  { icon: Clock, text: "Monday\u2013Thursday | 6:00\u20139:00 PM Eastern" },
  { icon: MapPin, text: "Astoria, Queens, New York" },
]

export function IntensiveHero() {
  return (
    <section aria-labelledby="intensive-title" className="border-b-4 border-gold bg-navy pb-10 pt-10 text-white md:pb-16 md:pt-16">
      <div className="container flex flex-col gap-6 md:gap-8">
        <p className="eyebrow gold">SHSAT Final Intensive | Classes in progress</p>
        <h1 id="intensive-title" className="max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-none">
          {INTENSIVE_NAME}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-pretty text-xl font-extrabold uppercase leading-snug text-gold md:text-3xl">
            {"Late Enrollment Open | Prorated Tuition"}
          </p>
          <p className="text-pretty text-lg font-semibold leading-snug text-white md:text-xl">
            For students beginning October 19: <span className="text-gold">48 remaining instructional hours for $800.</span>
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            Original tuition: <s className="text-white/60">$1,000</s> for the full 60-hour program.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0 md:flex-row md:flex-wrap md:gap-x-8">
          {details.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 font-semibold text-white/90">
              <Icon size={18} className="shrink-0 text-gold" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ReserveSeatDialog location="intensive_page_hero" />
          <TrackedLink
            href={BUSINESS.phoneHref}
            event={EVENTS.phoneClick}
            eventProps={{ location: "intensive_page_hero" }}
            className="button button-lg justify-center border border-white/40 uppercase text-white hover:border-gold hover:text-gold"
          >
            <Phone size={16} aria-hidden="true" />
            Call 347-479-5020
          </TrackedLink>
          <TrackedLink
            href={BUSINESS.smsHref}
            event={EVENTS.textClick}
            eventProps={{ location: "intensive_page_hero" }}
            className="button button-lg justify-center border border-white/40 uppercase text-white hover:border-gold hover:text-gold"
          >
            <MessageSquare size={16} aria-hidden="true" />
            Text Ahmed Prep
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
