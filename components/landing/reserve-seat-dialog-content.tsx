"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import {
  CLASS_TIME,
  PROGRAM_FORMAT,
  PROGRAM_LOCATION,
  classSession,
  INTENSIVE_NAME,
  PAYMENT_OPTIONS,
  START_DATE_UNSURE,
  TUITION_PER_CLASS,
  formatClassDate,
  formatUsd,
  quoteFor,
  remainingClassDates,
  upcomingStartOptions,
} from "@/lib/shsat-intensive"

function TuitionSummary({ startDate }: { startDate: string }) {
  const base = "-mt-2 border-l-4 px-4 py-4 text-navy"
  if (!startDate) {
    return (
      <div aria-live="polite" className={`${base} border-brand bg-brand-soft text-sm font-semibold leading-relaxed`}>
        {"Select your child\u2019s first class date to see the exact tuition."}
      </div>
    )
  }
  if (startDate === START_DATE_UNSURE) {
    return (
      <div aria-live="polite" className={`${base} border-gold bg-cream text-sm font-semibold leading-relaxed`}>
        {`Tuition is ${formatUsd(TUITION_PER_CLASS)} per three-hour class remaining. We will help you choose a start date and confirm the exact total.`}
      </div>
    )
  }
  if (!remainingClassDates().includes(startDate)) {
    return (
      <div role="alert" className={`${base} border-error bg-error-soft text-sm font-semibold leading-relaxed text-error`}>
        This class has already started and is no longer available. Please choose another first class.
      </div>
    )
  }
  const quote = quoteFor(startDate)
  const rows: [string, string][] = [
    ["First class", `${formatClassDate(quote.date, "long")}, ${classSession(quote.date).label}`],
    ["Remaining classes", `${quote.classes} (including the first class)`],
    ["Instructional hours", `${quote.hours} hours`],
    ["Tuition rate", `${formatUsd(quote.rate)} per three-hour class`],
  ]
  return (
    <div aria-live="polite" className={`${base} border-gold bg-cream`}>
      <dl className="grid gap-x-4 gap-y-1 text-sm leading-relaxed sm:grid-cols-[auto_1fr]">
        {rows.map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="font-bold">{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-gold pt-3">
        <span className="text-sm font-bold uppercase tracking-wide">Total tuition</span>
        <span className="text-3xl font-extrabold tracking-tight">{formatUsd(quote.tuition)}</span>
      </p>
    </div>
  )
}

type SeatData = {
  parentName: string
  studentName: string
  studentGrade: string
  phone: string
  email: string
  currentSchool: string
  startDate: string
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
  startDate: "",
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
  if (!d.startDate) errors.startDate = "Please choose your child\u2019s first class."
  else if (d.startDate !== START_DATE_UNSURE && !remainingClassDates().includes(d.startDate))
    errors.startDate = "That class is no longer available. Please choose another first class."
  if (!d.paymentOption) errors.paymentOption = "Please choose a payment option."
  return errors
}

function ReserveSeatForm({ initialStartDate }: { initialStartDate?: string | null }) {
  const [submitted, setSubmitted] = useState<SeatData | null>(null)
  const [startInitial] = useState<SeatData>(() =>
    initialStartDate && remainingClassDates().includes(initialStartDate)
      ? { ...initial, startDate: initialStartDate }
      : initial,
  )
  const { data, errors, status, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/shsat-intensive",
    initial: startInitial,
    validate,
    onSuccess: (sent) => {
      setSubmitted(sent)
      trackEvent(EVENTS.shsatIntensiveLead, { location: LOCATION, program: INTENSIVE_NAME, lead_stage: "inquiry_submit" })
    },
  })

  const field = (key: keyof SeatData) => ({
    id: `${LOCATION}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  if (status === "success") {
    const quote = submitted && submitted.startDate !== START_DATE_UNSURE ? quoteFor(submitted.startDate) : null
    const details: [string, string][] = quote
      ? [
          ["First class", `${formatClassDate(quote.date, "long")}, ${classSession(quote.date).label}`],
          ["Remaining classes", `${quote.classes} (including the first class)`],
          ["Instructional hours", `${quote.hours} hours`],
          ["Tuition", `${formatUsd(quote.tuition)} (${formatUsd(quote.rate)} per three-hour class)`],
        ]
      : [["First class", `Not sure yet. We will help you choose a start date (${formatUsd(TUITION_PER_CLASS)} per remaining class).`]]
    return (
      <div role="status" className="border-t-4 border-gold pt-5">
        <p className="eyebrow blue">Inquiry received</p>
        <p className="mt-3 text-lg font-extrabold leading-snug text-navy">
          {"Thank you. We received your enrollment inquiry and will contact you to confirm enrollment and payment details. No payment has been taken."}
        </p>
        <dl className="mt-4 flex flex-col gap-2 border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm text-navy">
          {details.map(([term, value]) => (
            <div key={term} className="flex flex-col">
              <dt className="font-bold">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className="flex flex-col">
            <dt className="font-bold">Payment option</dt>
            <dd>{submitted?.paymentOption}</dd>
          </div>
        </dl>
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
        label="First Class Your Child Will Attend"
        required
        placeholder="Select a class date"
        options={upcomingStartOptions()}
        {...field("startDate")}
      />
      <TuitionSummary startDate={data.startDate} />
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
        Submit Enrollment Inquiry <ArrowRight size={17} aria-hidden="true" />
      </SubmitButton>
      <p className="text-xs leading-relaxed text-subtle">
        This is an inquiry, not a payment or confirmed enrollment. We will call or email to confirm enrollment and payment details.
      </p>
    </form>
  )
}

export default function ReserveSeatDialogContent({
  open,
  onOpenChange,
  initialStartDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStartDate?: string | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-none border-t-4 border-t-gold bg-white text-navy sm:max-w-2xl">
        <DialogHeader className="text-left">
          <p className="eyebrow blue">{INTENSIVE_NAME}</p>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-navy">Enrollment Inquiry</DialogTitle>
          <DialogDescription className="leading-relaxed text-subtle">
            {`Monday\u2013Thursday, ${CLASS_TIME} \u00b7 ${PROGRAM_FORMAT} at ${PROGRAM_LOCATION}. Choose your child\u2019s first class below to see the exact tuition.`}
          </DialogDescription>
        </DialogHeader>
        <ReserveSeatForm initialStartDate={initialStartDate} />
      </DialogContent>
    </Dialog>
  )
}
