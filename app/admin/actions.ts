"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { attemptAdminLogin, endAdminSession, isAdminSession } from "@/lib/admin-auth"
import { saveZoomLink, validateZoomLink } from "@/lib/class-zoom-links"
import { UnsafeDatabaseError } from "@/lib/db-environment"
import { getClassByDate, type RsvpProgram } from "@/lib/free-class"
import { REMINDER_SLOTS, type ReminderSlot } from "@/lib/reminder-schedule"
import { sendAdminTestReminder, setReminderExclusion } from "@/lib/sunday-reminders"

export type ActionState = { ok: boolean; message: string } | null

const field = (form: FormData, name: string, max = 500) => String(form.get(name) ?? "").trim().slice(0, max)
const PROGRAMS: RsvpProgram[] = ["shsat", "digital_sat"]

async function guard(): Promise<ActionState | null> {
  return (await isAdminSession()) ? null : { ok: false, message: "Your session has ended. Please sign in again." }
}

function failure(error: unknown): ActionState {
  if (error instanceof UnsafeDatabaseError) return { ok: false, message: error.message }
  console.error("[admin] action failed:", error instanceof Error ? error.message : error)
  return { ok: false, message: "Something went wrong. Please try again." }
}

export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const result = await attemptAdminLogin(String(form.get("password") ?? "").slice(0, 200))
  if (!result.ok) return { ok: false, message: result.error }
  redirect("/admin/classes")
}

export async function logoutAction() {
  await endAdminSession()
  redirect("/admin/login")
}

export async function saveZoomLinkAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  const input = {
    classDate: field(form, "classDate", 10),
    program: field(form, "program", 20),
    zoomUrl: field(form, "zoomUrl"),
    meetingId: field(form, "meetingId", 30),
    passcode: field(form, "passcode", 60),
  }
  if (!getClassByDate(input.classDate) || !PROGRAMS.includes(input.program as RsvpProgram)) {
    return { ok: false, message: "Unknown class." }
  }
  const problem = validateZoomLink(input)
  if (problem) return { ok: false, message: problem }
  try {
    await saveZoomLink(input)
  } catch (error) {
    return failure(error)
  }
  revalidatePath("/admin/classes")
  return { ok: true, message: "Zoom link saved." }
}

export async function sendTestReminderAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  const classDate = field(form, "classDate", 10)
  const program = field(form, "program", 20) as RsvpProgram
  const slot = field(form, "slot", 20) as ReminderSlot
  if (!getClassByDate(classDate) || !PROGRAMS.includes(program) || !REMINDER_SLOTS.includes(slot)) {
    return { ok: false, message: "Unknown class or reminder." }
  }
  try {
    const result = await sendAdminTestReminder(classDate, program, slot)
    return result.ok ? { ok: true, message: "Test sent to the test inbox only." } : { ok: false, message: result.error }
  } catch (error) {
    return failure(error)
  }
}

export async function toggleExclusionAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  const registrationId = Number(field(form, "registrationId", 12))
  if (!Number.isInteger(registrationId) || registrationId <= 0) return { ok: false, message: "Unknown registration." }
  try {
    await setReminderExclusion(registrationId, field(form, "exclude", 5) === "true")
  } catch (error) {
    return failure(error)
  }
  revalidatePath("/admin/classes")
  return { ok: true, message: "Updated." }
}
