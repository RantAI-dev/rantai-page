"use client"

import { useState } from "react"
import { BlocksIcon, LayoutDashboardIcon, TerminalIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { cn } from "@/lib/utils"
import { ProductInfoPanel, ProductLink, ProductMediaPanel } from "./products-showcase"

const clawVideo =
  "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-claw/claw-demo.mp4"

const features = [
  {
    value: "tui",
    label: "TUI",
    icon: TerminalIcon,
    video: clawVideo,
    title: "Terminal UI",
    body: "Chat with your agents straight from the terminal. Launch the interactive TUI for a fast, keyboard-driven session — no browser required, fully self-hosted.",
  },
  {
    value: "web-ui",
    label: "Web UI",
    icon: LayoutDashboardIcon,
    video: clawVideo,
    title: "Web Control UI",
    body: "Run, monitor, and configure agents from the browser. The gateway control plane surfaces live sessions, channels, memory, and status in a single dashboard.",
  },
  {
    value: "skills",
    label: "Skills",
    icon: BlocksIcon,
    video: clawVideo,
    title: "Skills",
    body: "Extend agents with reusable, domain-specific skills. Bundle tools and instructions into installable recipes, or pull ready-made ones from the ClawHub marketplace.",
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
                  preload="none"
                  className="h-full w-full rounded-[8px] border border-white/10 object-cover shadow-2xl shadow-black/40"
                />
              </TabsContent>
            ))}
          </ProductMediaPanel>

          <ProductInfoPanel
            logo="/logo/RantAIClaw Dark.svg"
            logoAlt="RantAIClaw logo"
            title="RantAIClaw"
            subtitle="A production multi-agent runtime in 100% Rust — run, control, and extend autonomous agents your way."
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
