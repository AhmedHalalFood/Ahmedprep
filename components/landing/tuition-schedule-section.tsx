import { ArrowRight } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TuitionScheduleTable } from "@/components/landing/tuition-schedule-table"
import {
  INTENSIVE_NAME,
  SCHEDULE_STATEMENT,
  TUITION_SCHEDULE_ID,
  tuitionScheduleRows,
  type EnrollmentSnapshot,
} from "@/lib/shsat-intensive"

/** Inline version of the tuition schedule for the Intensive page, built from the same server snapshot as the rest of the page. */
export function TuitionScheduleSection({ snapshot }: { snapshot: EnrollmentSnapshot }) {
  if (!snapshot.nextClass) return null
  const rows = tuitionScheduleRows(snapshot.remainingDates)
  return (
    <div id={TUITION_SCHEDULE_ID} className="flex scroll-mt-4 flex-col gap-4 border border-white/20 bg-white/5 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-extrabold tracking-tight text-white">Tuition Schedule</h4>
        <p className="text-pretty text-sm font-semibold leading-relaxed text-white/85">{SCHEDULE_STATEMENT}</p>
      </div>
      <TuitionScheduleTable rows={rows} tone="dark" caption={`${INTENSIVE_NAME} prorated tuition by first class date`} />
      <ReserveSeatDialog
        location="intensive_tuition_schedule"
        initialStartDate={snapshot.nextClass}
        trigger={
          <button type="button" className="button button-gold button-lg w-full justify-center uppercase sm:w-auto sm:self-start">
            Enroll Now <ArrowRight size={17} aria-hidden="true" />
          </button>
        }
      />
    </div>
  )
}
