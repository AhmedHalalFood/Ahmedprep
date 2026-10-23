-- Allows January 2027 enrollment inquiries in lead_submissions. Only the form_type CHECK constraint is replaced:
-- no rows, columns, or other tables are touched, and every existing form type stays allowed. Safe to re-run.
-- Must stay in sync with LeadFormType in lib/lead-storage.ts.

ALTER TABLE lead_submissions DROP CONSTRAINT IF EXISTS lead_submissions_form_type_check;

ALTER TABLE lead_submissions
  ADD CONSTRAINT lead_submissions_form_type_check
  CHECK (form_type IN ('diagnostic', 'contact', 'referral', 'shsat_intensive', 'enrollment_2027'));
