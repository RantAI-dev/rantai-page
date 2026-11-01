
import { pageMetadata } from "@/lib/seo"
import { CapabilityMarquee } from "@/components/shared/capability-marquee"
import { siteConfig } from "@/lib/config"
import { ProductsHeroVisual } from "./_components/products-bento"
import { PageHero } from "@/components/shared/page-hero"
import { PillLink } from "@/components/shared/pill-link"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { DataJourney } from "@/components/platform/data-journey"
import { ServicesOverview } from "./_components/services-overview"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"

export const metadata = pageMetadata({
  title: "Products",
  description:
    "RantAI Agents, RantAI Claw, RantAI LLMOps, and RantAI Lakehouse: AI products built to run on your own infrastructure.",
  path: "/products",
})

export default function ProductsPage() {
  return (
    <SiteShell
      cta={{
        title: "Start building with RantAI today.",
        description:
          "Deploy your first AI product in under two weeks — no long procurement cycles required.",
        label: "Request a demo",
        subject: "RantAI product demo",
        prompts: [
          "An agent that answers from our internal documents",
          "Run AI models on our own infrastructure",
          "Bring our data into one searchable place",
        ],
        showServicesLink: true,
      }}
    >
      <PageHero
        tone="blue"
        eyebrow="Products"
        title={"AI products built\nfor real operations."}
        description="Four products that work together, from your data to the agents that act on it."
        visual={<ProductsHeroVisual />}
      >
        <PillLink
          href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("RantAI product demo")}`}
          size="lg"
          icon="external"
        >
          Request a demo
        </PillLink>
        <PillLink href="#platform" size="lg" variant="outline">
          See them in action
        </PillLink>
      </PageHero>
      <DataJourney />
      <ExpandingPanel
        id="platform"
        aria-labelledby="platform-heading"
        className="scroll-mt-20"
      >
        <PlatformReel
          intro={{ eyebrow: "In action", title: "Try each product." }}
        />
      </ExpandingPanel>
      <CapabilityMarquee />
      <ServicesOverview />
      <SectionNav
        sections={[
          { id: "how-it-fits", label: "How it fits" },
          { id: "platform", label: "Products" },
          { id: "capabilities", label: "Capabilities" },
          { id: "services", label: "Engineers" },
        ]}
      />
    </SiteShell>
  )
}
