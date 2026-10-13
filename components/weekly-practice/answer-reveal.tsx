"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { EVENTS, trackEvent } from "@/lib/analytics"

type Props = {
  label?: string
  trackingProps: { location: string; test_type: string; week: string }
  children: ReactNode
}

/** Answer stays in the HTML for crawlers; it is hidden until the student chooses to reveal it. */
export function AnswerReveal({ label = "Show Answer & Explanation", trackingProps, children }: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const toggle = () => {
    if (!open) trackEvent(EVENTS.weeklyPracticeAnswerClick, trackingProps)
    setOpen(!open)
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="button button-outline self-start"
      >
        {open ? "Hide Answer" : label}
        <ChevronDown size={16} aria-hidden="true" className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </div>
  )
}
