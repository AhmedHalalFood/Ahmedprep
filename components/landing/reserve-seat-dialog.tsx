"use client"

import { useState, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { INTENSIVE_NAME, PAYMENT_OPTIONS } from "@/lib/shsat-intensive"

type SeatData = {
  parentName: string
  studentName: string
  studentGrade: string
  phone: string
  email: string
  currentSchool: string
  paymentOption: string
  message: string
}

const GRADES = ["7th grade", "8th grade", "9th grade", "Other"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCATION = "shsat-intensive"

const initial: SeatData = {
  parentName: "",
  studentName: "",
  studentGrade: "",
  phone: "",
  email: "",
  currentSchool: "",
  paymentOption: "",
  message: "",
}

function validate(d: SeatData) {
  const errors: Partial<Record<keyof SeatData, string>> = {}
  if (!d.parentName.trim()) errors.parentName = "Please enter a parent or guardian name."
  if (!d.studentName.trim()) errors.studentName = "Please enter the student's name."
  if (!d.studentGrade) errors.studentGrade = "Please select the student's grade."
  if (!d.phone.trim()) errors.phone = "Please enter a phone number."
  else if (d.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a 10-digit phone number."
  if (!d.email.trim()) errors.email = "Please enter an email address."
  else if (!EMAIL_PATTERN.test(d.email.trim())) errors.email = "Please enter a valid email address."
  if (!d.currentSchool.trim()) errors.currentSchool = "Please enter the student's current school."
  if (!d.paymentOption) errors.paymentOption = "Please choose a payment option."
  return errors
}

function ReserveSeatForm() {
  const { data, errors, status, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/shsat-intensive",
    initial,
    validate,
    onSuccess: () =>
      trackEvent(EVENTS.shsatIntensiveLead, { location: LOCATION, program: INTENSIVE_NAME, lead_stage: "inquiry_submit" }),
  })

  const field = (key: keyof SeatData) => ({
    id: `${LOCATION}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  if (status === "success") {
    return (
      <div role="status" className="border-t-4 border-gold pt-5">
        <p className="eyebrow blue">Request received</p>
        <p className="mt-3 text-lg font-extrabold leading-snug text-navy">
          {"Thank you. We received your request for the 2026 SHSAT Final Intensive and will contact you shortly to confirm your child\u2019s seat."}
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
      aria-describedby={`${LOCATION}-required-note`}
      className="relative flex flex-col gap-5"
    >
      <Honeypot id={`${LOCATION}-website`} inputRef={honeypotRef} />
      <RequiredNote id={`${LOCATION}-required-note`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
        <SelectField label="Student Grade" required placeholder="Select grade" options={GRADES} {...field("studentGrade")} />
        <TextField label="Current School" autoComplete="off" required {...field("currentSchool")} />
        <TextField label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" required {...field("phone")} />
        <TextField label="Email Address" type="email" inputMode="email" autoComplete="email" required {...field("email")} />
      </div>
      <SelectField
        label="Preferred Payment Option"
        required
        placeholder="Select a payment option"
        options={[...PAYMENT_OPTIONS]}
        {...field("paymentOption")}
      />
      <TextAreaField label="Short Message" placeholder="Questions, scheduling notes, or areas your child wants to strengthen." {...field("message")} />

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
        {"Reserve My Child\u2019s Seat"} <ArrowRight size={17} aria-hidden="true" />
      </SubmitButton>
      <p className="text-xs leading-relaxed text-subtle">
        Submitting this form does not charge you. We will call or email to confirm enrollment and payment details.
      </p>
    </form>
  )
}

export function ReserveSeatDialog({
  trigger,
  location = "shsat_intensive_reserve",
}: {
  trigger?: ReactNode
  location?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) trackEvent(EVENTS.shsatIntensiveLead, { location, lead_stage: "reserve_click" })
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <button type="button" className="button button-gold button-lg uppercase">
            {"Reserve My Child\u2019s Seat"} <ArrowRight size={17} aria-hidden="true" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-none border-t-4 border-t-gold bg-white text-navy sm:max-w-2xl">
        <DialogHeader className="text-left">
          <p className="eyebrow blue">Enrollment inquiry</p>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-navy">{INTENSIVE_NAME}</DialogTitle>
          <DialogDescription className="leading-relaxed text-subtle">
            Oct. 12 – Nov. 12, 2026 · Mon–Thu, 6:00–9:00 PM · $1,000 or 2 payments of $500
          </DialogDescription>
        </DialogHeader>
        <ReserveSeatForm />
      </DialogContent>
    </Dialog>
  )
}
