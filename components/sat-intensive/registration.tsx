"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { AlertTriangle, Clock, Loader2 } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import {
  CLASS_DATES,
  CLASS_TIME_LABEL,
  GRADE_OPTIONS,
  OFFLINE_PAYMENT_STATEMENT,
  PAYMENT_HOLD_MINUTES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_INSTRUCTIONS,
  PAYMENT_METHOD_LABELS,
  PENDING_SEAT_STATEMENT,
  POLICY_PENDING_NOTE,
  REGISTRATION_RECEIVED_STATEMENT,
  SAT_REGISTRATION_OPTIONS,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  validateRegistration,
  type ClassDate,
  type PaymentMethod,
  type RegistrationErrors,
  type RegistrationInput,
} from "@/lib/sat-final-intensive"

type Received = {
  referenceCode: string
  studentName: string
  paymentMethod: PaymentMethod
  holdExpiresAt: string
  firstClassDate: ClassDate
  remainingDates: ClassDate[]
  remainingClasses: number
  remainingHours: number
  tuitionCents: number
}

const EMPTY: Omit<RegistrationInput, "firstClassDate"> = {
  studentName: "",
  studentGrade: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  paymentMethod: "",
  previousScore: "",
  targetScore: "",
  satRegistration: "",
  policyAcknowledged: false,
}

const EMAIL = "tariq@ahmedprep.com"

