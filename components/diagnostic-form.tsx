"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { Honeypot, ProgramRadios, RequiredNote, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

export type Program = "SHSAT" | "Digital SAT"

type DiagnosticData = {
  studentName: string
  studentGrade: string
  parentName: string
  parentPhone: string
  parentEmail: string
  program: string
  preferredDate: string
  currentScore: string
  target: string
  notes: string
}

const GRADES = ["5th grade", "6th grade", "7th grade", "8th grade", "9th grade", "10th grade", "11th grade", "12th grade", "Other"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(d: DiagnosticData) {
  const errors: Partial<Record<keyof DiagnosticData, string>> = {}
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.studentGrade) errors.studentGrade = "Please select the student's grade."
  if (!d.parentName.trim()) errors.parentName = "Please enter a parent or guardian name."
  if (!d.parentPhone.trim()) errors.parentPhone = "Please enter a phone number."
  else if (d.parentPhone.replace(/\D/g, "").length < 10) errors.parentPhone = "Please enter a 10-digit phone number."
  if (!d.parentEmail.trim()) errors.parentEmail = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(d.parentEmail.trim())) errors.parentEmail = "Please enter a valid email address."
  if (!d.program) errors.program = "Please choose SHSAT or Digital SAT."
  if (!d.preferredDate) errors.preferredDate = "Please choose a preferred date."
  else {
    const today = new Date().toLocaleDateString("en-CA")
    if (d.preferredDate < today) errors.preferredDate = "Please choose a future date."
  }
  return errors
}

export function DiagnosticForm({ defaultProgram = "", location }: { defaultProgram?: Program | ""; location: string }) {
  const router = useRouter()
  const initial: DiagnosticData = {
    studentName: "",
    studentGrade: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    program: defaultProgram,
    preferredDate: "",
    currentScore: "",
    target: "",
    notes: "",
  }

  const { data, errors, status, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/diagnostic",
    initial,
    validate,
    onStart: () => trackEvent(EVENTS.diagnosticFormStarted, { location, program: defaultProgram || null }),
    onSuccess: (submitted) => {
      trackEvent(EVENTS.diagnosticFormSubmitted, { location, program: submitted.program })
      router.push(`/thank-you?program=${encodeURIComponent(submitted.program)}`)
    },
  })

  const id = (key: keyof DiagnosticData) => `${location}-${key}`
  const field = (key: keyof DiagnosticData) => ({
    id: id(key),
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  const targetLabel =
    data.program === "SHSAT" ? "Target school" : data.program === "Digital SAT" ? "Target SAT score" : "Target school or SAT score"

  if (status === "success") {
    return (
      <div role="status" className="border border-line border-t-4 border-t-gold bg-white p-6 sm:p-9">
        <p className="eyebrow blue">Request received</p>
        <p className="mt-4 text-xl font-extrabold leading-snug text-navy">
          Thank you for registering with AhmedPrep. We received your diagnostic request and will contact you shortly to confirm your appointment.
        </p>
      </div>
    )
  }

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

      <ProgramRadios name="program" idPrefix={location} value={data.program} onChange={(v) => update("program", v)} error={errors.program} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
        <SelectField label="Student Grade" required placeholder="Select grade" options={GRADES} {...field("studentGrade")} />
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <TextField label="Parent Phone Number" type="tel" inputMode="tel" autoComplete="tel" required placeholder="Your phone number" {...field("parentPhone")} />
        <TextField label="Parent Email" type="email" inputMode="email" autoComplete="email" required {...field("parentEmail")} />
        <TextField label="Preferred Date" type="date" required hint="We'll confirm the exact time with you." {...field("preferredDate")} />
        <TextField label="Current score, if known" placeholder={data.program === "Digital SAT" ? "e.g. 1180 PSAT" : "e.g. school practice test"} {...field("currentScore")} />
        <TextField
          label={targetLabel}
          placeholder={data.program === "Digital SAT" ? "e.g. 1400+" : data.program === "SHSAT" ? "e.g. Bronx Science" : ""}
          {...field("target")}
        />
      </div>
      <TextAreaField label="Additional Notes" placeholder="Scheduling preferences, learning needs, or questions for us." {...field("notes")} />

      {status === "error" && (
        <p role="alert" className="border-l-4 border-error bg-error-soft px-4 py-3 text-sm text-error">
          We couldn&apos;t send your request. Please try again, or call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold underline">
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      )}

      <SubmitButton submitting={status === "submitting"}>
        Book My Free Diagnostic <ArrowUpRight size={17} aria-hidden="true" />
      </SubmitButton>
      <p className="text-xs leading-relaxed text-subtle">
        No cost and no obligation. We use your information only to schedule the diagnostic and follow up about AhmedPrep programs.
      </p>
    </form>
  )
}
