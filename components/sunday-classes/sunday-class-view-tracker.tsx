"use client"

import { useEffect } from "react"
import { EVENTS, trackEvent } from "@/lib/analytics"

export function SundayClassViewTracker({ classType, classDate }: { classType: string; classDate: string }) {
  useEffect(() => {
    trackEvent(EVENTS.sundayClassView, { class_type: classType, class_date: classDate })
  }, [classType, classDate])
  return null
}
