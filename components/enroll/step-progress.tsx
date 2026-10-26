export const STEP_TITLES = ["Choose a program", "Choose a class", "Student & parent", "Choose tuition", "Review & payment"]
const SHORT = ["Program", "Class", "Family", "Tuition", "Review"]

export function StepProgress({ current, onJump }: { current: number; onJump: (step: number) => void }) {
  return (
    <nav aria-label="Enrollment progress">
      <ol className="flex gap-2">
        {SHORT.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} className="flex min-w-0 flex-1 flex-col gap-2">
              <span aria-hidden className={`h-1.5 ${done ? "bg-brand" : active ? "bg-gold" : "bg-line"}`} />
              {done ? (
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className="truncate text-left text-xs font-bold text-brand underline-offset-2 hover:underline"
                >
                  <span className="sr-only">{`Completed: go back to `}</span>
                  {label}
                </button>
              ) : (
                <span
                  aria-current={active ? "step" : undefined}
                  className={`truncate text-xs font-bold ${active ? "text-navy" : "text-subtle"}`}
                >
                  {label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
