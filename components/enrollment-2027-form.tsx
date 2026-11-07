"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Honeypot, RequiredNote, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/fields"
import { useLeadForm } from "@/components/forms/use-lead-form"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import {
  PROGRAMS_2027,
  TERMS_2027,
  cohortSchedule,
  cohortSpan,
  cohortsFor,
  deadlinesFor,
  dollars,
  findCohort,
  formatDate,
  formatShortDate,
  isProgramId,
  isTermId,
  priceFor,
  termName,
} from "@/lib/cohorts-2027"
import { ENROLLMENT_DISCLAIMER, FOUNDING_INTEREST_OPTIONS, GRADES_2027, inquiryReceivedMessage } from "@/lib/enrollment-2027"
import { inquiryName, resolveSelection, selectionLabel } from "@/lib/enrollment-2027-inquiry"

type InquiryData = {
  parentName: string
  email: string
  phone: string
  studentName: string
  studentGrade: string
  program: string
  term: string
  cohortId: string
  foundingInterest: string
  message: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCATION = "enrollment-2027"

const PROGRAM_DETAIL: Record<string, string> = {
  SHSAT: "Specialized High School Admissions Test",
  "Digital SAT": "College admissions test preparation",
}

export type Enrollment2027Preset = { program?: string; term?: string; cohortId?: string }

/** Turns ?program=&term=&cohort= into a consistent preset; anything that doesn't match the catalog is dropped. */
export function presetFrom(input: Enrollment2027Preset): Pick<InquiryData, "program" | "term" | "cohortId"> {
  const cohort = input.cohortId ? findCohort(input.cohortId) : undefined
  if (cohort) return { program: cohort.program, term: cohort.term, cohortId: cohort.id }
  const program = input.program && isProgramId(input.program) ? input.program : ""
  const term = program && input.term && isTermId(input.term) ? input.term : ""
  return { program, term, cohortId: "" }
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
  if (!d.term) errors.term = "Please choose a term."
  if (!d.cohortId) errors.cohortId = "Please choose a cohort."
  else if (!resolveSelection(d)) errors.cohortId = "Please choose a cohort for this program and term."
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
  columns = "sm:grid-cols-2",
}: {
  name: keyof InquiryData
  legend: string
  options: { value: string; title: string; detail?: string; lines?: string[] }[]
  value: string
  onChange: (value: string) => void
  error?: string
  columns?: string
}) {
  const errorId = `${LOCATION}-${name}-error`
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-semibold text-ink">
        {legend} <span aria-hidden="true" className="text-error">*</span>
        <span className="sr-only">(required)</span>
      </legend>
      <div className={`mt-2 grid gap-3 ${columns}`}>
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
              {o.lines?.map((line) => (
                <span key={line} className="text-sm leading-relaxed text-subtle">
                  {line}
                </span>
              ))}
            </span>
          </label>
        ))}
      </div>
      {error && <p id={errorId} className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </fieldset>
  )
}

function Placeholder({ label, text, error }: { label: string; text: string; error?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">
        {label} <span aria-hidden="true" className="text-error">*</span>
        <span className="sr-only">(required)</span>
      </p>
      <p className="mt-2 border border-dashed border-line px-4 py-3 text-sm text-subtle">{text}</p>
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  )
}

