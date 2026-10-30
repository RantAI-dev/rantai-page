import type { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { PageHero } from "@/components/page-hero"
import { PillLink } from "@/components/pill-link"
import { ProductShowcase } from "@/components/product-showcase"
import { ServicesOverview } from "@/components/services-overview"
import { SiteShell } from "@/components/site-shell"

export const metadata: Metadata = {
  title: "Products",
  description:
    "RantAI Agents and RantAIClaw: AI agents and an agent runtime built for enterprise operations.",
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
        showServicesLink: true,
      }}
    >
      <PageHero
        eyebrow="Products"
        title="AI products built for real operations."
        description="Built for the enterprise. Deployed in days, not months."
      >
        <PillLink
          href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("RantAI product demo")}`}
          size="lg"
          icon="external"
        >
          Request a demo
        </PillLink>
        <PillLink href="#rantai-agents" size="lg" variant="outline">
          See the products
        </PillLink>
      </PageHero>
      <ProductShowcase showIntro={false} showAllProductsLink={false} />
      <ServicesOverview />
    </SiteShell>
  )
}
