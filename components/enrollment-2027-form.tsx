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
  dollars,
  findCohort,
  formatShortDate,
  isProgramId,
  isTermId,
  priceFor,
  termStartLabel,
  tuitionOptionsFor,
} from "@/lib/cohorts-2027"
import { WAITLIST_DISCLAIMER } from "@/lib/cohort-capacity"
import { ENROLLMENT_ACTIONS, ENROLLMENT_DISCLAIMER, FOUNDING_INTEREST_OPTIONS, GRADES_2027, inquiryReceivedMessage } from "@/lib/enrollment-2027"
import { foundingQuestionApplies, inquiryName, resolveSelection, selectionLabel } from "@/lib/enrollment-2027-inquiry"

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
  intent: string
  previewFull: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCATION = "enrollment-2027"

const PROGRAM_DETAIL: Record<string, string> = {
  SHSAT: "Specialized High School Admissions Test",
  "Digital SAT": "College admissions test preparation",
}

export type Enrollment2027Preset = { program?: string; term?: string; cohortId?: string; waitlist?: boolean; previewFull?: boolean }

/** Turns ?program=&term=&cohort= into a consistent preset; anything that doesn't match the catalog is dropped. */
export function presetFrom(input: Enrollment2027Preset): Pick<InquiryData, "program" | "term" | "cohortId"> {
  const cohort = input.cohortId ? findCohort(input.cohortId) : undefined
  if (cohort) return { program: cohort.program, term: cohort.term, cohortId: cohort.id }
  const program = input.program && isProgramId(input.program) ? input.program : ""
  const term = input.term && isTermId(input.term) ? input.term : ""
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
  if (!d.term) errors.term = "Please choose when your child would like to start."
  if (!d.program) errors.program = "Please choose SHSAT or Digital SAT."
  if (!d.cohortId) errors.cohortId = "Please choose a schedule."
  else if (!resolveSelection(d)) errors.cohortId = "Please choose a schedule for this program and start date."
  if (isTermId(d.term) && foundingQuestionApplies(d.term) && !d.foundingInterest) errors.foundingInterest = "Please let us know about founding-family tuition."
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
  options: { value: string; title: string; detail?: string; lines?: string[]; tone?: "shsat" | "dsat" }[]
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
            className={`flex min-h-14 cursor-pointer items-start gap-3 border-2 border-line bg-white px-4 py-3 text-navy transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy/30 ${
              o.tone === "dsat"
                ? "has-[:checked]:border-sage has-[:checked]:bg-sage-soft"
                : "has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-invalid={Boolean(error)}
              className={`mt-1 h-4 w-4 shrink-0 ${o.tone === "dsat" ? "accent-[var(--sage)]" : "accent-[var(--blue)]"}`}
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

/**
 * `selectionShownAbove`: the page already shows the selected class (with a "Change class" link) right above the form,
 * so the form skips its own selected-class and tuition boxes instead of repeating them.
 */
export function Enrollment2027Form({ preset = {}, selectionShownAbove = false }: { preset?: Enrollment2027Preset; selectionShownAbove?: boolean }) {
  const [submitted, setSubmitted] = useState<InquiryData | null>(null)
  const initialSelection = presetFrom(preset)
  // Waitlist mode needs an exact cohort; the server separately confirms that cohort is full before accepting it.
  const waitlist = Boolean(preset.waitlist && initialSelection.cohortId)
  const [changingSelection, setChangingSelection] = useState(!initialSelection.cohortId)
  const { data, errors, status, serverResult, update, submit, formRef, honeypotRef } = useLeadForm({
    endpoint: "/api/enrollment-2027",
    initial: {
      parentName: "",
      email: "",
      phone: "",
      studentName: "",
      studentGrade: "",
      ...initialSelection,
      foundingInterest: "",
      message: "",
      intent: waitlist ? "waitlist" : "inquiry",
      previewFull: waitlist && preset.previewFull ? "1" : "",
    },
    validate,
    onSuccess: (sent) => {
      setSubmitted(sent)
      trackEvent(EVENTS.enrollment2027Lead, {
        location: LOCATION,
        program: sent.program,
        term: sent.term,
        cohort: sent.cohortId,
        lead_stage: sent.intent === "waitlist" ? "waitlist_submit" : "inquiry_submit",
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
    const sentWaitlist = submitted.intent === "waitlist"
    const received = inquiryReceivedMessage(
      serverResult,
      submitted.parentName,
      submitted.email,
      selection ? (sentWaitlist ? `${selectionLabel(selection)} waitlist` : inquiryName(selection)) : undefined,
    )
    const summary: [string, string][] = [
      ["Student", `${submitted.studentName} (${submitted.studentGrade})`],
      ["Cohort", selection ? selectionLabel(selection) : submitted.cohortId],
    ]
    if (submitted.foundingInterest) summary.push(["Founding-family tuition", submitted.foundingInterest])
    return (
      <div role="status" className="border-t-4 border-gold pt-5">
        <p className="eyebrow blue">{sentWaitlist ? "Waitlist request received" : "Inquiry received"}</p>
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
          {summary.map(([term, value]) => (
            <div key={term} className="flex flex-col">
              <dt className="font-bold">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-subtle">{sentWaitlist ? WAITLIST_DISCLAIMER : ENROLLMENT_DISCLAIMER}</p>
      </div>
    )
  }

  const tuitionOptions = chosen ? tuitionOptionsFor(chosen) : []
  const askFounding = isTermId(data.term) && foundingQuestionApplies(data.term)
  const isWaitlist = data.intent === "waitlist"

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

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-base font-extrabold text-navy">Parent or guardian</legend>
        <TextField label="Parent/Guardian Name" autoComplete="name" required {...field("parentName")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Email Address" type="email" inputMode="email" autoComplete="email" required {...field("email")} />
          <TextField label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" required {...field("phone")} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-line pt-6">
        <legend className="mb-3 float-left w-full text-base font-extrabold text-navy">Student</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Student Name" autoComplete="off" required {...field("studentName")} />
          <SelectField label="Current Grade" required placeholder="Select grade" options={GRADES_2027} {...field("studentGrade")} />
        </div>
      </fieldset>

      {chosen && !changingSelection && selectionShownAbove ? null : chosen && !changingSelection ? (
        <section aria-labelledby={`${LOCATION}-selected-title`} className="flex flex-col gap-3 rounded-2xl border-2 border-brand bg-brand-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 id={`${LOCATION}-selected-title`} className="text-xs font-bold uppercase tracking-widest text-subtle">
              Your selected class
            </h3>
            <p className="font-extrabold text-navy">
              {chosen.program} · {chosen.label} · {termStartLabel(chosen.term)}
            </p>
            <p className="text-sm text-ink">{cohortSchedule(chosen)}</p>
            <p className="text-sm text-subtle">
              {formatShortDate(cohortSpan(chosen).startIso)} to {formatShortDate(cohortSpan(chosen).endIso)} · {chosen.hours} hours
            </p>
          </div>
          <button
            type="button"
            onClick={() => setChangingSelection(true)}
            className="inline-flex min-h-11 items-center justify-center self-start rounded-full border-2 border-navy bg-paper px-4 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper sm:self-center"
          >
            Change class
          </button>
        </section>
      ) : (
      <>
      <ChoiceCards
        name="term"
        legend="When would you like to start?"
        value={data.term}
        error={errors.term}
        columns="sm:grid-cols-3"
        onChange={(v) => {
          update("term", v)
          update("cohortId", "")
          if (!(isTermId(v) && foundingQuestionApplies(v))) update("foundingInterest", "")
        }}
        options={TERMS_2027.map((t) => {
          const starts = (data.program ? cohortsFor(data.program, t.id) : t.cohorts).map((c) => c.firstIso).sort()
          return { value: t.id, title: termStartLabel(t.id), detail: starts[0] ? `First class ${formatShortDate(starts[0])}` : undefined }
        })}
      />

      {data.term ? (
        <ChoiceCards
          name="program"
          legend="SHSAT or Digital SAT?"
          value={data.program}
          error={errors.program}
          onChange={(v) => {
            update("program", v)
            update("cohortId", "")
          }}
          options={PROGRAMS_2027.map((p) => ({ value: p, title: p, detail: PROGRAM_DETAIL[p], tone: p === "SHSAT" ? "shsat" : "dsat" }))}
        />
      ) : (
        <Placeholder label="Program" text="Choose when to start above, then SHSAT or Digital SAT." error={errors.program} />
      )}

      {cohorts.length > 0 ? (
        <ChoiceCards
          name="cohortId"
          legend={`${data.program} schedule: ${cohorts.map((c) => c.label).join(" or ")}`}
          value={data.cohortId}
          error={errors.cohortId}
          onChange={(v) => update("cohortId", v)}
          options={cohorts.map((c) => {
            const { startIso, endIso } = cohortSpan(c)
            return {
              value: c.id,
              title: c.label,
              tone: c.program === "SHSAT" ? ("shsat" as const) : ("dsat" as const),
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
          label="Schedule"
          text="Choose a start date and program above to see the weekday and weekend schedules."
          error={errors.cohortId}
        />
      )}
      </>
      )}

      {chosen && !(selectionShownAbove && !changingSelection) && (
        <div aria-live="polite" className="border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-navy">
          <p className="font-bold">Tuition for this cohort ({chosen.hours} hours at $20 per hour)</p>
          <ul className="mt-1 flex flex-col gap-1">
            {tuitionOptions.map((option) => (
              <li key={option.id}>
                {option.label}: {dollars(option.amount)}, {option.condition.charAt(0).toLowerCase() + option.condition.slice(1)}
              </li>
            ))}
            <li>Discounts cannot be combined.</li>
          </ul>
        </div>
      )}

      {askFounding && (
        <SelectField
          label="Interested in Founding-Family Tuition?"
          required
          placeholder="Select an option"
          options={[...FOUNDING_INTEREST_OPTIONS]}
          hint="Winter 2027 only: 25% off for the first 5 fully paid enrollments in each cohort, while seats remain."
          {...field("foundingInterest")}
        />
      )}

      <TextAreaField
        label="Comments"
        placeholder="Questions, goals, or anything we should know about your child."
        {...field("message")}
      />

      <p className="border-l-4 border-gold bg-cream px-4 py-3 text-sm leading-relaxed text-navy">
        {isWaitlist ? WAITLIST_DISCLAIMER : ENROLLMENT_DISCLAIMER}
      </p>

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
        {isWaitlist ? ENROLLMENT_ACTIONS.waitlist : ENROLLMENT_ACTIONS.request} <ArrowRight size={17} aria-hidden="true" />
      </SubmitButton>
    </form>
  )
}
