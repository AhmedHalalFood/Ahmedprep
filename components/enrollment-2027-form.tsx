"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import {
  ENROLLMENT_2027,
  ENROLLMENT_2027_NAME,
  ENROLLMENT_DISCLAIMER,
  FOUNDING_INTEREST_OPTIONS,
  GRADES_2027,
  SCHEDULE_UNSURE,
  scheduleOptionsFor,
} from "@/lib/enrollment-2027"

type InquiryData = {
  parentName: string
  email: string
  phone: string
  studentName: string
  studentGrade: string
  program: string
  schedule: string
  foundingInterest: string
  message: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCATION = "enrollment-2027"

const initial: InquiryData = {
  parentName: "",
  email: "",
  phone: "",
  studentName: "",
  studentGrade: "",
  program: "",
  schedule: "",
  foundingInterest: "",
  message: "",
}

function validate(d: InquiryData) {
  const errors: Partial<Record<keyof InquiryData, string>> = {}
  if (!d.parentName.trim()) errors.parentName = "Please enter a parent or guardian name."
  if (!d.email.trim()) errors.email = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(d.email.trim())) errors.email = "Please enter a valid email address."
  if (!d.phone.trim()) errors.phone = "Please enter a phone number."
  else if (d.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a 10-digit phone number."
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.studentGrade) errors.studentGrade = "Please select the student's current grade."
  if (!d.program) errors.program = "Please choose a program."
  if (!d.schedule) errors.schedule = "Please choose a preferred schedule."
  else if (d.program && !scheduleOptionsFor(d.program).includes(d.schedule)) errors.schedule = "Please choose a schedule for this program."
  if (!d.foundingInterest) errors.foundingInterest = "Please let us know about founding-family tuition."
  return errors
}

function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: keyof InquiryData
  legend: string
  options: { value: string; title: string; detail?: string }[]
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const errorId = `${LOCATION}-${name}-error`
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-semibold text-ink">
        {legend} <span aria-hidden="true" className="text-error">*</span>
        <span className="sr-only">(required)</span>
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-14 cursor-pointer items-start gap-3 border border-line bg-white px-4 py-3 text-navy transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/30"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-invalid={Boolean(error)}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--blue)]"
            />
            <span className="flex flex-col">
              <span className="text-sm font-bold">{o.title}</span>
              {o.detail && <span className="text-sm leading-relaxed text-subtle">{o.detail}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <p id={errorId} className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </fieldset>
  )
}

export function Enrollment2027Form() {
  const [submitted, setSubmitted] = useState<InquiryData | null>(null)
  const { data, errors, status, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/enrollment-2027",
    initial,
    validate,
    onSuccess: (sent) => {
      setSubmitted(sent)
      trackEvent(EVENTS.enrollment2027Lead, { location: LOCATION, program: sent.program, lead_stage: "inquiry_submit" })
    },
  })

  const field = (key: keyof InquiryData) => ({
    id: `${LOCATION}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  const selectedProgram = ENROLLMENT_2027.programs.find((p) => p.name === data.program)

  if (status === "success" && submitted) {
    return (
      <div role="status" className="border-t-4 border-gold pt-5">
        <p className="eyebrow blue">Inquiry received</p>
        <p className="mt-3 text-pretty text-lg font-extrabold leading-snug text-navy">
          {`Thank you, ${submitted.parentName}. We received your ${ENROLLMENT_2027_NAME} inquiry and sent a confirmation to ${submitted.email}.`}
        </p>
        <dl className="mt-4 flex flex-col gap-2 border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm text-navy">
          {(
            [
              ["Student", `${submitted.studentName} (${submitted.studentGrade})`],
              ["Program", submitted.program],
              ["Preferred schedule", submitted.schedule],
              ["Founding-family tuition", submitted.foundingInterest],
            ] as const
          ).map(([term, value]) => (
            <div key={term} className="flex flex-col">
              <dt className="font-bold">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-subtle">{ENROLLMENT_DISCLAIMER}</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-busy={status === "submitting"}
      aria-describedby={`${LOCATION}-required-note`}
      className="relative flex flex-col gap-6"
    >
      <Honeypot id={`${LOCATION}-website`} inputRef={honeypotRef} />
      <RequiredNote id={`${LOCATION}-required-note`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <TextField label="Email Address" type="email" inputMode="email" autoComplete="email" required {...field("email")} />
        <TextField label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" required {...field("phone")} />
        <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
        <SelectField label="Current Grade" required placeholder="Select grade" options={GRADES_2027} {...field("studentGrade")} />
      </div>

      <ChoiceCards
        name="program"
        legend="Program"
        value={data.program}
        error={errors.program}
        onChange={(v) => {
          update("program", v)
          if (data.schedule && !scheduleOptionsFor(v).includes(data.schedule)) update("schedule", "")
        }}
        options={ENROLLMENT_2027.programs.map((p) => ({ value: p.name, title: p.name, detail: p.kicker }))}
      />

      {selectedProgram ? (
        <ChoiceCards
          name="schedule"
          legend="Preferred Schedule"
          value={data.schedule}
          error={errors.schedule}
          onChange={(v) => update("schedule", v)}
          options={[
            ...selectedProgram.schedules.map((s) => ({
              value: `${s.label}: ${s.days}, ${s.time}`,
              title: s.label,
              detail: `${s.days}, ${s.time}`,
            })),
            { value: SCHEDULE_UNSURE, title: SCHEDULE_UNSURE, detail: "We can help you choose." },
          ]}
        />
      ) : (
        <div>
          <p className="text-sm font-semibold text-ink">
            Preferred Schedule <span aria-hidden="true" className="text-error">*</span>
            <span className="sr-only">(required)</span>
          </p>
          <p className="mt-2 border border-dashed border-line px-4 py-3 text-sm text-subtle">
            Choose a program above to see its weekday and weekend groups.
          </p>
          {errors.schedule && <p className="mt-1.5 text-xs font-medium text-error">{errors.schedule}</p>}
        </div>
      )}

      <SelectField
        label="Interested in Founding-Family Tuition?"
        required
        placeholder="Select an option"
        options={[...FOUNDING_INTEREST_OPTIONS]}
        hint={`${ENROLLMENT_2027.tuition.founding.total}. ${ENROLLMENT_2027.tuition.founding.summary}`}
        {...field("foundingInterest")}
      />

      <TextAreaField
        label="Comments"
        placeholder="Questions, goals, or anything we should know about your child."
        {...field("message")}
      />

      <p className="border-l-4 border-gold bg-cream px-4 py-3 text-sm leading-relaxed text-navy">{ENROLLMENT_DISCLAIMER}</p>

      {status === "error" && (
        <p role="alert" className="border-l-4 border-error bg-error-soft px-4 py-3 text-sm text-error">
          We couldn&apos;t send your inquiry. Please try again, or call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold underline">
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      )}

      <SubmitButton submitting={status === "submitting"}>
        Request Enrollment Information <ArrowRight size={17} aria-hidden="true" />
      </SubmitButton>
    </form>
  )
}
