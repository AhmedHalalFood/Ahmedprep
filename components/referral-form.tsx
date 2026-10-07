"use client"

import { ArrowUpRight } from "lucide-react"
import { Honeypot, ProgramRadios, RequiredNote, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

type ReferralData = {
  referrerName: string
  referrerPhone: string
  referrerEmail: string
  studentName: string
  parentContact: string
  program: string
}

const initial: ReferralData = { referrerName: "", referrerPhone: "", referrerEmail: "", studentName: "", parentContact: "", program: "" }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(d: ReferralData) {
  const errors: Partial<Record<keyof ReferralData, string>> = {}
  if (!d.referrerName.trim()) errors.referrerName = "Please enter your name."
  if (!d.referrerPhone.trim()) errors.referrerPhone = "Please enter your phone number."
  else if (d.referrerPhone.replace(/\D/g, "").length < 10) errors.referrerPhone = "Please enter a 10-digit phone number."
  if (!d.referrerEmail.trim()) errors.referrerEmail = "Please enter your email address."
  else if (!EMAIL_PATTERN.test(d.referrerEmail.trim())) errors.referrerEmail = "Please enter a valid email address."
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.parentContact.trim()) errors.parentContact = "Please share how we can reach the family."
  if (!d.program) errors.program = "Please choose SHSAT or Digital SAT."
  return errors
}

export function ReferralForm() {
  const { data, errors, status, setStatus, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/referral",
    initial,
    validate,
    onSuccess: (d) => trackEvent(EVENTS.referralSubmitted, { program: d.program }),
  })

  const field = (key: keyof ReferralData) => ({
    id: `referral-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  if (status === "success") {
    return (
      <div role="status" className="border border-line border-t-4 border-t-gold bg-white p-6 sm:p-9">
        <p className="eyebrow blue">Referral received</p>
        <p className="mt-4 text-xl font-extrabold leading-snug text-navy">Thank you for referring a family to AhmedPrep.</p>
        <p className="mt-3 leading-relaxed text-subtle">We&apos;ll reach out to them shortly and let them know you sent them our way.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-brand underline underline-offset-4">
          Refer another student
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-busy={status === "submitting"}
      aria-describedby="referral-required-note"
      className="relative flex flex-col gap-5 border border-line bg-white p-5 sm:p-8"
    >
      <Honeypot id="referral-website" inputRef={honeypotRef} />
      <RequiredNote id="referral-required-note" />
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">Your information</legend>
        <div className="sm:col-span-2">
          <TextField label="Referring Parent/Student Name" autoComplete="name" required {...field("referrerName")} />
        </div>
        <TextField label="Phone" type="tel" inputMode="tel" autoComplete="tel" required {...field("referrerPhone")} />
        <TextField label="Email" type="email" inputMode="email" autoComplete="email" required {...field("referrerEmail")} />
      </fieldset>
      <fieldset className="flex flex-col gap-5 border-t border-line pt-5">
        <legend className="mb-1 pt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">Family you&apos;re referring</legend>
        <TextField label="Student Being Referred" autoComplete="off" required {...field("studentName")} />
        <TextAreaField
          label="Parent Contact Information"
          required
          placeholder="Parent's name and the best phone number or email to reach them"
          {...field("parentContact")}
        />
        <ProgramRadios name="program" idPrefix="referral" value={data.program} onChange={(v) => update("program", v)} error={errors.program} />
      </fieldset>

      {status === "error" && (
        <p role="alert" className="border-l-4 border-error bg-error-soft px-4 py-3 text-sm text-error">
          We couldn&apos;t send your referral. Please try again, or call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold underline">
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      )}

      <SubmitButton submitting={status === "submitting"}>
        Send Referral <ArrowUpRight size={17} aria-hidden="true" />
      </SubmitButton>
      <p className="text-xs leading-relaxed text-subtle">Please share a family&apos;s contact details only with their permission.</p>
    </form>
  )
}
