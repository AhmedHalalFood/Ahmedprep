"use server"

import { redirect } from "next/navigation"
import { FREE_ACCESS_ADMIN_PATH, verifyFreeAccessAdminToken } from "@/lib/admin-links"
import {
  clearReview,
  grantException,
  revokeException,
  setAssessmentStatus,
  setSundayAttendance,
} from "@/lib/free-access"
import { FREE_ACCESS_LIMITS, type FreeAccessKind } from "@/lib/free-access-policy"

/** Signed links do not identify a person, so audit entries record the channel used. */
const ADMIN_ACTOR = "signed-admin-link"

const text = (formData: FormData, key: string, max = 200) => String(formData.get(key) ?? "").trim().slice(0, max)
const isKind = (value: string): value is FreeAccessKind => value in FREE_ACCESS_LIMITS

async function run(formData: FormData, work: () => Promise<void>, success: string) {
  const exp = text(formData, "exp", 32)
  const sig = text(formData, "sig", 128)
  if (!verifyFreeAccessAdminToken(exp, sig)) redirect(`${FREE_ACCESS_ADMIN_PATH}?invalid=1`)

  let message = success
  try {
    await work()
  } catch (error) {
    console.error("[free-access-admin] Update failed:", error instanceof Error ? error.message : error)
    message = `Not saved: ${error instanceof Error ? error.message : "database unavailable"}. Nothing was changed.`
  }
  const params = new URLSearchParams({ exp, sig, msg: message })
  const q = text(formData, "q", 100)
  if (q) params.set("q", q)
  redirect(`${FREE_ACCESS_ADMIN_PATH}?${params}`)
}

const recordId = (formData: FormData) => {
  const id = Number(text(formData, "id", 20))
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Invalid record")
  return id
}

export async function updateAttendance(formData: FormData) {
  await run(formData, () => setSundayAttendance(ADMIN_ACTOR, recordId(formData), text(formData, "status", 20)), "Attendance updated.")
}

export async function updateAssessment(formData: FormData) {
  await run(formData, () => setAssessmentStatus(ADMIN_ACTOR, recordId(formData), text(formData, "status", 20)), "Assessment status updated.")
}

export async function markReviewed(formData: FormData) {
  await run(
    formData,
    async () => {
      const kind = text(formData, "kind", 20)
      if (!isKind(kind)) throw new Error("Invalid record type")
      await clearReview(ADMIN_ACTOR, kind, recordId(formData))
    },
    "Marked as reviewed.",
  )
}

export async function addException(formData: FormData) {
  await run(
    formData,
    async () => {
      const kind = text(formData, "kind", 20)
      const studentName = text(formData, "studentName", 100)
      const parentEmail = text(formData, "parentEmail", 200).toLowerCase()
      const parentPhone = text(formData, "parentPhone", 30)
      const reason = text(formData, "reason", 500)
      const extraAllowance = Number(text(formData, "extraAllowance", 3))
      if (!isKind(kind)) throw new Error("Choose Sunday class or diagnostic")
      if (!studentName || !parentEmail.includes("@")) throw new Error("Student name and parent email are required")
      if (!reason) throw new Error("A reason is required")
      if (!Number.isInteger(extraAllowance) || extraAllowance < 1 || extraAllowance > 10) throw new Error("Extra allowance must be 1-10")
      await grantException(ADMIN_ACTOR, { kind, studentName, parentEmail, parentPhone, extraAllowance, reason })
    },
    "Exception granted.",
  )
}

export async function removeException(formData: FormData) {
  await run(formData, () => revokeException(ADMIN_ACTOR, recordId(formData)), "Exception revoked.")
}
