import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { getActiveCampaign } from "@/lib/campaigns"

export function CampaignBanner() {
  const campaign = getActiveCampaign()
  if (!campaign) return null
  const event = campaign.program === "Digital SAT" ? EVENTS.digitalSatCtaClick : campaign.program === "SHSAT" ? EVENTS.shsatCtaClick : EVENTS.diagnosticCtaClick
  return (
    <section aria-labelledby="campaign-title" className="border-y-4 border-gold bg-academic text-white">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow gold">{campaign.eyebrow}</p>
          <h2 id="campaign-title" className="mt-2 text-balance text-2xl font-extrabold tracking-tight md:text-3xl">
            {campaign.title}
          </h2>
          <p className="mt-2 leading-relaxed text-white/75">{campaign.body}</p>
        </div>
        <TrackedLink
          href={campaign.href}
          event={event}
          eventProps={{ location: "campaign_banner", campaign: campaign.id }}
          className="button button-gold button-lg shrink-0 self-start md:self-auto"
        >
          {campaign.ctaLabel} <ArrowUpRight size={16} aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  )
}
