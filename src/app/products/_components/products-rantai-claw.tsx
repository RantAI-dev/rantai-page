"use client"

import { useState } from "react"
import { DownloadIcon, GlobeIcon, LayersIcon, WorkflowIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { cn } from "@/lib/utils"
import { ProductInfoPanel, ProductLink, ProductMediaPanel } from "./products-showcase"

const clawVideo =
  "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-claw/claw-demo.mp4"

const features = [
  {
    value: "extract",
    label: "Extract",
    icon: GlobeIcon,
    video: clawVideo,
    title: "Web Extraction",
    body: "Pull clean, reliable data from any website at scale — pages, listings, documents, and dynamic content rendered just like a real browser.",
  },
  {
    value: "structure",
    label: "Structure",
    icon: LayersIcon,
    video: clawVideo,
    title: "Structure & Normalize",
    body: "Transform messy web content into clean, typed, and consistent records ready to use across your applications and pipelines.",
  },
  {
    value: "workflows",
    label: "Workflows",
    icon: WorkflowIcon,
    video: clawVideo,
    title: "Automated Workflows",
    body: "Chain extraction, transformation, and actions into repeatable workflows that run on schedule or trigger from your systems.",
  },
  {
    value: "export",
    label: "Export",
    icon: DownloadIcon,
    video: clawVideo,
    title: "Export & Integrate",
    body: "Deliver structured data straight into your stack via APIs, webhooks, and exports — JSON, CSV, databases, and more.",
  },
]

export function ProductsRantAIClaw() {
  const [activeFeatureValue, setActiveFeatureValue] = useState(features[0].value)
  const activeFeature = features.find((f) => f.value === activeFeatureValue)!

  return (
    <MotionInView>
      <OutlineSection className="overflow-hidden bg-background">
        <Tabs
          value={activeFeatureValue}
          onValueChange={setActiveFeatureValue}
          className="grid grid-cols-1 gap-0 lg:grid-cols-[3fr_2fr]"
        >
          <ProductMediaPanel className="bg-linear-to-l from-background via-orange-950 to-orange-800">
            {features.map((feature) => (
              <TabsContent
                key={feature.value}
                value={feature.value}
                forceMount
                className={cn(
                  "m-0 h-full",
                  activeFeatureValue !== feature.value && "hidden"
                )}
              >
                <video
                  key={feature.video}
                  src={feature.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full rounded-[8px] border border-white/10 object-cover shadow-2xl shadow-black/40"
                />
              </TabsContent>
            ))}
          </ProductMediaPanel>

          <ProductInfoPanel
            logo="/logo/RantAIClaw Dark.svg"
            logoAlt="RantAIClaw logo"
            title="RantAIClaw"
            subtitle="Extract, structure, and act on web data — at enterprise scale."
            className="p-8"
          >
            <TabsList className="w-full">
              {features.map((feature) => (
                <TabsTrigger key={feature.value} value={feature.value}>
                  <feature.icon />
                  <span className="truncate">{feature.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 flex flex-1 flex-col justify-between">
              <div className="flex max-w-xl flex-col gap-3">
                <p className="leading-relaxed font-light text-muted-foreground">
                  {activeFeature.body}
                </p>
              </div>

              <ProductLink href="https://claw.rantai.dev/">
                Explore RantAIClaw
              </ProductLink>
            </div>
          </ProductInfoPanel>
        </Tabs>
      </OutlineSection>
    </MotionInView>
  )
}
