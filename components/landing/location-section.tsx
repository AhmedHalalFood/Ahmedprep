import { MapPin } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { Section } from "@/components/landing/primitives"
import { ADDRESS_FULL, ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL, MAPS_EMBED_URL } from "@/lib/business"

export function LocationSection({ location, compact = false }: { location: string; compact?: boolean }) {
  return (
    <Section id="location" eyebrow="Visit AhmedPrep" title="In-person classes in Astoria, Queens">
      <div className={`grid md:grid-cols-[1fr_1.4fr] ${compact ? "gap-5" : "gap-8"}`}>
        <div className={`flex flex-col ${compact ? "gap-3" : "gap-6"}`}>
          <address className="not-italic">
            <p className="text-lg font-extrabold text-navy">{BUSINESS.name}</p>
            <p className="mt-2 leading-relaxed text-ink">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </p>
          </address>
          <p className="leading-relaxed text-subtle">
            {location === "shsat" ? "Our Astoria classroom welcomes SHSAT families from across NYC and Long Island. All SHSAT group classes meet in person here." : "Our Astoria classroom welcomes families from across NYC and Long Island. Digital SAT weekday Winter and Spring 2027 classes meet live online, while the weekend cohort meets here in person."}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2} (opens Google Maps)`}
              className="button button-gold min-h-12 uppercase"
            >
              <MapPin size={16} aria-hidden="true" />
              Get directions
            </a>
            <CallTextLinks location={location} />
          </div>
        </div>
        <div className={`w-full overflow-hidden border border-line bg-warm ${compact ? "aspect-[16/9] md:aspect-auto md:h-60" : "aspect-[4/3] md:aspect-auto md:min-h-80"}`}>
          <iframe
            title={`Map showing AhmedPrep at ${ADDRESS_FULL}`}
            src={MAPS_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </Section>
  )
}
