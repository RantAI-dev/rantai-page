"use client"

import { useState } from "react"
import { CircleCheckBig } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { DarkPanel } from "@/components/dark-panel"
import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"
import { PageHero } from "@/components/page-hero"
import { PillLink } from "@/components/pill-link"
import { SiteShell } from "@/components/site-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteConfig } from "@/lib/config"
import {
  SoftwareViewerPanel,
  AiViewerPanel,
} from "./_components/code-viewer-panel"
import { PartnersSection } from "./_components/partners-section"
import { WhyRantAISection } from "./_components/why-rantai-section"
import { softwareEngineering, aiEngineering, partners, whyRantAI } from "./data"

const fdeMailto = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Forward Deployed Engineering")}`

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"software" | "ai">("software")
  const currentTab =
    activeTab === "software" ? softwareEngineering : aiEngineering

  return (
    <SiteShell
      cta={{
        title: "Stop paying for slow, fragile software.",
        description:
          "Get a free technical audit. We'll identify the biggest risk in your stack — no commitment required.",
        label: "Get my free audit",
        subject: "Free technical audit",
      }}
    >
      <PageHero
        eyebrow="Services"
        title="Ship better software, faster."
        description="Software and AI engineering focused on outcomes you can measure, from architecture to production."
      >
        <PillLink href="#forward-deployed-engineering" size="lg">
          Forward Deployed Engineering
        </PillLink>
        <PillLink href="#what-we-do" size="lg" variant="outline">
          What we do
        </PillLink>
      </PageHero>

      <DarkPanel
        id="forward-deployed-engineering"
        aria-labelledby="fde-heading"
        className="scroll-mt-20"
      >
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-14 lg:py-28">
          <MotionInView>
            <Eyebrow className="text-white/50">Build with our engineers</Eyebrow>
            <h2
              id="fde-heading"
              className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
            >
              Forward Deployed Engineering
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
              RantAI engineers work alongside your team to build and install AI
              solutions in your environment. We start with your workflows and
              requirements, then work with you on implementation.
            </p>
            <PillLink href={fdeMailto} size="lg" icon="external" className="mt-9">
              Discuss your project
            </PillLink>
          </MotionInView>
          <MotionInView className="grid content-center gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            <div className="bg-black p-7 sm:p-8">
              <p className="text-xs font-medium tracking-[0.08em] text-white/45 uppercase">
                01
              </p>
              <h3 className="mt-4 text-xl font-medium tracking-[-0.02em]">
                Your use case, built together
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                Work directly with our engineers to turn an AI use case into a
                solution for your team, from defining the problem to building
                and installing it.
              </p>
            </div>
            <div className="bg-black p-7 sm:p-8">
              <p className="text-xs font-medium tracking-[0.08em] text-white/45 uppercase">
                02
              </p>
              <h3 className="mt-4 text-xl font-medium tracking-[-0.02em]">
                Start with your environment
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                Share your infrastructure, data access, and operational
                requirements so we can discuss the implementation scope. If you
                are evaluating on-premise AI or work in a regulated
                organization, bring those requirements into the conversation.
              </p>
            </div>
          </MotionInView>
        </div>
      </DarkPanel>

      <section
        id="what-we-do"
        aria-labelledby="what-we-do-heading"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
      >
        <MotionInView className="max-w-3xl">
          <Eyebrow className="text-muted-foreground">What we do</Eyebrow>
          <h2
            id="what-we-do-heading"
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
          >
            Two practices, one engineering team.
          </h2>
        </MotionInView>

        <MotionInView className="mt-14">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "software" | "ai")}
            className="gap-0"
          >
            <TabsList className="h-auto w-full rounded-full bg-muted p-1 sm:w-fit">
              <TabsTrigger
                value="software"
                className="h-10 flex-1 rounded-full px-5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-none"
              >
                Software Engineering
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="h-10 flex-1 rounded-full px-5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-none"
              >
                AI Engineering
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                      {currentTab.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                      {currentTab.description}
                    </p>
                    <ul className="mt-8 space-y-3 border-t border-border pt-6">
                      {currentTab.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <CircleCheckBig className="mt-0.5 size-5 shrink-0 text-brand-1" />
                          <span className="text-base leading-relaxed text-foreground/80">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div>
                <TabsContent value="software">
                  <SoftwareViewerPanel data={softwareEngineering} />
                </TabsContent>
                <TabsContent value="ai">
                  <AiViewerPanel data={aiEngineering} />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </MotionInView>
      </section>

      <PartnersSection partners={partners} />
      <WhyRantAISection items={whyRantAI} />
    </SiteShell>
  )
}
