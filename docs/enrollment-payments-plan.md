# AhmedPrep Enrollment Payments: Future Stripe Integration Plan

Status: **PROPOSAL ONLY.** Nothing in this document is implemented. No Stripe products, prices,
payment links, checkout sessions, subscriptions, or webhooks exist. No database tables have been created.

## 1. Principles

- **Stripe-hosted Checkout only.** Card details are entered on Stripe's page and never touch AhmedPrep's servers or database.
- **The server owns every price.** The browser sends only `classId` and `paymentOption`. The server looks up the amount in
  `lib/enrollment-catalog.ts` (or a future `classes` table) and ignores any amount sent by the browser.
- **The webhook is the only source of truth.** Redirecting to the success page never confirms anything. Enrollment is
  confirmed only by a signature-verified `checkout.session.completed` (with `payment_status = "paid"`) or
  `checkout.session.async_payment_succeeded` event.
- **Cohorts are data, not code.** A new cohort (e.g. summer 2027) means adding rows for the cohort and its classes. The
  checkout code stays the same.

## 2. Proposed data model (requires a separate, approved migration)

| Table | Key columns |
|---|---|
| `cohorts` | `id`, `name`, `dates_status`, `enrollment_open` |
| `classes` | `id`, `cohort_id`, `program_id`, `label`, `schedule`, `capacity` (10), `founding_seats` (5), `founding_deadline` |
| `enrollments` | `id`, `class_id`, `student_name`, `grade`, `parent_name`, `parent_email`, `phone`, `status`, `payment_option`, `amount_cents`, `founding_claim`, `stripe_checkout_session_id`, `stripe_customer_id`, `expires_at`, timestamps |
| `stripe_events` | `event_id` (primary key), `type`, `received_at`, used to process each webhook event only once |

`enrollments.status` moves through: `pending_payment` → `paid` → `confirmed`, or `pending_payment` → `expired` / `failed` / `canceled`.
Card numbers, CVCs, and bank details are never stored. Only Stripe IDs are.

## 3. Checkout flow

1. The parent submits the form. A server action validates the input with zod and checks that the class is open and that
   the payment option is allowed (for example, founding tuition only before the deadline).
2. **Seat hold, inside one database transaction:**
   - `SELECT ... FROM classes WHERE id = $1 FOR UPDATE`, which locks the class row so two checkouts can't run at once.
   - Count enrollments in `pending_payment` (not yet expired) plus `paid` and `confirmed`. Reject if the class is full.
   - For founding tuition, count active founding claims the same way and reject if 5 or more. A partial unique index or
     check can enforce this as a second safeguard.
   - Insert the `pending_payment` enrollment with `expires_at = now() + 30 minutes`.
3. Create the Stripe Checkout Session with the **server-computed** `unit_amount`, `metadata.enrollment_id`,
   `expires_at`, and an idempotency key of `enrollment:<id>`. Then redirect to Stripe.
4. The success page shows "Payment processing: we'll email you once it's confirmed" until the webhook arrives.

## 4. Webhook handling (`/api/stripe/webhook`)

- Verify the signature with `stripe.webhooks.constructEvent` using the raw request body and `STRIPE_WEBHOOK_SECRET`.
- Insert `event.id` into `stripe_events`. If it already exists, return 200 and stop, so each event is handled once.
- `checkout.session.completed` with `paid`: mark the enrollment `paid`, then `confirmed`, and send the receipt and confirmation.
- `checkout.session.async_payment_failed`: mark it `failed` and release the seat and any founding claim.
- `checkout.session.expired`: mark it `expired` and release the hold.
- A scheduled cleanup job expires any leftover `pending_payment` rows past `expires_at`, in case a webhook is missed.

## 5. Founding-family rules enforced on the server

- Founding tuition is full payment only, `$1,080`, for the first 5 qualifying **fully paid** students per class.
- The deadline (`2026-11-30 23:59:59 America/New_York`) is checked when the session is created **and** again in the
  webhook. A payment completed after the deadline on a session started before it follows a written policy that needs approval.
- A hold counts toward the 5 seats only while it is unexpired. Abandoned checkouts free the seat when they expire.
- An inquiry (`lead_submissions`) never creates a claim.

## 6. Installments (regular tuition only, $480 × 3)

Disabled until the payment terms are approved. Once they are, the likely approach is a Stripe Subscription Schedule
with three phases, or three invoices with set due dates. The policy for failed installments (retries, notices, effect on
class access) must be written and approved before this is turned on.

## 7. Receipts and confirmations

- Stripe sends its own payment receipt (enable it in Stripe settings).
- AhmedPrep sends a separate enrollment confirmation through the existing Resend setup **only after the webhook confirms
  payment**, with the class, planned start date, and next steps.

## 8. Rollout (each step needs explicit approval)

1. Approve the payment terms, refund policy, and founding deadline policy.
2. Connect the Stripe integration in **test mode** and add the migration for section 2 on the Development branch only.
3. Build the checkout server action and webhook, then test with Stripe test cards and the Stripe CLI, including
   simultaneous founding checkouts.
4. Review, then switch to live keys and apply the migration to Production.
