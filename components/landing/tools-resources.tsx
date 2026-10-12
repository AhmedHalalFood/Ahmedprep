import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { RESOURCES } from "@/lib/resources"
import { FREE_TOOLS, toolPath } from "@/lib/tools"

export function ToolsResources() {
  const featured = [RESOURCES.find((r) => r.category === "SHSAT"), RESOURCES.find((r) => r.category === "Digital SAT")].filter(
    (r) => r !== undefined,
  )
  return (
    <section id="resources" className="resources-section" aria-labelledby="resources-heading">
      <div className="container">
        <div className="resources-heading flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Free Tools & Resources</p>
            <h2 id="resources-heading">
              Know the test.
              <br />
              <span>Know the next step.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/tools" className="text-link">
              All tools <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/resources" className="text-link">
              All resources <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="resource-grid">
          {FREE_TOOLS.map((tool) => (
            <TrackedLink
              key={tool.slug}
              href={toolPath(tool.slug)}
              event={EVENTS.toolOpen}
              eventProps={{ location: "home_tools", tool: tool.slug }}
              className="resource-item"
            >
              <span>Free tool · {tool.test}</span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <ArrowUpRight size={18} aria-hidden="true" />
            </TrackedLink>
          ))}
          {featured.map((item) => (
            <Link key={item.slug} href={`/resources/${item.slug}`} className="resource-item">
              <span>Guide · {item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
