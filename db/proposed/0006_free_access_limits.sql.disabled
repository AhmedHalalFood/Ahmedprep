-- Free-access limits: two free Sunday classes and two free diagnostic assessments per student.
-- NOT YET APPLIED. Requires the owner's approval before `pnpm db:migrate` is run against any database.
-- (0005 is reserved for the seat-availability plan in docs/seat-availability-plan.md.)
--
-- Additive only and safe to re-run. No existing row, column, constraint or index is dropped, renamed or rewritten.
-- Adding a column with a constant default is a metadata-only change in Postgres (no table rewrite).
-- Every existing registration starts as 'registered' / NULL (not yet completed), so no family is blocked by past
-- records until AhmedPrep marks attendance in /admin/free-access. The website only starts enforcing the limits once
-- this file is recorded in schema_migrations.

ALTER TABLE sunday_class_registrations
  ADD COLUMN IF NOT EXISTS attendance_status text NOT NULL DEFAULT 'registered'
    CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')),
  ADD COLUMN IF NOT EXISTS attendance_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'none'
    CHECK (review_status IN ('none', 'needs_review', 'cleared')),
  ADD COLUMN IF NOT EXISTS review_reason text;

-- Only meaningful for form_type = 'diagnostic'. NULL means requested but not yet completed.
ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS assessment_status text
    CHECK (assessment_status IS NULL OR assessment_status IN ('requested', 'completed', 'no_show', 'cancelled')),
  ADD COLUMN IF NOT EXISTS assessment_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'none'
    CHECK (review_status IN ('none', 'needs_review', 'cleared')),
  ADD COLUMN IF NOT EXISTS review_reason text;

-- Administrator-approved extra free sessions for one student. Revoking keeps the row for the record.
CREATE TABLE IF NOT EXISTS free_access_exceptions (
  id bigserial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('sunday_class', 'diagnostic')),
  student_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL DEFAULT '',
  extra_allowance integer NOT NULL CHECK (extra_allowance BETWEEN 1 AND 10),
  reason text NOT NULL,
  granted_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

-- Fast lookups of a family's history before a free booking is accepted.
CREATE INDEX IF NOT EXISTS sunday_class_registrations_parent_email_idx ON sunday_class_registrations (lower(parent_email));
CREATE INDEX IF NOT EXISTS sunday_class_registrations_student_name_idx ON sunday_class_registrations (lower(student_name));
CREATE INDEX IF NOT EXISTS lead_submissions_diagnostic_email_idx ON lead_submissions (lower(contact_email)) WHERE form_type = 'diagnostic';
CREATE INDEX IF NOT EXISTS lead_submissions_diagnostic_student_idx ON lead_submissions (lower(student_name)) WHERE form_type = 'diagnostic';
CREATE INDEX IF NOT EXISTS free_access_exceptions_email_idx ON free_access_exceptions (lower(parent_email)) WHERE revoked_at IS NULL;
