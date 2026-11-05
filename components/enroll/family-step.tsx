import { GRADES_2027 } from "@/lib/enrollment-2027"

export type FamilyInfo = {
  studentName: string
  grade: string
  parentName: string
  parentEmail: string
  phone: string
}

export type FamilyErrors = Partial<Record<keyof FamilyInfo, string>>

export const EMPTY_FAMILY: FamilyInfo = { studentName: "", grade: "", parentName: "", parentEmail: "", phone: "" }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateFamily(v: FamilyInfo): FamilyErrors {
  const errors: FamilyErrors = {}
  if (v.studentName.trim().length < 2) errors.studentName = "Enter the student's full name."
  if (!v.grade) errors.grade = "Select the student's current grade."
  if (v.parentName.trim().length < 2) errors.parentName = "Enter the parent or guardian's full name."
  if (!EMAIL_RE.test(v.parentEmail.trim())) errors.parentEmail = "Enter a valid email, like name@example.com."
  const digits = v.phone.replace(/\D/g, "")
  if (digits.length < 10 || digits.length > 11) errors.phone = "Enter a 10-digit phone number, like (718) 555-0123."
  return errors
}

const inputClass = (invalid: boolean) =>
  `min-h-12 w-full border bg-white px-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 ${
    invalid ? "border-error" : "border-line"
  }`

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-navy">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-subtle">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function FamilyStep({
  value,
  errors,
  onChange,
}: {
  value: FamilyInfo
  errors: FamilyErrors
  onChange: (next: FamilyInfo) => void
}) {
  const set = (key: keyof FamilyInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...value, [key]: e.target.value })
  const describe = (key: keyof FamilyInfo, hasHint = false) =>
    [hasHint ? `${key}-hint` : null, errors[key] ? `${key}-error` : null].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-xs font-extrabold uppercase tracking-wider text-subtle">Student</legend>
        <Field id="studentName" label="Student full name" error={errors.studentName}>
          <input
            id="studentName"
            autoComplete="off"
            value={value.studentName}
            onChange={set("studentName")}
            aria-invalid={!!errors.studentName}
            aria-describedby={describe("studentName")}
            className={inputClass(!!errors.studentName)}
          />
        </Field>
        <Field id="grade" label="Current grade" error={errors.grade}>
          <select
            id="grade"
            value={value.grade}
            onChange={set("grade")}
            aria-invalid={!!errors.grade}
            aria-describedby={describe("grade")}
            className={inputClass(!!errors.grade)}
          >
            <option value="">Select a grade</option>
            {GRADES_2027.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-line pt-5">
        <legend className="mb-1 text-xs font-extrabold uppercase tracking-wider text-subtle">Parent or guardian</legend>
        <Field id="parentName" label="Parent/guardian full name" error={errors.parentName}>
          <input
            id="parentName"
            autoComplete="name"
            value={value.parentName}
            onChange={set("parentName")}
            aria-invalid={!!errors.parentName}
            aria-describedby={describe("parentName")}
            className={inputClass(!!errors.parentName)}
          />
        </Field>
        <Field id="parentEmail" label="Parent email" hint="Receipts and class updates go here." error={errors.parentEmail}>
          <input
            id="parentEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={value.parentEmail}
            onChange={set("parentEmail")}
            aria-invalid={!!errors.parentEmail}
            aria-describedby={describe("parentEmail", true)}
            className={inputClass(!!errors.parentEmail)}
          />
        </Field>
        <Field id="phone" label="Contact number" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describe("phone")}
            className={inputClass(!!errors.phone)}
          />
        </Field>
      </fieldset>

      <p className="text-pretty text-sm leading-relaxed text-subtle">
        We only ask for what we need to enroll your student. We never ask for a date of birth, school ID, or home
        address here.
      </p>
    </div>
  )
}
