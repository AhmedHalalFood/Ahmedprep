import { CalendarDays, Clock, Ticket, UserRound, Video } from "lucide-react"
import { FREE_CLASS } from "@/lib/free-class"

export function FreeClassDetails({ nextClassLabel }: { nextClassLabel?: string }) {
  const rows = [
    { icon: Video, label: "Format", value: "Live online via Zoom" },
    { icon: CalendarDays, label: "When", value: `Every Sunday, ${FREE_CLASS.timeLabel}` },
    { icon: Clock, label: "Length", value: "60-minute live class" },
    { icon: Ticket, label: "Cost", value: "Free · RSVP required · Limited seats" },
    { icon: UserRound, label: "Instructor", value: `${FREE_CLASS.instructor}, ${FREE_CLASS.instructorRole}` },
  ]
  return (
    <div className="border border-line border-t-4 border-t-gold bg-white p-6 sm:p-8">
      {nextClassLabel && (
        <p className="border-b border-line pb-5">
          <span className="block text-xs font-bold uppercase tracking-widest text-subtle">Next class</span>
          <span className="mt-1 block text-xl font-extrabold text-navy">{nextClassLabel}</span>
          <span className="block text-sm text-subtle">{FREE_CLASS.timeLabel} (New York time)</span>
        </p>
      )}
      <dl className="flex flex-col">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-4 border-b border-line py-4 last:border-b-0 last:pb-0">
            <Icon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{label}</dt>
              <dd className="mt-1 font-semibold leading-snug text-navy">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
