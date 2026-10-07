import { MapPin } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { Section } from "@/components/landing/primitives"
import { ADDRESS_FULL, ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL, MAPS_EMBED_URL } from "@/lib/business"

export function LocationSection({ location }: { location: string }) {
  return (
    <Section id="location" eyebrow="Visit AhmedPrep" title="In-person classes in Astoria, Queens">
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <address className="not-italic">
            <p className="text-lg font-extrabold text-navy">{BUSINESS.name}</p>
            <p className="mt-2 leading-relaxed text-ink">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </p>
          </address>
          <p className="leading-relaxed text-subtle">
            Our Astoria classroom is easy to reach from across Queens, including Long Island City, Sunnyside, Woodside, Jackson Heights, and
            Ditmars, and from neighboring boroughs.
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
        <div className="aspect-[4/3] w-full overflow-hidden border border-line bg-warm md:aspect-auto md:min-h-80">
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
