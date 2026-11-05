"use client"

import { useEffect, useRef, useState } from "react"
import { CLASSES, PROGRAMS, type PaymentOption, type ProgramId } from "@/lib/enrollment-catalog"
import { StepProgress, STEP_TITLES } from "./step-progress"
import { ProgramStep, ClassStep } from "./choice-steps"
import { FamilyStep, EMPTY_FAMILY, validateFamily, type FamilyInfo, type FamilyErrors } from "./family-step"
import { TuitionStep } from "./tuition-step"
import { CheckoutPreview } from "./checkout-preview"

export function EnrollmentFlow() {
  const [step, setStep] = useState(0)
  const [programId, setProgramId] = useState<ProgramId | null>(null)
  const [classId, setClassId] = useState<string | null>(null)
  const [family, setFamily] = useState<FamilyInfo>(EMPTY_FAMILY)
  const [familyErrors, setFamilyErrors] = useState<FamilyErrors>({})
  const [payment, setPayment] = useState<PaymentOption | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const program = PROGRAMS.find((p) => p.id === programId) ?? null
  const offering = CLASSES.find((c) => c.id === classId) ?? null

  const goTo = (next: number) => {
    setStepError(null)
    setStep(next)
  }

  const handleNext = () => {
    if (step === 0 && !programId) return setStepError("Please choose a program to continue.")
    if (step === 1 && !classId) return setStepError("Please choose a class schedule to continue.")
    if (step === 2) {
      const errors = validateFamily(family)
      setFamilyErrors(errors)
      if (Object.keys(errors).length > 0) return setStepError("Please fix the highlighted fields.")
    }
    if (step === 3 && !payment) return setStepError("Please choose a tuition option to continue.")
    goTo(step + 1)
  }

  const chooseProgram = (id: ProgramId) => {
    if (id !== programId) setClassId(null)
    setProgramId(id)
    setStepError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <StepProgress current={step} onJump={(i) => i < step && goTo(i)} />

      <div className="flex flex-col gap-5 border border-line bg-white p-4 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{`Step ${step + 1} of ${STEP_TITLES.length}`}</p>
          <h2 ref={headingRef} tabIndex={-1} className="text-balance text-2xl font-extrabold tracking-tight text-navy outline-none">
            {STEP_TITLES[step]}
          </h2>
        </div>

        {step === 0 && <ProgramStep value={programId} onChange={chooseProgram} />}
        {step === 1 && programId && (
          <ClassStep
            programId={programId}
            value={classId}
            onChange={(id) => {
              setClassId(id)
              setStepError(null)
            }}
          />
        )}
        {step === 2 && (
          <FamilyStep
            value={family}
            errors={familyErrors}
            onChange={(next) => {
              setFamily(next)
              if (Object.keys(familyErrors).length > 0) setFamilyErrors(validateFamily(next))
            }}
          />
        )}
        {step === 3 && (
          <TuitionStep
            value={payment}
            onChange={(p) => {
              setPayment(p)
              setStepError(null)
            }}
          />
        )}
        {step === 4 && program && offering && payment && (
          <CheckoutPreview program={program} offering={offering} family={family} payment={payment} onEdit={goTo} />
        )}

        {stepError && (
          <p role="alert" className="border-l-4 border-error bg-error-soft px-3 py-2 text-sm font-semibold text-error">
            {stepError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="min-h-12 border border-line px-5 text-sm font-bold text-navy hover:border-navy"
            >
              Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < STEP_TITLES.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="min-h-12 bg-navy px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-academic"
            >
              {step === 3 ? "Review enrollment" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
