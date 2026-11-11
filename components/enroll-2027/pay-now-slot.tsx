import type { Cohort } from "@/lib/cohorts-2027"
import { ENROLLMENT_ACTIONS } from "@/lib/enrollment-2027"

/**
 * Reserved place for the future "Enroll & Pay Now" action (full online tuition payment with eligible founding-family
 * and early-payment discounts). It renders nothing until ENROLLMENT_ACTIONS.onlinePaymentsEnabled is approved and a
 * payment route exists, so no payment link, charge, or seat-reservation claim is ever shown in Phase 1.
 */
export function PayNowSlot({ cohort, full }: { cohort: Cohort; full: boolean }) {
  if (!ENROLLMENT_ACTIONS.onlinePaymentsEnabled || full) return null
  // Phase 2: render the approved checkout action for `cohort.id` here.
  void cohort
  return null
}
