import { Check } from "lucide-react"
import { PROGRAMS, classesFor, startLabelFor, type ProgramId } from "@/lib/enrollment-catalog"

type OptionCardProps = {
  name: string
  value: string
  checked: boolean
  onSelect: () => void
  children: React.ReactNode
}

export function OptionCard({ name, value, checked, onSelect, children }: OptionCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border-2 p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
        checked ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-slate"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onSelect} className="sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 ${
          checked ? "border-brand bg-brand text-primary-foreground" : "border-line bg-white"
        }`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">{children}</span>
    </label>
  )
}

export function ProgramStep({ value, onChange }: { value: ProgramId | null; onChange: (id: ProgramId) => void }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Program</legend>
      {PROGRAMS.map((p) => (
        <OptionCard key={p.id} name="program" value={p.id} checked={value === p.id} onSelect={() => onChange(p.id)}>
          <span className="text-lg font-extrabold text-navy">{p.name}</span>
          <span className="text-pretty text-sm leading-relaxed text-subtle">{p.summary}</span>
          <span className="text-sm font-semibold text-ink">12 weeks · 72 hours · up to 10 students</span>
        </OptionCard>
      ))}
    </fieldset>
  )
}

export function ClassStep({
  programId,
  value,
  onChange,
}: {
  programId: ProgramId
  value: string | null
  onChange: (id: string) => void
}) {
  const options = classesFor(programId)
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Class schedule</legend>
        {options.map((c) => (
          <OptionCard key={c.id} name="class" value={c.id} checked={value === c.id} onSelect={() => onChange(c.id)}>
            <span className="text-lg font-extrabold text-navy">{c.label}</span>
            <span className="text-sm font-semibold text-ink">{`${c.days}, ${c.time}`}</span>
            <span className="text-sm leading-relaxed text-subtle">{startLabelFor(c)}</span>
          </OptionCard>
        ))}
      </fieldset>
      <p className="text-pretty text-sm leading-relaxed text-subtle">
        January 2027 start dates are planned and will be confirmed once the final calendar is approved. Future
        cohorts will appear here when they are announced.
      </p>
    </div>
  )
}
