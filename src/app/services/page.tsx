"use client"

import { useState } from "react"
import { CircleCheckBig, Server, Users } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { HomeProcess } from "@/app/home/_components/home-process"
import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"
import { ServicesVisual } from "@/components/hero-visuals"
import { PageHero } from "@/components/page-hero"
import { PillLink } from "@/components/pill-link"
import { SiteShell } from "@/components/site-shell"
import { SplitReveal } from "@/components/split-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteConfig } from "@/lib/config"
import {
  SoftwareViewerPanel,
  AiViewerPanel,
} from "./_components/code-viewer-panel"
import { PartnersSection } from "./_components/partners-section"
import { WhyRantAISection } from "./_components/why-rantai-section"
import { softwareEngineering, aiEngineering, partners, whyRantAI } from "./data"

const fdePoints = [
  {
    icon: Users,
    tone: "#3b82f6",
    title: "Your use case, built together",
    body: "Work directly with our engineers to turn an AI use case into a solution for your team, from defining the problem to building and installing it.",
  },
  {
    icon: Server,
    tone: "#14b8a6",
    title: "Start with your environment",
    body: "Share your infrastructure, data access, and operational requirements so we can scope the work. On-premise and regulated setups are welcome.",
  },
]

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
        prompts: [
          "Our app slows down whenever traffic spikes",
          "Migrate a legacy system without downtime",
          "Our releases keep breaking production",
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
        <PillLink href="#forward-deployed-engineering" size="lg">
          Forward Deployed Engineering
        </PillLink>
        <PillLink href="#what-we-do" size="lg" variant="outline">
          What we do
        </PillLink>
      </PageHero>

      <section
        id="forward-deployed-engineering"
        aria-labelledby="fde-heading"
        className="mx-auto grid max-w-[1440px] scroll-mt-20 gap-14 px-5 py-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-14 lg:py-32"
      >
        <div>
          <Eyebrow className="text-muted-foreground">
            Build with our engineers
          </Eyebrow>
          <SplitReveal
            id="fde-heading"
            text="Forward Deployed Engineering"
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
          />
          <MotionInView>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              RantAI engineers work alongside your team to build and install AI
              solutions in your environment. We start with your workflows and
              requirements, then work with you on implementation.
            </p>
            <PillLink
              href={fdeMailto}
              size="lg"
              icon="external"
              className="mt-9"
            >
              Discuss your project
            </PillLink>
          </MotionInView>
        </div>
        <div className="grid content-center gap-3 sm:grid-cols-2">
          {fdePoints.map((point, i) => (
            <MotionInView
              key={point.title}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl bg-muted p-7"
            >
              <span
                className="grid size-11 place-items-center rounded-xl"
                style={{ background: `${point.tone}1f`, color: point.tone }}
              >
                <point.icon className="size-5" />
              </span>
              <p className="mt-8 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                0{i + 1}
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">
                {point.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {point.body}
              </p>
            </MotionInView>
          ))}
        </div>
      </section>

      <HomeProcess links={false} />

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
