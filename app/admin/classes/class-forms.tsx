"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveZoomLinkAction, sendTestReminderAction, toggleExclusionAction, type ActionState } from "../actions"

function Feedback({ state }: { state: ActionState }) {
  if (!state) return null
  return (
    <p role={state.ok ? "status" : "alert"} className={`text-sm font-semibold ${state.ok ? "text-brand" : "text-red-700"}`}>
      {state.message}
    </p>
  )
}

export function ZoomLinkForm({
  classDate,
  program,
  initial,
  disabled,
}: {
  classDate: string
  program: string
  initial: { zoomUrl: string; meetingId: string; passcode: string }
  disabled: boolean
}) {
  const [state, action, pending] = useActionState(saveZoomLinkAction, null)
  const id = `${classDate}-${program}`
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="classDate" value={classDate} />
      <input type="hidden" name="program" value={program} />
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-url`}>Zoom join link</Label>
        <Input
          id={`${id}-url`}
          name="zoomUrl"
          type="url"
          inputMode="url"
          placeholder="https://us02web.zoom.us/j/..."
          defaultValue={initial.zoomUrl}
          required
          disabled={disabled}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={`${id}-meeting`}>Meeting ID (optional)</Label>
          <Input id={`${id}-meeting`} name="meetingId" inputMode="numeric" defaultValue={initial.meetingId} disabled={disabled} autoComplete="off" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={`${id}-passcode`}>Passcode (optional)</Label>
          <Input id={`${id}-passcode`} name="passcode" defaultValue={initial.passcode} disabled={disabled} autoComplete="off" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={disabled || pending} className="bg-navy text-primary-foreground hover:bg-academic">
          {pending ? "Saving…" : "Save Zoom link"}
        </Button>
        <Feedback state={state} />
      </div>
    </form>
  )
}

export function TestReminderButtons({ classDate, program }: { classDate: string; program: string }) {
  const [state, action, pending] = useActionState(sendTestReminderAction, null)
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="classDate" value={classDate} />
      <input type="hidden" name="program" value={program} />
      <span className="text-sm text-ink">Preview in the test inbox:</span>
      <Button type="submit" name="slot" value="morning" variant="outline" size="sm" disabled={pending}>
        10:00 AM email
      </Button>
      <Button type="submit" name="slot" value="afternoon" variant="outline" size="sm" disabled={pending}>
        3:30 PM email
      </Button>
      <Feedback state={state} />
    </form>
  )
}

export function ExclusionToggle({ registrationId, excluded, disabled }: { registrationId: number; excluded: boolean; disabled: boolean }) {
  const [state, action, pending] = useActionState(toggleExclusionAction, null)
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="registrationId" value={registrationId} />
      <input type="hidden" name="exclude" value={String(!excluded)} />
      <Button type="submit" variant="outline" size="sm" disabled={disabled || pending}>
        {excluded ? "Include" : "Exclude"}
      </Button>
      {state && !state.ok && <Feedback state={state} />}
    </form>
  )
}
