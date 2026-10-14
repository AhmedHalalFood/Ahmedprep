"use client"

import { useEffect } from "react"
import { EVENTS, trackEvent } from "@/lib/analytics"

export function PracticeLibraryViewTracker() {
  useEffect(() => {
    trackEvent(EVENTS.practiceLibraryView, { page: "shsat_practice_tests" })
  }, [])
  return null
}
