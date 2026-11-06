# AhmedPrep 2027 registration readiness audit (review branch only)

Date: November 6, 2026. Scope: static GitHub code review. No live Neon queries, email sends, production tests, merges, or deployments were performed.

## Confirmed implementation path
1. `components/enrollment-2027-form.tsx` validates parent/student fields and submits JSON via `useLeadForm` to `/api/enrollment-2027`.
2. `app/api/enrollment-2027/route.ts` repeats server validation and calls `saveAndDeliverLead` with `formType: "enrollment_2027"`.
3. `lib/lead-storage.ts` first writes to Neon `lead_submissions` using a unique idempotency key and a delivery lease, then delegates notification/confirmation.
4. `lib/lead-delivery.ts` sends the admin notification, then parent confirmation through Resend.
5. `lib/email-sender.ts` redirects non-production email recipients to `delivered@resend.dev`. This reduces accidental email delivery, but does not guarantee that a preview database is isolated.

## Database migration dependency
- `db/migrations/0002_lead_submissions.sql` creates the lead table with a form_type CHECK constraint excluding `enrollment_2027`.
- `db/migrations/0004_enrollment_2027_form_type.sql` expands the CHECK constraint to include `enrollment_2027`.
- If migration 0004 is missing from the connected production Neon database, January enrollment POSTs can fail with a CHECK violation. **Migration presence has not been verified in the database.**
- Before any live enrollment: verify migrations and environment bindings through approved, read-only checks. Never apply migrations without owner authorization.

## Duplicate protection and delivery caveats
- A browser-generated submission UUID plus normalized payload makes retries idempotent. A unique Neon key and delivery lease prevent concurrent duplicate notifications in normal operation.
- A duplicate submission returns `{success:true, duplicate:true, saved:true}` without the original parent confirmation status. The client currently reports that confirmation could not be verified, even if the first email was delivered. This is conservative but potentially confusing.
- The `lead_submissions` row tracks **admin** notification status, not the parent confirmation result. Parent confirmation failures are logged and alerted, but the lead table alone cannot answer which families received confirmation.
- The in-memory rate limiter is per server instance, so it is best-effort rather than a global rate limit.
- Preview email sends are redirected, but the database connection must be checked for separation from production before any preview form submission.

## Policy / content safeguards
- Approved class cap: **12 students per cohort**. A submitted inquiry does not reserve a seat. The existing form does not enforce capacity, which is acceptable for inquiries but must not be represented as a guaranteed seat.
- The January inquiry form has only Winter program/schedule options. Do **not** present it as a Spring or Summer enrollment form until the server-side allowed values, persistence payload, and confirmation copy are updated together.
- Existing January confirmation text is hardcoded to January 2027. A season-aware form must update both email subject and message.
- Refunds, installment plans, payment capture, and final makeup assignments require separate policy approval before displaying firm promises.

## Prioritized next work
1. Read-only verification of Neon migration state, production/preview DB separation, and Resend domain configuration.
2. Add explicit term/cohort selections to the inquiry form and server validation, while preserving old January submissions and avoiding changes to the production database schema.
3. Make confirmation emails cohort-aware, including the correct session hours, pricing, deadlines, and parent-selected term.
4. Add tests for valid/invalid cohorts, idempotent retry, missing migration, admin delivery failure, parent confirmation failure, and preview email redirection.
5. Run a clean build and tests in an isolated environment, then owner review before any deployment.

## Publication gate
Do not merge, deploy, run production migrations, send real emails, or change live Vercel/Neon/Resend settings without explicit separate approval.
