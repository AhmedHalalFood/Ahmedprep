-- Free Sunday class RSVPs: one row per parent + student + class date + program, plus email delivery tracking.
-- Additive and safe to re-run: every statement is IF NOT EXISTS, and nothing is dropped, renamed, or rewritten,
-- so existing registrations are left untouched. Must stay in sync with lib/db/schema.ts.

CREATE TABLE IF NOT EXISTS sunday_class_registrations (
  id bigserial PRIMARY KEY,
  dedupe_key text NOT NULL,
  class_date date NOT NULL,
  program text NOT NULL,
  student_name text NOT NULL,
  student_grade text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  current_school text,
  topic text NOT NULL,
  admin_notified_at timestamptz,
  confirmation_status text NOT NULL DEFAULT 'pending',
  duplicate_attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sunday_class_registrations_dedupe_key_key UNIQUE (dedupe_key)
);

-- Added for the admin confirmation resend. On an existing table these are metadata-only changes (no table rewrite).
ALTER TABLE sunday_class_registrations ADD COLUMN IF NOT EXISTS confirmation_resend_count integer NOT NULL DEFAULT 0;
ALTER TABLE sunday_class_registrations ADD COLUMN IF NOT EXISTS confirmation_resent_at timestamptz;
ALTER TABLE sunday_class_registrations ADD COLUMN IF NOT EXISTS last_delivery_error text;

-- Duplicate RSVP protection relies on this. No-op when the constraint above already created it.
CREATE UNIQUE INDEX IF NOT EXISTS sunday_class_registrations_dedupe_key_key ON sunday_class_registrations (dedupe_key);
