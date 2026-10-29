import { BUSINESS } from "@/lib/business"

/** Shown when the free-access policy declines a booking. Friendly, not an error: nothing went wrong. */
export function LimitNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="border-l-4 border-gold bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
      <p>{message}</p>
      <p className="mt-2">
        Call or text{" "}
        <a href={BUSINESS.phoneHref} className="font-semibold text-navy underline underline-offset-2">
          {BUSINESS.phoneDisplay}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-navy underline underline-offset-2">
          {BUSINESS.email}
        </a>
        .
      </p>
    </div>
  )
}
