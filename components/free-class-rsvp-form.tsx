"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { FREE_CLASS_GRADES } from "@/lib/free-class"

type RsvpData = {
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  consent: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(d: RsvpData) {
  const errors: Partial<Record<keyof RsvpData, string>> = {}
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.studentGrade) errors.studentGrade = "Please select the student's grade."
  if (!d.parentName.trim()) errors.parentName = "Please enter a parent or guardian name."
  if (!d.parentEmail.trim()) errors.parentEmail = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(d.parentEmail.trim())) errors.parentEmail = "Please enter a valid email address."
  if (!d.parentPhone.trim()) errors.parentPhone = "Please enter a phone number."
  else if (d.parentPhone.replace(/\D/g, "").length < 10) errors.parentPhone = "Please enter a 10-digit phone number."
  if (d.consent !== "yes") errors.consent = "Please agree so we can send your Zoom access information and class reminders."
  return errors
}

const initial: RsvpData = { studentName: "", studentGrade: "", parentName: "", parentEmail: "", parentPhone: "", consent: "" }

export function FreeClassRsvpForm({ location }: { location: string }) {
  const [submittedEmail, setSubmittedEmail] = useState("")
  const { data, errors, status, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/free-shsat-class",
    initial,
    validate,
    onStart: () => trackEvent(EVENTS.freeShsatClassRsvpStarted, { location }),
    onSuccess: (submitted) => {
      setSubmittedEmail(submitted.parentEmail.trim())
      trackEvent(EVENTS.freeShsatClassRsvpSubmitted, { location, grade: submitted.studentGrade })
    },
  })

  const field = (key: keyof RsvpData) => ({
    id: `${location}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6 sm:p-9">
        <CheckCircle2 size={32} aria-hidden="true" className="text-brand" />
        <div>
          <p className="eyebrow blue">Seat reserved</p>
          <p className="mt-3 text-2xl font-extrabold leading-snug text-navy">Your seat is reserved!</p>
          <p className="mt-3 leading-relaxed text-ink">
            We&apos;ve sent the class information to <strong className="break-all text-navy">{submittedEmail}</strong>. Check your inbox
            for your Zoom access information.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-subtle">
            Don&apos;t see it? Please check your spam folder, or call or text us at{" "}
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
            Book a Free SHSAT Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
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
      className="relative flex flex-col gap-5 border border-line bg-white p-5 sm:p-8"
    >
      <Honeypot id={`${location}-website`} inputRef={honeypotRef} />
      <RequiredNote id={`${location}-required-note`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
        <SelectField label="Student Grade" required placeholder="Select grade" options={FREE_CLASS_GRADES} {...field("studentGrade")} />
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <TextField label="Parent Email" type="email" inputMode="email" autoComplete="email" required hint="Zoom details are sent here." {...field("parentEmail")} />
        <div className="sm:col-span-2">
          <TextField label="Parent Phone Number" type="tel" inputMode="tel" autoComplete="tel" required placeholder="Your phone number" {...field("parentPhone")} />
        </div>
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
            I agree that AhmedPrep may use the contact information above to send information directly related to this class
            registration, including the Zoom access information and class reminders, by email, phone, or text. This is not a marketing
            subscription. Message and data rates may apply.
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

      {status === "error" && (
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
        <strong className="font-bold text-navy">No payment required.</strong> Free, with no obligation. The Zoom link is never posted
        publicly. It is sent only to registered families.
      </p>
    </form>
  )
}
