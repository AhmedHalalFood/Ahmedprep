"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Table2 } from "lucide-react"
import { EVENTS, trackEvent } from "@/lib/analytics"

const loadSchedule = () => import("@/components/landing/tuition-schedule-dialog-content")
const loadEnroll = () => import("@/components/landing/reserve-seat-dialog-content")
const TuitionScheduleDialogContent = dynamic(loadSchedule, { ssr: false })
const ReserveSeatDialogContent = dynamic(loadEnroll, { ssr: false })

/** Opens the full prorated tuition table. No form or personal information needed to see prices. */
export function TuitionScheduleButton({ location, className }: { location: string; className: string }) {
  const [scheduleMounted, setScheduleMounted] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [enroll, setEnroll] = useState<{ open: boolean; startDate: string | null } | null>(null)

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={scheduleOpen}
        onPointerEnter={() => void loadSchedule()}
        onFocus={() => void loadSchedule()}
        onClick={() => {
          setScheduleMounted(true)
          setScheduleOpen(true)
          trackEvent(EVENTS.shsatIntensiveClick, { location, lead_stage: "tuition_schedule_view" })
        }}
        className={className}
      >
        <Table2 size={16} aria-hidden="true" />
        View Tuition Schedule
      </button>
      {scheduleMounted && (
        <TuitionScheduleDialogContent
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          onEnroll={(startDate) => {
            setScheduleOpen(false)
            setEnroll({ open: true, startDate })
            trackEvent(EVENTS.shsatIntensiveLead, { location: `${location}_tuition_schedule`, lead_stage: "reserve_click" })
          }}
        />
      )}
      {enroll && (
        <ReserveSeatDialogContent
          open={enroll.open}
          onOpenChange={(open) => setEnroll((current) => (current ? { ...current, open } : current))}
          initialStartDate={enroll.startDate}
        />
      )}
    </>
  )
}
