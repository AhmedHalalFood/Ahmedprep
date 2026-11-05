import { Resend, type CreateEmailOptions, type CreateEmailRequestOptions } from "resend"

// Every automated AhmedPrep email sends from noreply@ahmedprep.com. The display name tells the reader which kind
// of email it is, and each email sets its own Reply-To.
export const FAMILY_SENDER = "AhmedPrep <noreply@ahmedprep.com>"
export const INTERNAL_SENDER = "AhmedPrep Website <noreply@ahmedprep.com>"
export const SOURCE_CHECK_SENDER = "AhmedPrep Source Check <noreply@ahmedprep.com>"

// Resend's test inbox: accepts mail and reports it delivered, but never reaches a real person.
export const TEST_INBOX = "delivered@resend.dev"

const PREVIEW_PREFIX = "[PREVIEW]"

type SendResult = Awaited<ReturnType<Resend["emails"]["send"]>>
type Transport = { send: (payload: CreateEmailOptions, options?: CreateEmailRequestOptions) => Promise<SendResult> }

// Only the Production deployment may email real people. Preview, development, and local runs
// (VERCEL_ENV "preview", "development", empty, or unset) always send to the test inbox.
const isProduction = () => process.env.VERCEL_ENV === "production"

/**
 * Applies the environment rules to one send. Outside Production every recipient is replaced by the test inbox,
 * CC/BCC are dropped, and the idempotency key gets a non-production namespace. Preview and Production share one
 * Resend account, so without that namespace a Preview test with the same details could reuse a Production key and
 * make Resend skip the real email.
 */
export function prepareSend(payload: CreateEmailOptions, options?: CreateEmailRequestOptions) {
  if (isProduction()) return { payload, options }
  const environment = process.env.VERCEL_ENV || "local"
  const count = ([] as string[]).concat(payload.to ?? []).length
  console.log(`[email] ${environment}: redirected ${count} recipient(s) to the test inbox`)
  const subject = payload.subject ?? ""
  return {
    payload: {
      ...payload,
      to: [TEST_INBOX],
      cc: undefined,
      bcc: undefined,
      subject: subject.startsWith(PREVIEW_PREFIX) ? subject : `${PREVIEW_PREFIX} ${subject}`,
    } as CreateEmailOptions,
    options: options?.idempotencyKey
      ? { ...options, idempotencyKey: `nonprod/${environment}/${options.idempotencyKey}` }
      : options,
  }
}

let transportFactory: (apiKey: string) => Transport = (apiKey) => new Resend(apiKey).emails

/** Test-only: swaps the Resend transport for a fake. Pass null to restore the real one. */
export function setEmailTransportForTests(factory: ((apiKey: string) => Transport) | null) {
  transportFactory = factory ?? ((apiKey) => new Resend(apiKey).emails)
}

/** A Resend client that only emails real people in Production. Use instead of `new Resend()`. */
export function createEmailClient(apiKey: string) {
  const transport = transportFactory(apiKey)
  return {
    emails: {
      send: (payload: CreateEmailOptions, options?: CreateEmailRequestOptions) => {
        const prepared = prepareSend(payload, options)
        return transport.send(prepared.payload, prepared.options)
      },
    },
  }
}
