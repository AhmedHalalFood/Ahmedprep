import { bigserial, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