export function Enrollment2027Form({ preset = {} }: { preset?: Enrollment2027Preset }) {
  const [submitted, setSubmitted] = useState<InquiryData | null>(null)
  const { data, errors, status, serverResult, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/enrollment-2027",
    initial: {
      parentName: "",
      email: "",
      phone: "",
      studentName: "",
      studentGrade: "",
      ...presetFrom(preset),
      foundingInterest: "",
      message: "",
    },
    validate,
    onSuccess: (sent) => {
      setSubmitted(sent)
      trackEvent(EVENTS.enrollment2027Lead, {
        location: LOCATION,
        program: sent.program,
        term: sent.term,
        cohort: sent.cohortId,
        lead_stage: "inquiry_submit",
      })
    },
  })

  const field = (key: keyof InquiryData) => ({
    id: `${LOCATION}-${key}`,
    name: key,
    value: data[key],
    error: errors[key],
    onChange: (v: string) => update(key, v),
  })

  const cohorts = data.program && data.term ? cohortsFor(data.program, data.term) : []
  const chosen = findCohort(data.cohortId)

  if (status === "success" && submitted) {
    const selection = resolveSelection(submitted)
    const received = inquiryReceivedMessage(
      serverResult,
      submitted.parentName,
      submitted.email,
      selection ? inquiryName(selection) : undefined,
    )
    return (
      <div role="status" className="border-t-4 border-gold pt-5">
        <p className="eyebrow blue">Inquiry received</p>
        <p className="mt-3 text-pretty text-lg font-extrabold leading-snug text-navy">{received.text}</p>
        {!received.confirmed && (
          <p className="mt-3 text-sm leading-relaxed text-navy">
            Your inquiry is saved, so please don&apos;t submit it again. If you need confirmation, contact AhmedPrep at{" "}
            <a href={BUSINESS.phoneHref} className="font-semibold underline">
              {BUSINESS.phoneDisplay}
            </a>{" "}
            or{" "}
            <a href={`mailto:${BUSINESS.email}`} className="font-semibold underline">
              {BUSINESS.email}
            </a>
            .
          </p>
        )}
        <dl className="mt-4 flex flex-col gap-2 border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm text-navy">
          {(
            [
              ["Student", `${submitted.studentName} (${submitted.studentGrade})`],
              ["Cohort", selection ? selectionLabel(selection) : submitted.cohortId],
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

  const chosenPrice = chosen ? priceFor(chosen) : null
  const chosenDeadlines = chosen ? deadlinesFor(chosen) : null

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
          update("cohortId", "")
        }}
        options={PROGRAMS_2027.map((p) => ({ value: p, title: p, detail: PROGRAM_DETAIL[p] }))}
      />

      {data.program ? (
        <ChoiceCards
          name="term"
          legend="Term"
          value={data.term}
          error={errors.term}
          columns="sm:grid-cols-3"
          onChange={(v) => {
            update("term", v)
            update("cohortId", "")
          }}
          options={TERMS_2027.map((t) => {
            const starts = cohortsFor(data.program, t.id).map((c) => c.firstIso).sort()
            return { value: t.id, title: t.name, detail: starts[0] ? `Starts ${formatShortDate(starts[0])}` : undefined }
          })}
        />
      ) : (
        <Placeholder label="Term" text="Choose a program above to see the Winter, Spring, and Summer 2027 terms." error={errors.term} />
      )}

      {cohorts.length > 0 ? (
        <ChoiceCards
          name="cohortId"
          legend={`${isTermId(data.term) ? termName(data.term) : ""} ${data.program} cohort`}
          value={data.cohortId}
          error={errors.cohortId}
          onChange={(v) => update("cohortId", v)}
          options={cohorts.map((c) => {
            const { startIso, endIso } = cohortSpan(c)
            return {
              value: c.id,
              title: c.label,
              detail: cohortSchedule(c),
              lines: [
                `${formatShortDate(startIso)} to ${formatShortDate(endIso)}`,
                `${c.sessions} sessions, ${c.hours} hours · ${dollars(priceFor(c).regular)} regular tuition`,
              ],
            }
          })}
        />
      ) : (
        <Placeholder
          label="Cohort"
          text={data.program ? "Choose a term above to see its cohorts." : "Choose a program and term to see the available cohorts."}
          error={errors.cohortId}
        />
      )}

      {chosen && chosenPrice && chosenDeadlines && (
        <div aria-live="polite" className="border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-navy">
          <p className="font-bold">Tuition for this cohort ({chosen.hours} hours at $20 per hour)</p>
          <ul className="mt-1 flex flex-col gap-1">
            <li>Regular: {dollars(chosenPrice.regular)}, paid in full before the first class.</li>
            <li>
              Early full payment: {dollars(chosenPrice.early)} (10% off) if paid in full by {formatDate(chosenDeadlines.earlyIso)}.
            </li>
            <li>
              Founding-family: {dollars(chosenPrice.founding)} (25% off) for the first 5 fully paid enrollments in this cohort, if paid in
              full by {formatDate(chosenDeadlines.foundingIso)}.
            </li>
            <li>Discounts cannot be combined.</li>
          </ul>
        </div>
      )}

      <SelectField
        label="Interested in Founding-Family Tuition?"
        required
        placeholder="Select an option"
        options={[...FOUNDING_INTEREST_OPTIONS]}
        hint="25% off for the first 5 fully paid enrollments in each cohort, while seats remain."
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
