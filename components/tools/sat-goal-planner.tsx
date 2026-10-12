"use client"

import { useRef, useState, type FormEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { inputClass } from "@/components/forms/fields"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { FREE_CLASS } from "@/lib/free-class"

const TEST_DATES = [
  { value: "2026-11-07", label: "November 7, 2026" },
  { value: "2026-12-05", label: "December 5, 2026" },
  { value: "later", label: "A later date (plan for 12 weeks)" },
]

type Plan = {
  gap: number
  weeks: number
  hoursPerWeek: string
  focus: string
  notes: string[]
}

const toTens = (n: number) => Math.round(n / 10) * 10

function buildPlan(current: number, target: number, rw: number | null, math: number | null, testDate: string, today: Date): Plan {
  const gap = target - current
  const weeks =
    testDate === "later" ? 12 : Math.max(1, Math.floor((Date.parse(`${testDate}T12:00:00Z`) - today.getTime()) / (7 * 86_400_000)))
  const perWeek = gap / weeks
  const hoursPerWeek = gap <= 0 ? "2–3" : perWeek <= 10 ? "3–4" : perWeek <= 25 ? "5–7" : "8–10"

  let focus = "Balance both sections, and review every missed question by type."
  if (rw !== null && math !== null) {
    if (math + 30 < rw) focus = "Math first. It's your lower section, so the same study time should raise your total more there."
    else if (rw + 30 < math) focus = "Reading & Writing first. It's your lower section, so the same study time should raise your total more there."
  }

  const notes = [
    "Take a full-length adaptive practice test in Bluebook to set and re-check your baseline.",
    "Spend most of your time on the question types you miss most often, not on what you already know.",
    "Practice with the built-in Desmos calculator so it's familiar on test day.",
  ]
  if (perWeek > 25) notes.unshift("This goal is ambitious for the time available. Consider a later test date, or plan for more weekly practice.")
  if (gap <= 0) notes.unshift("You're already at or above your target. Focus on consistency with timed practice tests.")

  return { gap, weeks, hoursPerWeek, focus, notes }
}

export function SatGoalPlanner() {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const current = toTens(Number(data.get("current")))
    const target = toTens(Number(data.get("target")))
    const rwRaw = data.get("rw")
    const mathRaw = data.get("math")
    const rw = rwRaw ? toTens(Number(rwRaw)) : null
    const math = mathRaw ? toTens(Number(mathRaw)) : null

    if (!(current >= 400 && current <= 1600 && target >= 400 && target <= 1600)) {
      setError("Enter total scores between 400 and 1600.")
      return
    }
    if ((rw !== null && (rw < 200 || rw > 800)) || (math !== null && (math < 200 || math > 800))) {
      setError("Section scores must be between 200 and 800.")
      return
    }
    setError(null)
    const next = buildPlan(current, target, rw, math, String(data.get("date")), new Date())
    setPlan(next)
    trackEvent(EVENTS.satGoalPlanCreated, { gap: next.gap, weeks: next.weeks })
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5 border border-line bg-white p-5 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <ScoreField id="current" label="Current practice score" hint="400–1600" min={400} max={1600} required />
          <ScoreField id="target" label="Target score" hint="400–1600" min={400} max={1600} required />
          <ScoreField id="rw" label="Reading & Writing score" hint="Optional, 200–800" min={200} max={800} />
          <ScoreField id="math" label="Math score" hint="Optional, 200–800" min={200} max={800} />
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-semibold text-ink">
            Planned test date
          </label>
          <select id="date" name="date" className={`${inputClass} mt-1.5`} defaultValue={TEST_DATES[0].value}>
            {TEST_DATES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-error">
            {error}
          </p>
        )}
        <button type="submit" className="button button-gold button-lg justify-center">
          Build My Study Plan
        </button>
      </form>

      {plan && (
        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="border-t-4 border-t-gold bg-navy p-6 text-primary-foreground outline-none md:p-8">
          <p className="eyebrow gold">Your suggested plan</p>
          <dl className="mt-4 grid grid-cols-3 gap-4 border-b border-primary-foreground/20 pb-5">
            <div>
              <dt className="text-xs font-semibold opacity-80">Points to gain</dt>
              <dd className="mt-1 text-2xl font-extrabold">{Math.max(0, plan.gap)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold opacity-80">Weeks</dt>
              <dd className="mt-1 text-2xl font-extrabold">{plan.weeks}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold opacity-80">Hours / week</dt>
              <dd className="mt-1 text-2xl font-extrabold">{plan.hoursPerWeek}</dd>
            </div>
          </dl>
          <p className="mt-5 font-bold">{plan.focus}</p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed">
            {plan.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed opacity-80">
            These are general study suggestions, not a score guarantee. Results vary by student. Confirm test dates and deadlines with
            College Board.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <TrackedLink href="/free-diagnostic" event={EVENTS.diagnosticCtaClick} eventProps={{ location: "sat_planner_result" }} className="button button-gold">
              Book Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.sundayClassCtaClick}
              eventProps={{ location: "sat_planner_result" }}
              className="inline-flex min-h-12 items-center gap-2 font-bold text-primary-foreground underline-offset-4 hover:underline"
            >
              Join a Free Sunday Class <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreField({ id, label, hint, min, max, required }: { id: string; label: string; hint: string; min: number; max: number; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={10}
        required={required}
        aria-describedby={`${id}-hint`}
        className={`${inputClass} mt-1.5`}
      />
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-subtle">
        {hint}
      </p>
    </div>
  )
}
