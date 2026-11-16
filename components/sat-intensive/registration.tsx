"use client"

import { useRef, useState, type FormEvent, type ReactNode } from "react"
import { Loader2, MessageSquare, Phone } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import { TuitionCalculator } from "@/components/sat-intensive/tuition-calculator"
import {
  CLASS_TIME_LABEL,
  GRADE_OPTIONS,
  INQUIRY_RECEIVED_STATEMENT,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  validateInquiry,
  type ClassDate,
  type InquiryErrors,
  type InquiryInput,
  type PaymentMethod,
} from "@/lib/sat-final-intensive"

type Received = { studentName: string; firstClassDate: ClassDate; paymentMethod: PaymentMethod }

const EMPTY: Omit<InquiryInput, "firstClassDate"> = {
  studentName: "",
  studentGrade: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  paymentMethod: "",
}

const SMS_HREF = BUSINESS.phoneHref.replace(/^tel:/, "sms:")

const newSubmissionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`

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
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [formError, setFormError] = useState("")
  const [busy, setBusy] = useState(false)
  const [received, setReceived] = useState<Received | null>(null)
  const startedAt = useRef<number | null>(null)
  const submissionId = useRef<string | null>(null)

  const quote = selected ? quoteFor(selected) : null
  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    startedAt.current ??= Date.now()
    // A changed form is a new submission; retries of an unchanged form reuse the same id so they are not duplicated.
    submissionId.current = null
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const selectDate = (date: ClassDate) => {
    submissionId.current = null
    onSelect(date)
    setErrors((e) => ({ ...e, firstClassDate: undefined }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const website = (new FormData(event.currentTarget).get("website") as string) ?? ""
    const input: InquiryInput = { ...fields, firstClassDate: selected ?? "" }
    const found = validateInquiry(input, new Date())
    setErrors(found)
    setFormError("")
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(first === "paymentMethod" ? "reg-paymentMethod-zelle" : `reg-${first}`)?.focus()
      return
    }
    submissionId.current ??= newSubmissionId()
    setBusy(true)
    try {
      const res = await fetch("/api/sat-final-intensive/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          website,
          submissionId: submissionId.current,
          elapsedMs: Date.now() - (startedAt.current ?? Date.now()),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === false) {
        setErrors(data.errors ?? {})
        setFormError(
          res.status === 429
            ? `Too many attempts. Please call or text ${BUSINESS.phoneDisplay} and we will help right away.`
            : (data.error ?? `Something went wrong. Please try again or call or text ${BUSINESS.phoneDisplay}.`),
        )
        return
      }
      setReceived({ studentName: input.studentName, firstClassDate: input.firstClassDate as ClassDate, paymentMethod: input.paymentMethod as PaymentMethod })
      requestAnimationFrame(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" }))
    } catch {
      setFormError(`We could not reach the server. Please try again or call or text ${BUSINESS.phoneDisplay}.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-4 bg-warm py-10 md:py-14">
      <div className="container flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <p className="eyebrow">Enrollment</p>
            <h2 id="register-title" className="text-balance text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
              Calculate tuition and request a seat
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">For parents and guardians. AhmedPrep will contact you to confirm availability.</p>
          </div>
          <ContactOptions />
        </div>

        {received ? (
          <ReceivedPanel received={received} />
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <TuitionCalculator available={available} selected={selected} onSelect={selectDate} error={errors.firstClassDate} />

            <form
              noValidate
              onSubmit={submit}
              aria-labelledby="reg-form-title"
              aria-describedby={formError ? "reg-form-error" : undefined}
              className="flex flex-col gap-6 rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-6"
            >
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Step 2 · Your details</p>
                <h3 id="reg-form-title" className="text-xl font-extrabold text-navy">
                  Registration request
                </h3>
              </div>

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
              </Fieldset>

              <Fieldset legend="Parent or guardian">
                <Field id="reg-parentName" label="Parent/guardian full name" error={errors.parentName} wide>
                  <input id="reg-parentName" autoComplete="name" value={fields.parentName} onChange={(e) => set("parentName", e.target.value)} {...aria("parentName", errors)} className={inputClass(errors.parentName)} />
                </Field>
                <Field id="reg-parentEmail" label="Parent email" error={errors.parentEmail}>
                  <input id="reg-parentEmail" type="email" autoComplete="email" value={fields.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} {...aria("parentEmail", errors)} className={inputClass(errors.parentEmail)} />
                </Field>
                <Field id="reg-parentPhone" label="Phone number" error={errors.parentPhone}>
                  <input id="reg-parentPhone" type="tel" autoComplete="tel" placeholder="(347) 555-0123" value={fields.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} {...aria("parentPhone", errors)} className={inputClass(errors.parentPhone)} />
                </Field>
              </Fieldset>

              <fieldset className="flex flex-col gap-2" aria-describedby={errors.paymentMethod ? "reg-paymentMethod-error" : undefined}>
                <legend className="mb-2 text-base font-extrabold text-navy">Preferred payment method</legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-invalid={Boolean(errors.paymentMethod)}>
                  {PAYMENT_METHODS.map((method) => {
                    const checked = fields.paymentMethod === method
                    return (
                      <label
                        key={method}
                        className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 text-sm font-bold transition-colors sm:text-base ${
                          checked ? "border-navy bg-cream text-navy" : errors.paymentMethod ? "border-error" : "border-line text-ink hover:border-navy/40"
                        }`}
                      >
                        <input
                          id={`reg-paymentMethod-${method}`}
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={checked}
                          onChange={() => set("paymentMethod", method)}
                          className="size-4 shrink-0 accent-navy"
                        />
                        {PAYMENT_METHOD_LABELS[method]}
                      </label>
                    )
                  })}
                </div>
                {errors.paymentMethod && (
                  <p id="reg-paymentMethod-error" className="text-sm font-semibold text-error">
                    {errors.paymentMethod}
                  </p>
                )}
              </fieldset>

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
                {busy ? "Sending…" : quote ? `Request a seat · ${formatUsd(quote.tuitionCents)}` : "Send registration request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

function ContactOptions() {
  const linkClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-navy/20 bg-paper px-4 text-sm font-extrabold text-navy transition-colors hover:border-navy"
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-subtle">Prefer the phone?</span>
      <a href={BUSINESS.phoneHref} className={linkClass} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <Phone size={16} aria-hidden="true" />
        Call
      </a>
      <a href={SMS_HREF} className={linkClass} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <MessageSquare size={16} aria-hidden="true" />
        Text
      </a>
      <span className="text-sm font-bold tabular-nums text-navy">{BUSINESS.phoneDisplay}</span>
    </div>
  )
}

function ReceivedPanel({ received }: { received: Received }) {
  const quote = quoteFor(received.firstClassDate)
  return (
    <div role="status" className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl border-2 border-gold bg-paper p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-balance text-2xl font-extrabold text-navy md:text-3xl">Thank you</h3>
        <p className="text-lg font-bold leading-relaxed text-ink">{INQUIRY_RECEIVED_STATEMENT}</p>
        <p className="text-sm leading-relaxed text-ink">
          Your seat is not reserved or confirmed yet. Please do not send any payment until AhmedPrep contacts you with instructions.
        </p>
      </div>

      <dl className="grid gap-4 rounded-lg bg-cream p-5 text-sm sm:grid-cols-2">
        <Summary label="Student" value={received.studentName} />
        <Summary label="Preferred start" value={formatClassDateLong(received.firstClassDate)} />
        <Summary label="Remaining classes" value={`${quote.remainingClasses} classes · ${quote.remainingHours} hours`} />
        <Summary label="Tuition for remaining classes" value={formatUsd(quote.tuitionCents)} strong />
        <Summary label="Preferred payment method" value={PAYMENT_METHOD_LABELS[received.paymentMethod]} />
        <Summary label="Class time" value={CLASS_TIME_LABEL} />
      </dl>

      <p className="text-sm leading-relaxed text-ink">
        In person at {ADDRESS_LINE_1}, {ADDRESS_LINE_2}. No class Thursday, November 26 (Thanksgiving).
      </p>
      <p className="text-sm leading-relaxed text-ink">
        Questions or need to reach us sooner? Call or text{" "}
        <a href={BUSINESS.phoneHref} className="font-bold text-brand underline">
          {BUSINESS.phoneDisplay}
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
    <fieldset className="flex flex-col">
      <legend className="mb-3 text-base font-extrabold text-navy">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Field({ id, label, error, wide = false, children }: { id: string; label: string; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-sm font-bold text-navy">
        {label}
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

const aria = (key: keyof InquiryErrors, errors: InquiryErrors) => ({
  "aria-invalid": Boolean(errors[key]),
  "aria-describedby": errors[key] ? `reg-${key}-error` : undefined,
})

const inputClass = (error?: string) =>
  `min-h-12 w-full rounded-lg border-2 bg-paper px-4 text-base text-ink ${error ? "border-error" : "border-line focus:border-navy"}`
