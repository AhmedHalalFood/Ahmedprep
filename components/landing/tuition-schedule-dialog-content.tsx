"use client"

import { ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TuitionScheduleTable } from "@/components/landing/tuition-schedule-table"
import {
  HOURS_PER_CLASS,
  INTENSIVE_NAME,
  SCHEDULE_STATEMENT,
  TUITION_PER_CLASS,
  enrollmentSnapshot,
  formatClassDate,
  formatUsd,
  tuitionScheduleRows,
} from "@/lib/shsat-intensive"

export default function TuitionScheduleDialogContent({
  open,
  onOpenChange,
  onEnroll,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnroll: (startDate: string | null) => void
}) {
  const snapshot = enrollmentSnapshot()
  const rows = tuitionScheduleRows(snapshot.remainingDates)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-none border-t-4 border-t-gold bg-white p-5 text-navy sm:max-w-xl sm:p-6">
        <DialogHeader className="text-left">
          <p className="eyebrow blue">Tuition schedule</p>
          <DialogTitle className="text-balance text-2xl font-extrabold tracking-tight text-navy">{INTENSIVE_NAME}</DialogTitle>
          <DialogDescription className="text-pretty font-semibold leading-relaxed text-navy">{SCHEDULE_STATEMENT}</DialogDescription>
        </DialogHeader>

        {snapshot.nextClass ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-l-4 border-gold bg-cream px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Enroll today</p>
              <p className="text-pretty text-lg font-extrabold leading-snug text-navy">
                {`First class ${formatClassDate(snapshot.nextClass, "long")} \u00b7 ${snapshot.classes} classes \u00b7 ${snapshot.hours} hours \u00b7 ${formatUsd(snapshot.tuition)}`}
              </p>
            </div>

            <TuitionScheduleTable rows={rows} caption={`${INTENSIVE_NAME} prorated tuition by first class date`} />

            <p className="text-pretty text-sm leading-relaxed text-subtle">
              {`${formatUsd(TUITION_PER_CLASS)} per ${HOURS_PER_CLASS}-hour class, counted from the first class your child attends through November 12. Classes already held are not charged.`}
            </p>

            <button
              type="button"
              onClick={() => onEnroll(snapshot.nextClass)}
              className="button button-gold button-lg w-full justify-center uppercase"
            >
              Enroll Now <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="leading-relaxed text-subtle">All scheduled classes have been held. Call us to ask about upcoming programs.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
