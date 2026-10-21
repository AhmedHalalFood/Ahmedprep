-- Diagnostic requests, contact messages, referrals, and SHSAT Intensive inquiries: one row per submission, saved
-- before AhmedPrep's notification email is attempted. Additive and safe to re-run: every statement is IF NOT EXISTS
-- and no existing table is touched. Must stay in sync with lib/db/schema.ts.

CREATE TABLE IF NOT EXISTS lead_submissions (
  id bigserial PRIMARY KEY,
  form_type text NOT NULL CHECK (form_type IN ('diagnostic', 'contact', 'referral', 'shsat_intensive')),
  -- sha256 of form type + the browser's per-submission id + the submitted values. Repeat clicks and retries collapse onto one row.
  idempotency_key text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  student_name text,
  program text,
  -- Every validated field exactly as submitted (after trimming and length limits).
  payload jsonb NOT NULL,
  delivery_status text NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'notified', 'failed')),
  admin_notified_at timestamptz,
  delivery_attempts integer NOT NULL DEFAULT 0,
  -- Short-lived lease so two simultaneous requests for the same submission never both send the notification.
  delivery_lease text,
  delivery_started_at timestamptz,
  last_delivery_error text,
  duplicate_attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lead_submissions_idempotency_key_key UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS lead_submissions_form_type_created_at_idx ON lead_submissions (form_type, created_at DESC);

-- Keeps the "who still needs a follow-up" query fast as the table grows.
CREATE INDEX IF NOT EXISTS lead_submissions_undelivered_idx ON lead_submissions (created_at) WHERE delivery_status <> 'notified';
