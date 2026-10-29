"use client"

import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextField } from "@/components/forms/fields"
import { LimitNotice } from "@/components/forms/limit-notice"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { FREE_ACCESS_POLICY_TEXT } from "@/lib/free-access-policy"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { FREE_CLASS_GRADES, RSVP_PROGRAMS, classMatchesProgram, type SundayClass } from "@/lib/free-class"

type RsvpData = {
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  classType: string
  classDate: string
  currentSchool: string
  consent: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONSENT_TEXT =
  "I agree that AhmedPrep may use the contact information above to send information directly related to this class registration, including the live class access information and reminders, by email, phone, or text. This is not a marketing subscription. Message and data rates may apply."

function validate(d: RsvpData) {
  const errors: Partial<Record<keyof RsvpData, string>> = {}
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.studentGrade) errors.studentGrade = "Please select the student's grade."
  if (!d.parentName.trim()) errors.parentName = "Please enter a parent or guardian name."
  if (!d.parentEmail.trim()) errors.parentEmail = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(d.parentEmail.trim())) errors.parentEmail = "Please enter a valid email address."
  if (!d.parentPhone.trim()) errors.parentPhone = "Please enter a phone number."
  else if (d.parentPhone.replace(/\D/g, "").length < 10) errors.parentPhone = "Please enter a 10-digit phone number."
  if (!d.classType) errors.classType = "Please choose SHSAT or Digital SAT."
  if (!d.classDate) errors.classDate = "Please choose a Sunday class."
  if (d.consent !== "yes") errors.consent = "Please agree so we can send your live class access information and reminders."
  return errors
}

export function FreeClassRsvpForm({
  location,
  classes,
  initialProgram = "",
  initialDate = "",
}: {
  location: string
  classes: SundayClass[]
  initialProgram?: string
  initialDate?: string
}) {
  const initial: RsvpData = {
    studentName: "",
    studentGrade: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    classType: initialProgram,
    classDate: initialDate,
    currentSchool: "",
    consent: "",
  }

  const eventParams = (d: RsvpData) => ({ location, class_type: d.classType || "unselected", class_date: d.classDate || "unselected" })

  const { data, errors, status, serverResult, limitMessage, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/free-sunday-class",
    initial,
    validate,
    onStart: () => trackEvent(EVENTS.sundayClassRsvpStarted, eventParams(initial)),
    onSuccess: (submitted) => trackEvent(EVENTS.sundayClassRsvpSubmitted, eventParams(submitted)),
  })

  const field = (key: keyof RsvpData) => ({
    id: `${location}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  const dateOptions = classes
    .filter((c) => !data.classType || classMatchesProgram(c, data.classType))
    .map((c) => ({ value: c.isoDate, label: `${c.shortLabel} · ${c.typeLabel}: ${c.topic}` }))

  const changeProgram = (program: string) => {
    update("classType", program)
    const selected = classes.find((c) => c.isoDate === data.classDate)
    if (selected && !classMatchesProgram(selected, program)) update("classDate", "")
  }

  const changeDate = (isoDate: string) => {
    update("classDate", isoDate)
    const selected = classes.find((c) => c.isoDate === isoDate)
    if (selected && selected.type !== "workshop") update("classType", selected.type)
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6 sm:p-9">
        <CheckCircle2 size={32} aria-hidden="true" className="text-brand" />
        <div>
          <p className="eyebrow blue">Seat reserved</p>
          <p className="mt-3 text-pretty text-xl font-extrabold leading-snug text-navy">
  {serverResult?.confirmation === "sent"
  ? "Your free class seat is reserved. We\u2019ve emailed your confirmation and Zoom details to the address you provided."
  : "Your registration was received and your free class seat is reserved. Your confirmation email may be delayed, so our team will email your class details and Zoom link before the session."}
  </p>
  <p className="mt-3 text-sm leading-relaxed text-subtle">
  {serverResult?.confirmation === "sent"
  ? "Don\u2019t see an email in a few minutes? Please check your spam folder, or call or text us at "
  : "Need the details sooner? Call or text us at "}
            <a href={BUSINESS.phoneHref} className="font-semibold text-navy underline underline-offset-2">
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
        </div>
        <div className="border-t border-line pt-5">
          <p className="font-bold text-navy">Want to know where your student stands?</p>
          <TrackedLink
            href="/free-diagnostic"
            event={EVENTS.diagnosticCtaClick}
            eventProps={{ location: `${location}_confirmation` }}
            className="button button-gold button-lg mt-3"
          >
            Book a Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    )
  }

  const consentId = `${location}-consent`

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-busy={status === "submitting"}
      aria-describedby={`${location}-required-note`}
      className="relative flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-5 sm:p-8"
    >
      <Honeypot id={`${location}-website`} inputRef={honeypotRef} />
      <RequiredNote id={`${location}-required-note`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Class"
          required
          placeholder="SHSAT or Digital SAT"
          options={RSVP_PROGRAMS}
          {...field("classType")}
          onChange={changeProgram}
        />
        <SelectField label="Sunday" required placeholder="Choose a date" options={dateOptions} {...field("classDate")} onChange={changeDate} />
        <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
        <SelectField label="Grade" required placeholder="Select grade" options={FREE_CLASS_GRADES} {...field("studentGrade")} />
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <TextField
          label="Parent Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          hint="Live class details are sent here."
          {...field("parentEmail")}
        />
        <TextField label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" required {...field("parentPhone")} />
        <TextField label="Current School" autoComplete="off" {...field("currentSchool")} />
      </div>

      <div>
        <label htmlFor={consentId} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            checked={data.consent === "yes"}
            onChange={(e) => update("consent", e.target.checked ? "yes" : "")}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${consentId}-error` : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--blue)]"
          />
          <span>
            {CONSENT_TEXT}
            <span aria-hidden="true" className="text-error"> *</span>
            <span className="sr-only"> (required)</span>
          </span>
        </label>
        {errors.consent && (
          <p id={`${consentId}-error`} className="mt-1.5 text-xs font-medium text-error">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && limitMessage && <LimitNotice message={limitMessage} />}
      {status === "error" && !limitMessage && (
        <p role="alert" className="border-l-4 border-error bg-error-soft px-4 py-3 text-sm text-error">
          We couldn&apos;t complete your registration. Please try again, or call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold underline">
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      )}

      <SubmitButton submitting={status === "submitting"}>
        Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
      </SubmitButton>
      <p className="text-xs leading-relaxed text-subtle">
        <strong className="font-bold text-navy">No cost • Live instruction • RSVP required.</strong> The live class link is never posted
        publicly. It is sent only to registered families.
      </p>
      <p className="text-xs leading-relaxed text-subtle">{FREE_ACCESS_POLICY_TEXT}</p>
    </form>
  )
}
