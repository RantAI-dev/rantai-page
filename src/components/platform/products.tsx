"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

// The four RantAI products shown in the homepage platform reel, and the
// media for each (a demo video, or a pipeline diagram until one exists).

export type Product = {
  id: string
  name: string
  layer: string
  tagline: string
  href: string
  features: string[]
  video?: string
  videoFit?: "cover" | "contain"
  /** A product screenshot, used when there is no demo video yet. */
  image?: string
  flow?: string[]
}

export const products: Product[] = [
  {
    id: "agents",
    name: "RantAI Agents",
    layer: "Applications",
    tagline: "Deploy AI agents that handle real work, not just demos.",
    href: "https://agents.rantai.dev/",
    features: ["Knowledge base & RAG", "Agent builder", "Artifacts", "Skills"],
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    id: "claw",
    name: "RantAI Claw",
    layer: "Runtime",
    tagline: "A lightweight multi-agent runtime written in Rust.",
    href: "https://claw.rantai.dev/",
    features: ["Terminal UI", "Web control UI", "Skills & ClawHub"],
    video: "/videos/rantai-claw/claw-demo.mp4",
    videoFit: "contain",
  },
  {
    id: "llmops",
    name: "RantAI LLMOps",
    layer: "Models",
    tagline: "Fine-tune, evaluate, and serve models on hardware you control.",
    href: "https://llmops.rantai.dev/",
    features: [
      "Fine-tune through the UI",
      "Evaluate on your own test set",
      "OpenAI-compatible API",
    ],
    flow: ["Dataset", "Fine-tune", "Evaluate", "Serve"],
  },
  {
    id: "lake",
    name: "RantAI Lakehouse",
    layer: "Data",
    tagline:
      "A sovereign, AI-native lakehouse from raw data to BI-ready insight.",
    href: "https://lakehouse.rantai.dev/",
    features: ["Runs on your infrastructure", "AI-native", "BI-ready output"],
    image: "/products/lake-dashboard.jpg",
    flow: ["Raw data", "Lakehouse", "BI-ready insight"],
  },
]

/* ----------------------------- Media ----------------------------- */

function Video({
  src,
  fit = "cover",
}: Readonly<{ src: string; fit?: "cover" | "contain" }>) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { margin: "200px 0px" })
  const reduce = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, reduce, src])
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className={cn(
        "size-full",
        fit === "contain"
          ? "bg-[#0b0d10] object-contain"
          : "object-cover object-top"
      )}
    />
  )
}

/** A product's pipeline as nodes on a line, with a pulse running along it. */
function Flow({
  steps,
  compact = false,
}: Readonly<{ steps: string[]; compact?: boolean }>) {
  return (
    <div className="relative flex size-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,rgb(255_255_255/0.06),transparent_70%)] px-6">
      <style>{`@keyframes flow-pulse { from { left: 0% } to { left: 100% } }`}</style>
      <div
        className={cn(
          "relative flex w-full max-w-xl items-center justify-between",
          compact && "max-w-sm"
        )}
      >
        <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-white/15">
          <span className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 [animation:flow-pulse_2.6s_cubic-bezier(0.45,0,0.2,1)_infinite] rounded-full bg-white shadow-[0_0_12px_2px_rgb(255_255_255/0.6)] motion-reduce:hidden" />
        </div>
        {steps.map((step, i) => (
          <div
            key={step}
            className={cn(
              "relative rounded-xl border border-white/15 bg-neutral-950 text-center font-medium text-white/85",
              compact ? "px-2.5 py-1.5 text-[11px]" : "px-4 py-2.5 text-sm",
              i === steps.length - 1 && "border-white/40 text-white"
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Media({
  product,
  compact,
}: Readonly<{ product: Product; compact?: boolean }>) {
  if (product.video) return <Video src={product.video} fit={product.videoFit} />
  if (product.image)
    return (
      <Image
        src={product.image}
        alt={`${product.name} interface`}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-top-left"
      />
    )
  return <Flow steps={product.flow ?? []} compact={compact} />
}
