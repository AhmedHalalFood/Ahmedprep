"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Loader2, Lock } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import {
  CLASS_DATES,
  CLASS_TIME_LABEL,
  GRADE_OPTIONS,
  PAYMENT_HOLD_MINUTES,
  POLICY_PENDING_NOTE,
  SAT_REGISTRATION_OPTIONS,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  validateRegistration,
  type ClassDate,
  type RegistrationErrors,
  type RegistrationInput,
} from "@/lib/sat-final-intensive"

type Hold = { enrollmentId: string; paymentToken: string; holdExpiresAt: string; tuitionCents: number; remainingClasses: number; remainingHours: number; firstClassDate: ClassDate }
type Confirmed = { paymentReference: string; studentName: string; parentEmail: string; firstClassDate: ClassDate; remainingClasses: number; tuitionCents: number; emails: { family: string; admin: string } }

const EMPTY: Omit<RegistrationInput, "firstClassDate"> = {
  studentName: "",
  studentGrade: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  previousScore: "",
  targetScore: "",
  satRegistration: "",
  policyAcknowledged: false,
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

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
  const [hold, setHold] = useState<Hold | null>(null)
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null)

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
      document.getElementById(`reg-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setBusy(true)
    const { ok, data } = await postJson("/api/sat-final-intensive/register", { ...input, website })
    setBusy(false)
    if (!ok) {
      setErrors(data.errors ?? {})
      setFormError(data.error ?? "Something went wrong. Please try again.")
      return
    }
    setHold(data)
  }

  async function pay() {
    if (!hold || busy) return
    setBusy(true)
    setFormError("")
    const { ok, data } = await postJson("/api/sat-final-intensive/simulate-payment", {
      enrollmentId: hold.enrollmentId,
      paymentToken: hold.paymentToken,
    })
    setBusy(false)
    if (!ok) {
      setFormError(data.error ?? "Payment could not be recorded. Please try again.")
      return
    }
    setConfirmed(data)
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
              For parents and guardians. Full tuition for all remaining classes is paid upfront to confirm a seat. Seats are limited to 12 students.
            </p>
          </div>

          <p className="flex items-start gap-3 rounded-lg border border-gold bg-cream p-4 text-sm leading-relaxed text-ink">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
            <span>
              <strong>Preview test mode.</strong> Payment is simulated: no card is collected and no money is charged. Emails go only to a test inbox.
            </span>
          </p>

          {confirmed ? (
            <ConfirmedPanel confirmed={confirmed} />
          ) : hold ? (
            <PaymentPanel hold={hold} busy={busy} error={formError} onPay={pay} onBack={() => setHold(null)} />
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
                      Due in full upfront. {quote.remainingClasses} × {formatUsd(7500)} per class.
                    </p>
                    <p className="text-sm leading-relaxed text-subtle">
                      Classes: {quote.remainingDates.map((d) => formatClassDate(d)).join(", ")}
                    </p>
                  </div>
                )}
              </Fieldset>

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
                    I understand that tuition is {formatUsd(7500)} per 3-hour class and that{" "}
                    <strong>{quote ? formatUsd(quote.tuitionCents) : "the full tuition"}</strong> for all remaining classes is due in full upfront, with no
                    installments or individual drop-in classes. I agree to AhmedPrep’s refund and cancellation policy.
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

              <button
                type="submit"
                disabled={busy || !selected}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-8 text-base font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
                {busy ? "Saving…" : `Continue to payment${quote ? ` · ${formatUsd(quote.tuitionCents)}` : ""}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function PaymentPanel({ hold, busy, error, onPay, onBack }: { hold: Hold; busy: boolean; error: string; onPay: () => void; onBack: () => void }) {
  const expires = new Date(hold.holdExpiresAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })
  return (
    <div className="flex flex-col gap-6 rounded-xl border-2 border-navy/15 p-6 md:p-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Step 2 of 2 · Payment</p>
        <h3 className="text-2xl font-extrabold text-navy">Your seat is held until {expires} ET</h3>
        <p className="text-sm leading-relaxed text-subtle">
          We hold seats for {PAYMENT_HOLD_MINUTES} minutes while you complete payment. Status: <strong className="text-ink">Awaiting payment</strong>
        </p>
      </div>
      <dl className="grid gap-3 rounded-lg bg-warm p-5 text-sm sm:grid-cols-2">
        <Summary label="First class" value={formatClassDateLong(hold.firstClassDate)} />
        <Summary label="Classes / hours" value={`${hold.remainingClasses} classes · ${hold.remainingHours} hours`} />
        <Summary label="Class time" value={CLASS_TIME_LABEL} />
        <Summary label="Tuition due now" value={formatUsd(hold.tuitionCents)} strong />
      </dl>
      {error && (
        <p role="alert" className="rounded-lg bg-error-soft p-4 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onPay}
        disabled={busy}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-8 text-base font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover disabled:opacity-60"
      >
        {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
        {busy ? "Processing…" : `Complete test payment · ${formatUsd(hold.tuitionCents)}`}
      </button>
      <p className="text-center text-xs text-subtle">Simulated payment for Preview testing. No card details are requested and no charge is made.</p>
      <button type="button" onClick={onBack} disabled={busy} className="text-sm font-bold text-brand underline underline-offset-4">
        Edit registration details
      </button>
    </div>
  )
}

function ConfirmedPanel({ confirmed }: { confirmed: Confirmed }) {
  const quote = quoteFor(confirmed.firstClassDate)
  return (
    <div role="status" className="flex flex-col gap-6 rounded-xl border-2 border-sage bg-sage-soft p-6 md:p-8">
      <div className="flex items-start gap-4">
        <CheckCircle2 size={36} className="shrink-0 text-sage-deep" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-extrabold text-navy">{confirmed.studentName} is enrolled</h3>
          <p className="text-sm text-ink">
            Status: <strong>Confirmed · Paid {formatUsd(confirmed.tuitionCents)}</strong> · Confirmation #{confirmed.paymentReference}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink">
        <p>
          <strong>First class:</strong> {formatClassDateLong(confirmed.firstClassDate)}, {CLASS_TIME_LABEL}
        </p>
        <p>
          <strong>All class dates:</strong> {quote.remainingDates.map((d) => formatClassDate(d)).join(", ")}
        </p>
        <p>
          <strong>Location:</strong> {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
        </p>
        <p>
          A confirmation email has been prepared for {confirmed.parentEmail}
          {confirmed.emails.family === "test_inbox" ? " (Preview: delivered to the test inbox only)" : ""}. Questions? Call or text{" "}
          <a href={BUSINESS.phoneHref} className="font-bold text-brand underline">{BUSINESS.phoneDisplay}</a>.
        </p>
      </div>
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