export function Registration({
  available,
  selected,
  onSelect,
}: {
  available: ClassDate[]
  selected: ClassDate | null
  onSelect: (date: ClassDate) => void
}) {
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [formError, setFormError] = useState("")
  const [busy, setBusy] = useState(false)
  const [received, setReceived] = useState<Received | null>(null)

  const quote = selected ? quoteFor(selected) : null
  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const website = (new FormData(event.currentTarget).get("website") as string) ?? ""
    const input: RegistrationInput = { ...fields, firstClassDate: selected ?? "" }
    const found = validateRegistration(input, new Date())
    setErrors(found)
    setFormError("")
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(first === "paymentMethod" ? "reg-paymentMethod-zelle" : `reg-${first}`)?.focus()
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/sat-final-intensive/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors(data.errors ?? {})
        setFormError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setReceived(data)
      requestAnimationFrame(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" }))
    } catch {
      setFormError(`We could not reach the server. Please try again or call ${BUSINESS.phoneDisplay}.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-4 bg-white py-16 md:py-20">
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="eyebrow blue">Registration</p>
            <h2 id="register-title" className="text-balance text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Enroll your student
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">
              For parents and guardians. Submitting this form reserves a temporary seat hold; it does not mean tuition has been paid. Seats are limited
              to 12 students.
            </p>
            <p className="font-bold text-navy">{OFFLINE_PAYMENT_STATEMENT}</p>
          </div>

          <p className="flex items-start gap-3 rounded-lg border border-gold bg-cream p-4 text-sm leading-relaxed text-ink">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
            <span>
              <strong>Preview test mode.</strong> No payment is collected on this website. Emails go only to a test inbox.
            </span>
          </p>

          {received ? (
            <ReceivedPanel received={received} />
          ) : (
            <form noValidate onSubmit={submit} className="flex flex-col gap-8" aria-describedby={formError ? "reg-form-error" : undefined}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

              <Fieldset legend="Student">
                <Field id="reg-studentName" label="Student full name" error={errors.studentName}>
                  <input id="reg-studentName" autoComplete="off" value={fields.studentName} onChange={(e) => set("studentName", e.target.value)} {...aria("studentName", errors)} className={inputClass(errors.studentName)} />
                </Field>
                <Field id="reg-studentGrade" label="Student grade" error={errors.studentGrade}>
                  <select id="reg-studentGrade" value={fields.studentGrade} onChange={(e) => set("studentGrade", e.target.value)} {...aria("studentGrade", errors)} className={inputClass(errors.studentGrade)}>
                    <option value="">Select grade</option>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field id="reg-previousScore" label="Previous SAT/PSAT score" optional error={errors.previousScore}>
                  <input id="reg-previousScore" inputMode="numeric" maxLength={4} placeholder="e.g. 1180" value={fields.previousScore} onChange={(e) => set("previousScore", e.target.value)} {...aria("previousScore", errors)} className={inputClass(errors.previousScore)} />
                </Field>
                <Field id="reg-targetScore" label="Target SAT score" optional error={errors.targetScore}>
                  <input id="reg-targetScore" inputMode="numeric" maxLength={4} placeholder="e.g. 1350" value={fields.targetScore} onChange={(e) => set("targetScore", e.target.value)} {...aria("targetScore", errors)} className={inputClass(errors.targetScore)} />
                </Field>
                <Field id="reg-satRegistration" label="Registered for the December 5, 2026 SAT?" error={errors.satRegistration} wide>
                  <select id="reg-satRegistration" value={fields.satRegistration} onChange={(e) => set("satRegistration", e.target.value)} {...aria("satRegistration", errors)} className={inputClass(errors.satRegistration)}>
                    <option value="">Select one</option>
                    {SAT_REGISTRATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </Fieldset>

              <Fieldset legend="Parent or guardian">
                <Field id="reg-parentName" label="Parent/guardian full name" error={errors.parentName} wide>
                  <input id="reg-parentName" autoComplete="name" value={fields.parentName} onChange={(e) => set("parentName", e.target.value)} {...aria("parentName", errors)} className={inputClass(errors.parentName)} />
                </Field>
                <Field id="reg-parentEmail" label="Parent email" error={errors.parentEmail}>
                  <input id="reg-parentEmail" type="email" autoComplete="email" value={fields.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} {...aria("parentEmail", errors)} className={inputClass(errors.parentEmail)} />
                </Field>
                <Field id="reg-parentPhone" label="Parent phone number" error={errors.parentPhone}>
                  <input id="reg-parentPhone" type="tel" autoComplete="tel" placeholder="(347) 555-0123" value={fields.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} {...aria("parentPhone", errors)} className={inputClass(errors.parentPhone)} />
                </Field>
              </Fieldset>

              <Fieldset legend="First class and tuition">
                <Field id="reg-firstClassDate" label="Starting date" error={errors.firstClassDate} wide>
                  <select
                    id="reg-firstClassDate"
                    value={selected ?? ""}
                    onChange={(e) => {
                      onSelect(e.target.value as ClassDate)
                      setErrors((er) => ({ ...er, firstClassDate: undefined }))
                    }}
                    {...aria("firstClassDate", errors)}
                    className={inputClass(errors.firstClassDate)}
                  >
                    {!selected && <option value="">No upcoming classes</option>}
                    {CLASS_DATES.map((d) => (
                      <option key={d} value={d} disabled={!available.includes(d)}>
                        {formatClassDateLong(d)}
                        {available.includes(d) ? "" : " (class started)"}
                      </option>
                    ))}
                  </select>
                </Field>
                {quote && (
                  <div className="flex flex-col gap-3 rounded-xl border-2 border-sage bg-sage-soft p-5 sm:col-span-2" aria-live="polite">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-extrabold text-navy">
                        {quote.remainingClasses} {quote.remainingClasses === 1 ? "class" : "classes"} · {quote.remainingHours} hours
                      </p>
                      <p className="text-3xl font-extrabold tabular-nums text-sage-deep">{formatUsd(quote.tuitionCents)}</p>
                    </div>
                    <p className="text-sm text-ink">
                      Full tuition due before enrollment is confirmed. {quote.remainingClasses} × {formatUsd(7500)} per class. No installment plan.
                    </p>
                    <p className="text-sm leading-relaxed text-subtle">
                      Classes: {quote.remainingDates.map((d) => formatClassDate(d)).join(", ")}
                    </p>
                  </div>
                )}
              </Fieldset>

              <fieldset className="flex flex-col gap-3" aria-describedby={errors.paymentMethod ? "reg-paymentMethod-error" : "reg-paymentMethod-hint"}>
                <legend className="mb-1 text-lg font-extrabold text-navy">Preferred payment method</legend>
                <p id="reg-paymentMethod-hint" className="text-sm leading-relaxed text-subtle">
                  {OFFLINE_PAYMENT_STATEMENT} Online card payments are not accepted.
                </p>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-invalid={Boolean(errors.paymentMethod)}>
                  {PAYMENT_METHODS.map((method) => {
                    const checked = fields.paymentMethod === method
                    return (
                      <label
                        key={method}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 font-bold transition-colors ${
                          checked ? "border-navy bg-warm text-navy" : errors.paymentMethod ? "border-error" : "border-line text-ink hover:border-navy/40"
                        }`}
                      >
                        <input
                          id={`reg-paymentMethod-${method}`}
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={checked}
                          onChange={() => set("paymentMethod", method)}
                          className="size-5 shrink-0 accent-navy"
                        />
                        {PAYMENT_METHOD_LABELS[method]}
                      </label>
                    )
                  })}
                </div>
                {fields.paymentMethod && (
                  <p className="rounded-lg bg-warm p-4 text-sm leading-relaxed text-ink" aria-live="polite">
                    {PAYMENT_METHOD_INSTRUCTIONS[fields.paymentMethod as PaymentMethod]}
                  </p>
                )}
                {errors.paymentMethod && (
                  <p id="reg-paymentMethod-error" className="text-sm font-semibold text-error">
                    {errors.paymentMethod}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 ${errors.policyAcknowledged ? "border-error bg-error-soft" : "border-line"}`}>
                  <input
                    id="reg-policyAcknowledged"
                    type="checkbox"
                    checked={fields.policyAcknowledged}
                    onChange={(e) => set("policyAcknowledged", e.target.checked)}
                    aria-describedby="reg-policy-note"
                    aria-invalid={Boolean(errors.policyAcknowledged)}
                    className="mt-1 size-5 shrink-0 accent-navy"
                  />
                  <span className="text-sm leading-relaxed text-ink">
                    I understand that tuition is {formatUsd(7500)} per 3-hour class, that{" "}
                    <strong>{quote ? formatUsd(quote.tuitionCents) : "the full tuition"}</strong> for all remaining classes is due in full before
                    enrollment is confirmed, with no installments or individual drop-in classes, and that the seat is confirmed only after AhmedPrep
                    verifies payment.
                  </span>
                </label>
                <p id="reg-policy-note" className="text-xs leading-relaxed text-subtle">
                  {POLICY_PENDING_NOTE}
                </p>
                {errors.policyAcknowledged && <p className="text-sm font-semibold text-error">{errors.policyAcknowledged}</p>}
              </div>

              {formError && (
                <p id="reg-form-error" role="alert" className="rounded-lg bg-error-soft p-4 text-sm font-semibold text-error">
                  {formError}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={busy || !selected}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-8 text-base font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
                  {busy ? "Submitting…" : "Submit registration"}
                </button>
                <p className="text-center text-xs text-subtle">No payment is taken on this website. We hold a seat for {PAYMENT_HOLD_MINUTES} minutes after you submit.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function ReceivedPanel({ received }: { received: Received }) {
  const holdTime = new Date(received.holdExpiresAt).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  })
  return (
    <div role="status" className="flex flex-col gap-6 rounded-xl border-2 border-gold bg-cream p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Payment pending</p>
        <h3 className="text-balance text-2xl font-extrabold text-navy md:text-3xl">Registration Request Received!</h3>
        <p className="font-bold leading-relaxed text-ink">{REGISTRATION_RECEIVED_STATEMENT}</p>
        <p className="rounded-lg border-2 border-coral bg-white p-3 text-sm font-extrabold leading-relaxed text-navy">{PENDING_SEAT_STATEMENT}</p>
      </div>

      <dl className="grid gap-4 rounded-lg bg-white p-5 text-sm sm:grid-cols-2">
        <Summary label="Registration #" value={received.referenceCode} />
        <Summary label="Student" value={received.studentName} />
        <Summary label="Starting date" value={formatClassDateLong(received.firstClassDate)} />
        <Summary label="Classes / hours" value={`${received.remainingClasses} classes · ${received.remainingHours} hours`} />
        <Summary label="Total tuition due" value={formatUsd(received.tuitionCents)} strong />
        <Summary label="Payment method" value={PAYMENT_METHOD_LABELS[received.paymentMethod]} />
      </dl>

      <p className="flex items-start gap-3 text-sm leading-relaxed text-ink">
        <Clock size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
        <span>
          <strong>Temporary seat hold until {holdTime} ET.</strong> After the hold lapses your registration stays on file, but the seat is guaranteed only
          once payment is verified and a seat is still available.
        </span>
      </p>

      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink">
        <h4 className="font-extrabold text-navy">How to pay</h4>
        <p>{PAYMENT_METHOD_INSTRUCTIONS[received.paymentMethod]}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink">
        <h4 className="font-extrabold text-navy">Your class dates</h4>
        <p>{received.remainingDates.map((d) => formatClassDate(d)).join(", ")}</p>
        <p className="text-subtle">{CLASS_TIME_LABEL} · No class Thursday, November 26 (Thanksgiving)</p>
      </div>

      <div className="flex flex-col gap-1 text-sm leading-relaxed text-ink">
        <h4 className="font-extrabold text-navy">Classroom</h4>
        <p>
          {ADDRESS_LINE_1}, {ADDRESS_LINE_2} (in person only)
        </p>
      </div>

      <p className="text-sm leading-relaxed text-ink">
        A copy of these details has been emailed to you. Questions? Call or text{" "}
        <a href={BUSINESS.phoneHref} className="font-bold text-brand underline">
          {BUSINESS.phoneDisplay}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${EMAIL}`} className="font-bold text-brand underline">
          {EMAIL}
        </a>
        .
      </p>
    </div>
  )
}

function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-bold uppercase tracking-wider text-subtle">{label}</dt>
      <dd className={strong ? "text-xl font-extrabold text-sage-deep" : "font-bold text-navy"}>{value}</dd>
    </div>
  )
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 text-lg font-extrabold text-navy">{legend}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Field({ id, label, error, optional = false, wide = false, children }: { id: string; label: string; error?: string; optional?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-sm font-bold text-navy">
        {label} {optional && <span className="font-semibold text-subtle">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}

const aria = (key: keyof RegistrationErrors, errors: RegistrationErrors) => ({
  "aria-invalid": Boolean(errors[key]),
  "aria-describedby": errors[key] ? `reg-${key}-error` : undefined,
})

const inputClass = (error?: string) =>
  `min-h-12 w-full rounded-lg border-2 bg-white px-4 text-base text-ink ${error ? "border-error" : "border-line focus:border-navy"}`
