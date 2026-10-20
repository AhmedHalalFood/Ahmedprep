import { bigint, bigserial, date, integer, pgTable, primaryKey, text, timestamp, unique } from "drizzle-orm/pg-core"

export const sundayClassRegistrations = pgTable("sunday_class_registrations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  dedupeKey: text("dedupe_key").notNull().unique(),
  classDate: date("class_date").notNull(),
  program: text("program").notNull(),
  studentName: text("student_name").notNull(),
  studentGrade: text("student_grade").notNull(),
  parentName: text("parent_name").notNull(),
  parentEmail: text("parent_email").notNull(),
  parentPhone: text("parent_phone").notNull(),
  currentSchool: text("current_school"),
  topic: text("topic").notNull(),
  adminNotifiedAt: timestamp("admin_notified_at", { withTimezone: true }),
  confirmationStatus: text("confirmation_status").notNull().default("pending"),
  duplicateAttempts: integer("duplicate_attempts").notNull().default(0),
  confirmationResentAt: timestamp("confirmation_resent_at", { withTimezone: true }),
  confirmationResendCount: integer("confirmation_resend_count").notNull().default(0),
  lastDeliveryError: text("last_delivery_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const classZoomLinks = pgTable(
  "class_zoom_links",
  {
    classDate: date("class_date").notNull(),
    program: text("program").notNull(),
    zoomUrl: text("zoom_url").notNull(),
    meetingId: text("meeting_id"),
    passcode: text("passcode"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.classDate, t.program] })],
)

export const sundayReminderDeliveries = pgTable(
  "sunday_reminder_deliveries",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    registrationId: bigint("registration_id", { mode: "number" })
      .notNull()
      .references(() => sundayClassRegistrations.id),
    slot: text("slot").notNull(),
    mode: text("mode").notNull(),
    status: text("status").notNull(),
    attempts: integer("attempts").notNull().default(1),
    idempotencyKey: text("idempotency_key").notNull(),
    recipient: text("recipient").notNull(),
    trigger: text("trigger").notNull(),
    resendId: text("resend_id"),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("sunday_reminder_deliveries_once").on(t.registrationId, t.slot, t.mode)],
)

export const sundayReminderExclusions = pgTable("sunday_reminder_exclusions", {
  registrationId: bigint("registration_id", { mode: "number" })
    .primaryKey()
    .references(() => sundayClassRegistrations.id),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const adminLoginAttempts = pgTable("admin_login_attempts", {
  clientKey: text("client_key").primaryKey(),
  failures: integer("failures").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
