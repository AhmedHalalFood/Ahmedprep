"use client"

import { cloneElement, isValidElement, useState, type MouseEvent, type ReactElement } from "react"
import dynamic from "next/dynamic"
import { ArrowRight } from "lucide-react"
import { EVENTS, trackEvent } from "@/lib/analytics"

// Radix Dialog + the enrollment form are only needed once someone asks for them,
// so they load on first intent instead of shipping in every page's initial bundle.
const loadContent = () => import("@/components/landing/reserve-seat-dialog-content")
const ReserveSeatDialogContent = dynamic(loadContent, { ssr: false })

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onPointerEnter?: () => void
  onFocus?: () => void
  "aria-haspopup"?: "dialog"
  "aria-expanded"?: boolean
}

export function ReserveSeatDialog({
  trigger,
  location = "shsat_intensive_reserve",
  initialStartDate,
}: {
  trigger?: ReactElement<TriggerProps>
  location?: string
  initialStartDate?: string | null
}) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  const triggerElement =
    trigger && isValidElement(trigger) ? (
      trigger
    ) : (
      <button type="button" className="button button-gold button-lg uppercase">
        Enroll in SHSAT Intensive <ArrowRight size={17} aria-hidden="true" />
      </button>
    )

  const triggerWithHandlers = cloneElement(triggerElement, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onPointerEnter: () => void loadContent(),
    onFocus: () => void loadContent(),
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerElement.props.onClick?.(event)
      setMounted(true)
      setOpen(true)
      trackEvent(EVENTS.shsatIntensiveLead, { location, lead_stage: "reserve_click" })
    },
  })

  return (
    <>
      {triggerWithHandlers}
      {mounted && <ReserveSeatDialogContent open={open} onOpenChange={setOpen} initialStartDate={initialStartDate} />}
    </>
  )
}
