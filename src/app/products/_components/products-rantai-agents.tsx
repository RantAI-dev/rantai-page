"use client"

import { useState } from "react"
import { BotIcon, DatabaseZapIcon, ScrollIcon, ZapIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { cn } from "@/lib/utils"
import { ProductInfoPanel, ProductLink, ProductMediaPanel } from "./products-showcase"

const features = [
  {
    value: "rag",
    label: "RAG",
    icon: DatabaseZapIcon,
    video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20RAG%20Prompt.mp4",
    title: "Knowledge Base & RAG",
    body: "Centralize your organization's knowledge and enable AI agents to retrieve the right information instantly from documents, manuals, policies, and internal data.",
  },
  {
    value: "agent-builder",
    label: "Agent Builder",
    icon: BotIcon,
    video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20File%20Upload.mp4",
    title: "Agent Builder",
    body: "Design specialized agents with clear roles, model settings, tools, and guardrails from one operational workspace.",
  },
  {
    value: "artifacts",
    label: "Artifacts",
    icon: ScrollIcon,
    video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20Prompt%20Artifact.mp4",
    title: "Artifacts",
    body: "Turn conversations into structured outputs such as reports, docs, code, and reusable deliverables your team can review.",
  },
  {
    value: "skills",
    label: "Skills",
    icon: ZapIcon,
    video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20Skills.mp4",
    title: "Skills",
    body: "Extend every agent with reusable capabilities for research, summarization, web search, workflows, and internal tools.",
  },
]

export function ProductsRantAIAgents() {
  const [activeFeatureValue, setActiveFeatureValue] = useState(features[0].value)
  const activeFeature = features.find((f) => f.value === activeFeatureValue)!

  return (
    <MotionInView>
      <OutlineSection className="overflow-hidden bg-background">
        <Tabs
          value={activeFeatureValue}
          onValueChange={setActiveFeatureValue}
          className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0"
        >
          <ProductInfoPanel
            logo="/logo/RantAI Agents Dark.svg"
            logoAlt="RantAI Agents logo"
            title="RantAI Agents"
            subtitle="Deploy AI agents that handle real work, not just demos."
            className="p-8"
          >
            <TabsList className="w-full">
              {features.map((feature) => (
                  <TabsTrigger
                    key={feature.value}
                    value={feature.value}
                  >
                    <feature.icon />
                    <span className="truncate">{feature.label}</span>
                  </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex flex-1 flex-col justify-between mt-4">
              <div className="flex max-w-xl flex-col gap-3">
                <p className="leading-relaxed font-light text-muted-foreground">
                  {activeFeature.body}
                </p>
              </div>

              <ProductLink href="https://agents.rantai.dev/">
                Explore RantAI Agents
              </ProductLink>
            </div>
          </ProductInfoPanel>

          <ProductMediaPanel className="bg-linear-to-r from-background via-slate-900 to-primary">
            {features.map((feature) => (
              <TabsContent
                key={feature.value}
                value={feature.value}
                className={cn(
                  "m-0 h-full",
                  activeFeatureValue !== feature.value && "hidden",
                )}
              >
                <video
                  key={feature.video}
                  src={feature.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="h-full w-full rounded-[8px] border border-white/10 object-cover shadow-2xl shadow-black/40"
                />
              </TabsContent>
            ))}
          </ProductMediaPanel>
        </Tabs>
      </OutlineSection>
    </MotionInView>
  )
}
