import type { ReactNode } from "react"

export const inputClass =
  "mt-2 h-12 w-full border border-line bg-white px-3 text-base text-ink outline-none transition-colors focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 aria-[invalid=true]:border-error"

type BaseProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  hint?: string
}

function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="text-sm font-semibold text-ink">
      {label}
      {required ? (
        <>
          {" "}
          <span aria-hidden="true" className="text-error">*</span>
          <span className="sr-only">(required)</span>
        </>
      ) : (
        <span className="font-normal text-subtle"> (optional)</span>
      )}
    </label>
  )
}

function Describe({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-subtle">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </>
  )
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

export function TextField({
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
  ...props
}: BaseProps & { type?: string; autoComplete?: string; placeholder?: string; inputMode?: "text" | "tel" | "email" | "numeric" }) {
  const { id, name, label, value, onChange, error, required, hint } = props
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        className={inputClass}
      />
      <Describe id={id} error={error} hint={hint} />
    </div>
  )
}

export function SelectField({ options, placeholder, ...props }: BaseProps & { options: string[]; placeholder: string }) {
  const { id, name, label, value, onChange, error, required, hint } = props
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={inputClass}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Describe id={id} error={error} hint={hint} />
    </div>
  )
}

export function TextAreaField({ placeholder, ...props }: BaseProps & { placeholder?: string }) {
  const { id, name, label, value, onChange, error, required, hint } = props
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        maxLength={2000}
        placeholder={placeholder}
        className={`${inputClass} h-auto min-h-28 resize-y py-3`}
      />
      <Describe id={id} error={error} hint={hint} />
    </div>
  )
}

export function ProgramRadios({
  name,
  idPrefix,
  value,
  onChange,
  error,
}: {
  name: string
  idPrefix: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <fieldset aria-describedby={error ? `${idPrefix}-program-error` : undefined}>
      <legend className="text-sm font-semibold text-ink">
        Program <span aria-hidden="true" className="text-error">*</span>
        <span className="sr-only">(required)</span>
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {["SHSAT", "Digital SAT"].map((program) => (
          <label
            key={program}
            className="flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-white px-4 text-sm font-bold text-navy transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/30"
          >
            <input
              type="radio"
              name={name}
              value={program}
              checked={value === program}
              onChange={() => onChange(program)}
              aria-invalid={Boolean(error)}
              className="h-4 w-4 accent-[var(--blue)]"
            />
            {program}
          </label>
        ))}
      </div>
      {error && <p id={`${idPrefix}-program-error`} className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </fieldset>
  )
}

export function Honeypot({ id, inputRef }: { id: string; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input ref={inputRef} id={id} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  )
}

export function RequiredNote({ id }: { id: string }) {
  return (
    <p id={id} className="text-xs text-subtle">
      Fields marked <span aria-hidden="true" className="text-error">*</span>
      <span className="sr-only">with an asterisk</span> are required.
    </p>
  )
}

export function SubmitButton({ submitting, children }: { submitting: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex min-h-14 w-full items-center justify-center gap-2 bg-gold px-6 text-sm font-extrabold uppercase tracking-wider text-navy transition-colors hover:bg-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting ? (
        <>
          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
          Sending...
        </>
      ) : (
        children
      )}
    </button>
  )
}
