"use client"

import { useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ADDRESS_LINE_1, ADDRESS_LINE_2 } from "@/lib/business"

type FormData = {
  name: string
  grade: string
  email: string
  phone: string
  program: string
  level: string
  goal: string
  message: string
}
type FieldKey = keyof FormData
type Status = "idle" | "submitting" | "success" | "error"

const initialData: FormData = { name: "", grade: "", email: "", phone: "", program: "", level: "", goal: "", message: "" }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data: FormData) {
  const errors: Partial<Record<FieldKey, string>> = {}
  if (!data.name.trim()) errors.name = "Please enter a parent or student name."
  if (!data.grade.trim()) errors.grade = "Please enter the student's grade."
  if (!data.email.trim()) errors.email = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = "Please enter a valid email address."
  if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a 10-digit phone number."
  if (!data.program) errors.program = "Please select a program."
  return errors
}

const inputClass =
  "mt-2 h-11 w-full border border-[#d9d3c8] bg-[#fffdf9] px-3 text-base text-[#0b1d35] outline-none transition-colors focus-visible:border-[#0b2b50] focus-visible:ring-2 focus-visible:ring-[#0b2b50]/20 aria-[invalid=true]:border-[#b42318]"

export function Contact() {
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [status, setStatus] = useState<Status>("idle")
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const update = (key: FieldKey, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return

    const nextErrors = validate(data)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus("submitting")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Request failed")
      setStatus("success")
      setData(initialData)
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus("error")
    }
  }

  const fieldProps = (key: FieldKey) => ({
    name: key,
    id: `contact-${key}`,
    value: data[key],
    error: errors[key],
    onChange: (value: string) => update(key, value),
  })

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-32 border-t border-[#dbe3ec] bg-white pb-16 pt-16 lg:pb-20 lg:pt-20">
      <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-16">
        <div>
          <p className="eyebrow blue">Start with a conversation</p>
          <h2 id="contact-heading" className="mt-4 text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#0b2b50] lg:text-5xl">
            A clearer plan starts here.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-[#536174]">
            Tell us where your student is starting and where they want to go. We&apos;ll discuss the right preparation strategy and next steps.
          </p>
          <dl className="mt-8 flex flex-col gap-4 border-t border-[#d9d3c8] pt-6 text-sm text-[#536174]">
            <div>
              <dt className="font-bold text-[#0b1d35]">Phone</dt>
              <dd><a href="tel:+13474795020" className="underline-offset-4 hover:text-[#0b2b50] hover:underline">(347) 479-5020</a></dd>
            </div>
            <div>
              <dt className="font-bold text-[#0b1d35]">Email</dt>
              <dd><a href="mailto:Tariq@ahmedprep.com" className="underline-offset-4 hover:text-[#0b2b50] hover:underline">Tariq@ahmedprep.com</a></dd>
            </div>
            <div>
              <dt className="font-bold text-[#0b1d35]">Location</dt>
              <dd><address className="not-italic">{ADDRESS_LINE_1}<br />{ADDRESS_LINE_2}</address></dd>
            </div>
          </dl>
        </div>

        {status === "success" ? (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="border border-[#d9d3c8] border-t-[3px] border-t-[#c9a45c] bg-white p-6 outline-none sm:p-9"
          >
            <p className="eyebrow blue">Request received</p>
            <h3 className="mt-4 text-2xl font-extrabold text-[#0b2b50]">Thank you. We&apos;ll be in touch shortly.</h3>
            <p className="mt-4 leading-relaxed text-[#536174]">
              Your consultation request has been sent. Expect a reply by email or phone to schedule a time. For anything urgent, call{" "}
              <a href="tel:+13474795020" className="font-semibold text-[#0b2b50] underline underline-offset-4">(347) 479-5020</a>.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-semibold text-[#0b2b50] underline underline-offset-4"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            aria-busy={status === "submitting"}
            aria-describedby="contact-required-note"
            className="border border-[#d9d3c8] bg-white p-6 shadow-sm sm:p-9"
          >
            <p id="contact-required-note" className="mb-5 text-xs text-[#536174]">
              Fields marked <span aria-hidden="true" className="text-[#b42318]">*</span><span className="sr-only">with an asterisk</span> are required.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Parent / Student Name" autoComplete="name" required {...fieldProps("name")} />
              <Field label="Student Grade" required placeholder="e.g. 7th grade" {...fieldProps("grade")} />
              <Field label="Email" type="email" autoComplete="email" required {...fieldProps("email")} />
              <Field label="Phone" type="tel" autoComplete="tel" {...fieldProps("phone")} />
              <div>
                <label htmlFor="contact-program" className="text-sm font-medium text-[#25364c]">
                  Program <span aria-hidden="true" className="text-[#b42318]">*</span>
                </label>
                <select
                  id="contact-program"
                  name="program"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.program)}
                  aria-describedby={errors.program ? "contact-program-error" : undefined}
                  value={data.program}
                  onChange={(e) => update("program", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a program</option>
                  <option value="SHSAT">SHSAT</option>
                  <option value="Digital SAT">Digital SAT</option>
                </select>
                {errors.program && <p id="contact-program-error" className="mt-1.5 text-xs text-[#b42318]">{errors.program}</p>}
              </div>
              <Field label="Current score or starting level (optional)" {...fieldProps("level")} />
              <Field label="Target score or goal (optional)" {...fieldProps("goal")} />
            </div>
            <div className="mt-5">
              <label htmlFor="contact-message" className="text-sm font-medium text-[#25364c]">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
                maxLength={2000}
                className={`${inputClass} h-auto min-h-28 resize-y py-3`}
                placeholder="Tell us about your student's goals..."
              />
            </div>

            {status === "error" && (
              <p role="alert" className="mt-5 border-l-[3px] border-[#b42318] bg-[#fdf3f2] px-4 py-3 text-sm text-[#7a1a12]">
                We couldn&apos;t send your request. Please try again, or contact us at{" "}
                <a href="tel:+13474795020" className="font-semibold underline">(347) 479-5020</a> or{" "}
                <a href="mailto:Tariq@ahmedprep.com" className="font-semibold underline">Tariq@ahmedprep.com</a>.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0b1d35] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#162f50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <span aria-hidden="true" className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending request...
                </>
              ) : (
                <>
                  Request My Free Consultation
                  <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

type FieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}

function Field({ id, name, label, value, onChange, error, type = "text", required = false, autoComplete, placeholder }: FieldProps) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[#25364c]">
        {label} {required && <span aria-hidden="true" className="text-[#b42318]">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {error && <p id={errorId} className="mt-1.5 text-xs text-[#b42318]">{error}</p>}
    </div>
  )
}
