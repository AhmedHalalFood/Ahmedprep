import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { UpdateCard } from "@/components/updates/update-card"
import { homepageUpdates } from "@/lib/updates"

export function LatestUpdatesSection() {
  const updates = homepageUpdates(4)
  return (
    <section id="updates" className="border-b border-line bg-white py-14 md:py-16" aria-labelledby="latest-updates-title">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Official dates & deadlines</p>
            <h2 id="latest-updates-title" className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Latest SHSAT & SAT Updates
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-subtle">
              Important testing dates, deadlines, preparation updates, and official announcements for NYC families.
            </p>
          </div>
          <Link href="/updates" className="text-link">
            All updates <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {updates.map((update) => (
            <UpdateCard key={update.slug} update={update} />
          ))}
        </div>
      </div>
    </section>
  )
}
