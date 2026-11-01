import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/shared/json-ld"
import { CapabilityMarquee } from "@/components/shared/capability-marquee"
import { HomeHero } from "./_components/home/home-hero"
import { HomeInsights } from "./_components/home/home-insights"
import { HomeProblem } from "./_components/home/home-problem"
import { HomeProcess } from "./_components/home/home-process"
import { HomeSolution } from "./_components/home/home-solution"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"

export const metadata = pageMetadata({
  title: "RantAI: AI systems for real-world operations",
  description:
    "RantAI builds production-grade agentic AI, intelligent data platforms, and automation systems for government and enterprise.",
  path: "/",
  absoluteTitle: true,
})

// Who RantAI is, for search engines (shown in knowledge panels).
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/rant-ai.png`,
  email: siteConfig.links.email,
  description: siteConfig.description,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
}

function Announcement() {
  return (
    <Link
      href="/services#forward-deployed-engineering"
      className="group flex items-center justify-center gap-2 bg-background px-4 pt-2.5 pb-1 text-center text-[13px] text-foreground/70 transition-colors hover:text-foreground"
    >
      <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-background uppercase">
        New
      </span>
      <span>
        Forward Deployed Engineering
        <span className="hidden sm:inline">
          : RantAI engineers, embedded with your team
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="hidden size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
      />
    </Link>
  )
}

export default function Page() {
  return (
    <SiteShell announcement={<Announcement />}>
      <JsonLd data={organization} />
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <ExpandingPanel
        id="platform"
        aria-labelledby="platform-heading"
        className="scroll-mt-20"
      >
        <PlatformReel />
      </ExpandingPanel>
      <CapabilityMarquee />
      <HomeProcess />
      <HomeInsights />
      <SectionNav
        sections={[
          { id: "problem", label: "The problem" },
          { id: "solution", label: "How we help" },
          { id: "platform", label: "Products" },
          { id: "capabilities", label: "Capabilities" },
          { id: "how-we-work", label: "How we work" },
          { id: "insights", label: "Insights" },
        ]}
      />
    </SiteShell>
  )
}
