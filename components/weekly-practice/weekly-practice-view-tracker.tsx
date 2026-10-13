"use client"

import { useEffect } from "react"
import { EVENTS, trackEvent } from "@/lib/analytics"

export function WeeklyPracticeViewTracker({ testType, week }: { testType: string; week: string }) {
  useEffect(() => {
    trackEvent(EVENTS.weeklyPracticeView, { test_type: testType, week })
  }, [testType, week])
  return null
}
