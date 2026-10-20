import "server-only"
import { and, eq, inArray, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { classZoomLinks } from "@/lib/db/schema"
import { isValidZoomUrl, type ZoomDetails } from "@/lib/reminder-emails"

export type ZoomLinkInput = { classDate: string; program: string; zoomUrl: string; meetingId: string; passcode: string }

const MEETING_ID = /^[0-9 ]{9,20}$/

/** Returns a user-facing problem with the input, or null when it is valid. */
export function validateZoomLink(input: ZoomLinkInput) {
  if (!input.zoomUrl || input.zoomUrl.length > 500 || !isValidZoomUrl(input.zoomUrl)) {
    return "Enter a full Zoom link that starts with https:// and is on zoom.us."
  }
  if (input.meetingId && !MEETING_ID.test(input.meetingId)) return "Meeting ID should be 9–11 digits (spaces are fine)."
  if (input.passcode.length > 40) return "Passcode is too long."
  return null
}

export async function getZoomLink(classDate: string, program: string): Promise<ZoomDetails | null> {
  const [row] = await db
    .select()
    .from(classZoomLinks)
    .where(and(eq(classZoomLinks.classDate, classDate), eq(classZoomLinks.program, program)))
    .limit(1)
  return row && isValidZoomUrl(row.zoomUrl) ? { zoomUrl: row.zoomUrl, meetingId: row.meetingId, passcode: row.passcode } : null
}

export async function listZoomLinks(classDates: string[]) {
  if (!classDates.length) return []
  return db.select().from(classZoomLinks).where(inArray(classZoomLinks.classDate, classDates))
}

export async function saveZoomLink(input: ZoomLinkInput) {
  const values = {
    classDate: input.classDate,
    program: input.program,
    zoomUrl: input.zoomUrl,
    meetingId: input.meetingId || null,
    passcode: input.passcode || null,
  }
  await db
    .insert(classZoomLinks)
    .values(values)
    .onConflictDoUpdate({
      target: [classZoomLinks.classDate, classZoomLinks.program],
      set: { zoomUrl: values.zoomUrl, meetingId: values.meetingId, passcode: values.passcode, updatedAt: sql`now()` },
    })
}
