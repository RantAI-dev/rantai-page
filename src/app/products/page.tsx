import type { Metadata } from "next"

import { CapabilityMarquee } from "@/app/home/_components/capability-marquee"
import { siteConfig } from "@/lib/config"
import { ProductsHeroVisual } from "@/components/products-bento"
import { PageHero } from "@/components/page-hero"
import { PillLink } from "@/components/pill-link"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { ProductStack } from "@/components/platform/product-stack"
import { ServicesOverview } from "@/components/services-overview"
import { SiteShell } from "@/components/site-shell"

export const metadata: Metadata = {
  title: "Products",
  description:
    "RantAI Agents, RantAIClaw, RantAI LLMOps, and RantAI Lake: AI products built to run on your own infrastructure.",
}

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
      <ProductStack />
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
    </SiteShell>
  )
}
