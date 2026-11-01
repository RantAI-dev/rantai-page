"use client"

import { ServicesVisual } from "@/components/shared/hero-visuals"
import { PageHero } from "@/components/shared/page-hero"
import { PillLink } from "@/components/shared/pill-link"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"
import { PartnersSection } from "./_components/partners-section"
import { Engagement } from "./_components/engagement"
import { ProblemPicker } from "./_components/problem-picker"
import { WhyRantAISection } from "./_components/why-rantai-section"
import { partners } from "@/lib/partners"
import { whyRantAI } from "./data"

const sectionLinks = [
  { id: "what-we-do", label: "Where we help" },
  { id: "how-we-work", label: "How we work" },
  { id: "proof", label: "Proof" },
  { id: "why-rantai", label: "Why RantAI" },
]

export default function ServicesPage() {
  return (
    <SiteShell
      cta={{
        title: "Stop paying for slow, fragile software.",
        description:
          "Get a free technical audit. We'll identify the biggest risk in your stack — no commitment required.",
        label: "Get my free audit",
        subject: "Free technical audit",
        prompts: [
          "Our app slows down whenever traffic spikes",
          "A legacy system is holding us back",
          "Our AI works in a demo but not in production",
          "We need more engineers on our team",
        ],
      }}
    >
      <PageHero
        tone="peach"
        eyebrow="Services"
        title={"Ship better\nsoftware, faster."}
        description="Software and AI engineering that takes your systems from architecture to production."
        visual={<ServicesVisual />}
      >
        <PillLink href="#what-we-do" size="lg">
          Find your fix
        </PillLink>
        <PillLink href="#how-we-work" size="lg" variant="outline">
          How we work
        </PillLink>
      </PageHero>

      <ProblemPicker />

      <Engagement />

      <PartnersSection partners={partners} eyebrow="Proof" />
      <WhyRantAISection items={whyRantAI} />
      <SectionNav sections={sectionLinks} />
    </SiteShell>
  )
}
