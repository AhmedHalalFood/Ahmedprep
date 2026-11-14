import Image from "next/image"
import { CalendarDays, Clock, MapPin, Users, School, Ban } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, DIRECTIONS_URL } from "@/lib/business"
import { Section } from "@/components/landing/primitives"

const DETAILS = [
  { icon: CalendarDays, label: "Dates", value: "November 16 – December 3, 2026", note: "Monday through Thursday" },
  { icon: Clock, label: "Time", value: "6:00–9:00 PM Eastern", note: "11 classes · 33 scheduled hours" },
  { icon: Ban, label: "No class", value: "Thursday, November 26", note: "Thanksgiving" },
  { icon: Users, label: "Class size", value: "Maximum 12 students", note: "Small-group instruction" },
  { icon: School, label: "Format", value: "In person only", note: "No online or hybrid option" },
  { icon: MapPin, label: "Location", value: ADDRESS_LINE_1, note: ADDRESS_LINE_2, href: DIRECTIONS_URL },
] as const

export function SatIntensiveDetails() {
  return (
    <Section
      id="details"
      eyebrow="Program details"
      title="Focused preparation for the December 5 SAT"
      intro="Eleven three-hour evening classes in the weeks before test day, built around the skills and timing the Digital SAT actually rewards."
    >
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <dl className="grid gap-4 sm:grid-cols-2">
          {DETAILS.map(({ icon: Icon, label, value, note, ...rest }) => (
            <div key={label} className="flex gap-4 rounded-lg border border-line bg-white p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-navy text-gold">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-extrabold uppercase tracking-wider text-subtle">{label}</dt>
                <dd className="font-extrabold leading-snug text-navy">
                  {"href" in rest ? (
                    <a href={rest.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4 hover:text-brand">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
                <dd className="text-sm text-subtle">{note}</dd>
              </div>
            </div>
          ))}
        </dl>
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/sat-intensive/instructor-feedback.png"
              alt="An instructor gives a student one-on-one feedback on a practice problem while classmates work"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-sm leading-relaxed text-subtle">
            Every student receives personalized feedback on practice work, so class time goes to the question types they miss most.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
