import { Resend, type CreateEmailOptions, type CreateEmailRequestOptions } from "resend"

// Every automated AhmedPrep email sends from this one address. Each email sets its own Reply-To.
export const EMAIL_SENDER = "AhmedPrep <noreply@ahmedprep.com>"

// Resend's test inbox: accepts mail and reports it delivered, but never reaches a real person.
export const TEST_INBOX = "delivered@resend.dev"

// Only the Production deployment may email real people. Preview, development, and local runs
// (VERCEL_ENV "preview", "development", or unset) always send to the test inbox.
const isProduction = () => process.env.VERCEL_ENV === "production"

function routeForEnvironment(payload: CreateEmailOptions): CreateEmailOptions {
  if (isProduction()) return payload
  const count = ([] as string[]).concat(payload.to ?? []).length
  console.log(`[email] ${process.env.VERCEL_ENV ?? "local"}: redirected ${count} recipient(s) to ${TEST_INBOX}`)
  return {
    ...payload,
    to: [TEST_INBOX],
    cc: undefined,
    bcc: undefined,
    subject: payload.subject?.startsWith("[PREVIEW]") ? payload.subject : `[PREVIEW] ${payload.subject ?? ""}`,
  } as CreateEmailOptions
}

/** A Resend client that only emails real people in Production. Use instead of `new Resend()`. */
export function createEmailClient(apiKey: string) {
  const resend = new Resend(apiKey)
  return {
    emails: {
      send: (payload: CreateEmailOptions, options?: CreateEmailRequestOptions) =>
        resend.emails.send(routeForEnvironment(payload), options),
    },
  }
}
