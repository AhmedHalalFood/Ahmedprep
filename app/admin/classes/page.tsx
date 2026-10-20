import type { Metadata } from "next"
import { requireAdmin } from "@/lib/admin-auth"
import { listZoomLinks } from "@/lib/class-zoom-links"
import { getDatabaseEnvironment, isProductionDeployment, reminderDeliveryMode } from "@/lib/db-environment"
import { CLASS_TYPES, getUpcomingClasses, type RsvpProgram } from "@/lib/free-class"
import { REMINDER_WINDOWS } from "@/lib/reminder-schedule"
import { listClassRegistrations } from "@/lib/sunday-reminders"
import { logoutAction } from "../actions"
import { ExclusionToggle, TestReminderButtons, ZoomLinkForm } from "./class-forms"

export const metadata: Metadata = {
  title: "Sunday classes | AhmedPrep admin",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

const STATUS_LABEL: Record<string, string> = { sent: "Sent", failed: "Failed", sending: "Sending" }

function ModeBanner({ live, database, production }: { live: boolean; database: "test" | "live"; production: boolean }) {
  const blocked = !production && database === "live"
  const tone = blocked ? "border-red-700 bg-red-50" : live ? "border-brand bg-brand-soft" : "border-gold bg-cream"
  return (
    <div role="status" className={`flex flex-col gap-1 border-l-4 px-4 py-3 text-sm leading-relaxed text-ink ${tone}`}>
      <p className="font-bold text-navy">
        {blocked ? "Read-only: connected to the live database" : live ? "Live reminders are ON" : "Test mode: reminders go to the test inbox only"}
      </p>
      <p>
        Database: {database === "test" ? "preview-test (no family data)" : "live (main)"}.{" "}
        {blocked
          ? "Changes are blocked here until this environment points at preview-test."
          : live
            ? "Scheduled reminders are emailed to registered families."
            : "No registered family receives a reminder from this environment."}
      </p>
    </div>
  )
}

export default async function AdminClassesPage() {
  await requireAdmin()

  const classes = getUpcomingClasses(4)
  const [database, links, registrations] = await Promise.all([
    getDatabaseEnvironment(),
    listZoomLinks(classes.map((c) => c.isoDate)),
    Promise.all(classes.map((c) => listClassRegistrations(c.isoDate))),
  ])
  const live = reminderDeliveryMode().mode === "live"
  const production = isProductionDeployment()
  const readOnly = !production && database === "live"

  return (
    <main className="min-h-svh bg-brand-soft px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="eyebrow blue">AhmedPrep admin</p>
            <h1 className="text-balance text-2xl font-extrabold text-navy sm:text-3xl">Sunday classes &amp; Zoom links</h1>
            <p className="text-sm leading-relaxed text-ink">
              Reminders go out Sundays at {REMINDER_WINDOWS.morning.label} and {REMINDER_WINDOWS.afternoon.label}, using the link saved for each class.
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-semibold text-navy underline underline-offset-2">
              Sign out
            </button>
          </form>
        </header>

        <ModeBanner live={live} database={database} production={production} />

        <ol className="flex flex-col gap-5">
          {classes.map((session, index) => {
            const programs: RsvpProgram[] = session.type === "workshop" ? ["shsat", "digital_sat"] : [session.type]
            const rows = registrations[index]
            return (
              <li key={session.isoDate} className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="eyebrow">{session.typeLabel}</p>
                    <h2 className="text-lg font-extrabold text-navy">{session.label}</h2>
                    <p className="text-sm text-ink">
                      Topic: <span className="font-semibold">{session.topic}</span> · 4:00–5:00 PM ET
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {rows.length} registration{rows.length === 1 ? "" : "s"}
                  </p>
                </div>

                {programs.map((program) => {
                  const link = links.find((l) => l.classDate === session.isoDate && l.program === program)
                  return (
                    <section key={program} className="flex flex-col gap-3 border-t border-line pt-4" aria-label={`${CLASS_TYPES[program].label} Zoom link`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-navy">{CLASS_TYPES[program].label} Zoom link</h3>
                        <span className={`text-xs font-bold uppercase tracking-wide ${link ? "text-brand" : "text-red-700"}`}>
                          {link ? "Saved" : "Missing: reminders will wait"}
                        </span>
                      </div>
                      <ZoomLinkForm
                        classDate={session.isoDate}
                        program={program}
                        initial={{ zoomUrl: link?.zoomUrl ?? "", meetingId: link?.meetingId ?? "", passcode: link?.passcode ?? "" }}
                        disabled={readOnly}
                      />
                      {link && <TestReminderButtons classDate={session.isoDate} program={program} />}
                    </section>
                  )
                })}

                {rows.length > 0 && (
                  <div className="overflow-x-auto border-t border-line pt-4">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <caption className="sr-only">Registrations for {session.label}</caption>
                      <thead className="text-xs uppercase tracking-wide text-ink">
                        <tr>
                          <th scope="col" className="py-2 pr-3 font-bold">#</th>
                          <th scope="col" className="py-2 pr-3 font-bold">Student</th>
                          <th scope="col" className="py-2 pr-3 font-bold">Program</th>
                          <th scope="col" className="py-2 pr-3 font-bold">10:00 AM</th>
                          <th scope="col" className="py-2 pr-3 font-bold">3:30 PM</th>
                          <th scope="col" className="py-2 font-bold">Reminders</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.id} className="border-t border-line">
                            <td className="py-2 pr-3 text-ink">{row.id}</td>
                            <td className="py-2 pr-3 font-semibold text-navy">{row.studentName}</td>
                            <td className="py-2 pr-3 text-ink">{CLASS_TYPES[row.program as RsvpProgram]?.label ?? row.program}</td>
                            <td className="py-2 pr-3 text-ink">{row.excluded ? "Excluded" : STATUS_LABEL[row.morning ?? ""] ?? "Pending"}</td>
                            <td className="py-2 pr-3 text-ink">{row.excluded ? "Excluded" : STATUS_LABEL[row.afternoon ?? ""] ?? "Pending"}</td>
                            <td className="py-2">
                              <ExclusionToggle registrationId={row.id} excluded={row.excluded} disabled={readOnly} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
