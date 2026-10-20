-- Class-day Zoom reminders, the admin-managed Zoom links they use, and admin login lockout.
-- Additive and safe to re-run: only new tables and indexes are created. sunday_class_registrations is not altered,
-- and no existing row is read, rewritten, or removed. Must stay in sync with lib/db/schema.ts.

-- One Zoom link per Sunday class and program, managed from /admin/classes. This is the only source reminders use.
CREATE TABLE IF NOT EXISTS class_zoom_links (
  class_date date NOT NULL,
  program text NOT NULL,
  zoom_url text NOT NULL,
  meeting_id text,
  passcode text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (class_date, program)
);

-- One row per registration, reminder slot, and delivery mode. The unique key is what makes a reminder send at most once,
-- even when the scheduler retries or fires twice. Test-mode rows never block a later live reminder.
CREATE TABLE IF NOT EXISTS sunday_reminder_deliveries (
  id bigserial PRIMARY KEY,
  registration_id bigint NOT NULL REFERENCES sunday_class_registrations (id),
  slot text NOT NULL,
  mode text NOT NULL,
  status text NOT NULL,
  attempts integer NOT NULL DEFAULT 1,
  idempotency_key text NOT NULL,
  recipient text NOT NULL,
  trigger text NOT NULL,
  resend_id text,
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sunday_reminder_deliveries_slot_check CHECK (slot IN ('morning', 'afternoon')),
  CONSTRAINT sunday_reminder_deliveries_mode_check CHECK (mode IN ('test', 'live')),
  CONSTRAINT sunday_reminder_deliveries_status_check CHECK (status IN ('sending', 'sent', 'failed')),
  CONSTRAINT sunday_reminder_deliveries_once UNIQUE (registration_id, slot, mode)
);

-- Registrations that must never receive scheduled reminders (e.g. internal test sign-ups). The registration itself is kept.
CREATE TABLE IF NOT EXISTS sunday_reminder_exclusions (
  registration_id bigint PRIMARY KEY REFERENCES sunday_class_registrations (id),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Failed admin password attempts per hashed client address, for the 15-minute lockout.
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  client_key text PRIMARY KEY,
  failures integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
