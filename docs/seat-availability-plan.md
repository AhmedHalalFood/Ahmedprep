# January 2027 Automated Seat Availability: Phase 1 plan

Status: **proposal for approval**. Nothing in this document has been applied. No tables, migrations,
forms, payment processing, environment variables or Production settings have been changed.

Visual preview: `/enroll/seats-preview` on the `v0/january-2027-enrollment` Preview branch. It uses
demonstration values only and is excluded from search engines.

## 1. Business rules

| Rule | Enforcement |
|---|---|
| 4 Astoria groups, 12 seats each | `capacity` column + check inside the approval transaction |
| A seat counts only when an admin approves **and** full payment is verified | Only `status = 'confirmed'` rows are counted |
| Inquiries never reduce availability | Inquiries stay in `lead_submissions`; they are never counted |
| Founding-family: max 5 per group, ends Dec 5, 2026 (whichever comes first) | Checked on the server at approval time, under a row lock |
| $1,296 early full payment if paid in full by Dec 26, 2026 | Tier assigned by the server from the verified payment date |
| $1,440 regular tuition due Jan 5, 2027 | Default tier |
| Discounts do not stack | One `tuition_tier` per enrollment; amount is looked up from the tier, never typed in |
| Full group → waitlist | Waitlist entries in order; never counted as seats |

## 2. Proposed Neon changes (migration 0005, additive only)

No existing table, column or row is altered or removed. The new migration would:

- **`class_groups`**: `id` (e.g. `2027-01-shsat-weekday`), `cohort`, `program`, `label`, `schedule`,
  `capacity` (default 12, `CHECK capacity > 0`), `founding_limit` (default 5), `enrollment_open`.
- **`enrollments`**: `id`, `group_id` → `class_groups`, `student_name`, `student_grade`, `parent_name`,
  `parent_email`, `parent_phone`, normalised `student_key` (lower-cased name + parent email),
  `status` (`pending_payment`, `payment_verified`, `confirmed`, `cancelled`, `refunded`),
  `tuition_tier` (`founding`, `early`, `regular`), `amount_cents` (set by the server),
  `payment_reference`, `payment_verified_at`, `payment_verified_by`, `approved_at`, `approved_by`,
  optional `lead_submission_id` → `lead_submissions` (link back to the original inquiry).
- **`waitlist_entries`**: `id`, `group_id`, family contact fields, `position`, `status`
  (`waiting`, `offered`, `enrolled`, `withdrawn`), `offer_expires_at`.
- **Constraints**
  - Partial unique index on `(group_id, student_key)` where status is not `cancelled`/`refunded`:
    prevents duplicate registrations for the same student in the same group.
  - Partial unique index on `(group_id, student_key)` for active waitlist entries.
  - `CHECK (amount_cents IN (108000, 129600, 144000))` tied to `tuition_tier`.
- **View `group_seat_availability`**: per group, `capacity − count(confirmed)` and
  `founding_limit − count(confirmed founding)`, clamped at 0. It exposes counts only, never names
  or contact details.

As with 0004, it would run first on the Development branch `br-muddy-lake-b8lz1pwy` in one transaction,
with before/after checks that all existing Sunday registrations and lead submissions are unchanged.
Production would follow only after separate approval.

## 3. Administrator workflow

1. **Inquiry arrives** (`lead_submissions`). No seat changes.
2. **Admin creates a pending enrollment** from the inquiry and picks a group. The duplicate index
   rejects a second active enrollment for the same student in that group.
3. **Admin verifies full payment** against the payment record and enters the reference. The server
   records who verified it and when.
4. **Admin approves.** In a single transaction the server:
   - locks the group row (`SELECT … FOR UPDATE`) so two simultaneous approvals cannot both take the
     last seat;
   - re-counts confirmed seats and rejects the approval if the group is full (offering the waitlist instead);
   - assigns the tuition tier: founding only if before Dec 5, 2026 **and** fewer than 5 founding
     seats are confirmed; otherwise early if paid in full by Dec 26, 2026; otherwise regular;
   - sets `status = 'confirmed'` and writes an `admin_audit_log` entry.
5. **Cancellation or refund** frees the seat; the next waitlist family can be offered it.

The admin pages would sit behind real sign-in (Neon Auth is already provisioned for this project)
with an allow-list of admin emails, replacing reliance on a shared secret for these actions. All
admin writes go through server actions with input validation and parameterised queries.

## 4. How the website gets accurate counts

- The public page reads `group_seat_availability` on the server through a read-only query.
  No personal data ever reaches the browser.
- The result is cached and tagged (`seat-availability`). Every approval, cancellation or refund
  refreshes that tag, so the public page updates immediately after an admin action.
- If the database cannot be reached, the page shows "Call or text for current availability"
  instead of a stale or guessed number.
- The public "Request a seat" button only submits an inquiry; it can never reserve or consume a seat.

## 5. Security protections

- Counting and pricing happen only on the server; nothing the browser sends can set a price or a seat.
- Row lock + capacity re-check in one transaction prevents overbooking.
- Unique indexes prevent duplicate registrations.
- Admin-only actions require sign-in and an admin allow-list; every change is audit-logged.
- Public view exposes counts only.
- Existing rate limiting (`form_rate_limits`) continues to protect the public inquiry form.

## 6. Decisions needed before Phase 2

1. **Existing `/enroll` preview conflicts with these rules.** It currently says founding tuition ends
   November 30, 2026, offers 3 installments of $480, and describes classes of "no more than 10".
   This plan uses Dec 5, the $1,296 early-payment tier, no installments, and 12 seats. Which is final?
2. **Payment verification source**: manual (Zelle/check reference typed by an admin) or Stripe later?
3. **Waitlist offers**: how long should a family have to accept an opened seat (suggest 48 hours)?
4. **Admin sign-in**: confirm Neon Auth with an admin email allow-list.
