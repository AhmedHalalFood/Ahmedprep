import { Clock } from "lucide-react"
import { ENROLLMENT_2027 as E, startLabel } from "@/lib/enrollment-2027"

export function ClassCards() {
  const classes = E.programs.flatMap((program) => program.schedules.map((schedule) => ({ program, schedule })))

  return (
    <section aria-labelledby="classes-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow blue">{`${E.location} classes`}</p>
        <h2 id="classes-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Choose a class
        </h2>
        <p className="text-pretty leading-relaxed text-subtle">
          {`Each class meets twice a week for ${E.weeks} weeks, with no more than ${E.maxClassSize} students.`}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {classes.map(({ program, schedule }) => {
          const titleId = `${program.id}-${schedule.label.replace(/\s+/g, "-").toLowerCase()}-title`
          return (
            <li key={titleId}>
              <article aria-labelledby={titleId} className="flex h-full flex-col gap-4 border border-line border-t-4 border-t-brand bg-white p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand">{program.name}</p>
                  <h3 id={titleId} className="text-xl font-extrabold leading-tight text-navy">
                    {schedule.label.replace(" group", "")}
                  </h3>
                </div>
                <dl className="flex flex-col gap-1 text-sm leading-relaxed">
                  <div className="flex flex-col">
                    <dt className="sr-only">Days and time</dt>
                    <dd className="font-bold text-ink">{schedule.days}</dd>
                    <dd className="text-subtle">{schedule.time}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Start date</dt>
                    <dd className="font-semibold text-brand">{startLabel(schedule)}</dd>
                  </div>
                </dl>
                <p className="mt-auto flex items-center gap-2 bg-cream px-3 py-2 text-sm font-bold text-navy">
                  <Clock size={16} aria-hidden="true" className="shrink-0 text-gold-deep" />
                  {E.availabilityStatus}
                </p>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
