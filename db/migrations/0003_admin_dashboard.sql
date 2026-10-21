-- Additive only: no existing column, row or index is dropped, renamed or rewritten.

ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS submission_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS inquiry_status text NOT NULL DEFAULT 'new'
    CHECK (inquiry_status IN ('new', 'contacted', 'follow_up_needed', 'enrolled', 'closed')),
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz,
  -- SHSAT Intensive only. Always calculated by the server from the class calendar, never taken from the browser.
  ADD COLUMN IF NOT EXISTS intensive_first_class_date date,
  ADD COLUMN IF NOT EXISTS intensive_remaining_classes integer,
  ADD COLUMN IF NOT EXISTS intensive_remaining_hours numeric(5, 1),
  ADD COLUMN IF NOT EXISTS intensive_tuition_cents integer;

CREATE UNIQUE INDEX IF NOT EXISTS lead_submissions_submission_id_key ON lead_submissions (submission_id);
CREATE INDEX IF NOT EXISTS lead_submissions_status_created_idx ON lead_submissions (inquiry_status, created_at DESC);

-- Rows that already exist get status 'new' and no notes. Their registration data is untouched.
ALTER TABLE sunday_class_registrations
  ADD COLUMN IF NOT EXISTS submission_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS inquiry_status text NOT NULL DEFAULT 'new'
    CHECK (inquiry_status IN ('new', 'contacted', 'follow_up_needed', 'enrolled', 'closed')),
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS sunday_class_registrations_submission_id_key
  ON sunday_class_registrations (submission_id);

-- Shared across server instances, unlike the current in-memory limiter.
CREATE TABLE IF NOT EXISTS form_rate_limits (
  bucket text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL
);

-- Every status change, note edit and CSV export made in the admin dashboard.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id bigserial PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  target_table text,
  target_id bigint,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON admin_audit_log (created_at DESC);
