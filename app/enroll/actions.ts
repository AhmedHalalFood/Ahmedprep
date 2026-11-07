"use server"

import { checkoutEligibility, type CheckoutEligibility } from "@/lib/enrollment-catalog"

/**
 * Verified, fully paid founding-family enrollments for a class. Payments are not live, so no paid enrollment exists
 * anywhere yet and the count is 0. When Stripe is approved, this must count only administrator-approved enrollments
 * whose full payment Stripe has verified — never browser input.
 */
async function fullyPaidFoundingCount(_classId: string): Promise<number> {
  return 0
}

/**
 * Server-side tuition eligibility for the checkout step. Uses the server's clock and server-side seat counts, so a
 * stale page, a changed device clock, or an edited request cannot unlock an expired discount. Takes no payment.
 */
export async function verifyCheckoutEligibility(classId: unknown, payment: unknown): Promise<CheckoutEligibility> {
  const id = typeof classId === "string" ? classId.slice(0, 64) : ""
  const option = typeof payment === "string" ? payment.slice(0, 32) : ""
  return checkoutEligibility({
    classId: id,
    payment: option,
    now: new Date(),
    fullyPaidFoundingCount: await fullyPaidFoundingCount(id),
  })
}
