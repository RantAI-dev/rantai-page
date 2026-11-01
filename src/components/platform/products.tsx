"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef } from "react"
import { useInView, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

// The four RantAI products shown in the homepage platform reel, and the
// media for each (a demo video, or a pipeline diagram until one exists).
// Text lives in messages/<locale>/platform.json under `products.<id>`.

type ProductBase = {
  id: "agents" | "claw" | "llmops" | "lake"
  name: string
  href: string
  video?: string
  videoFit?: "cover" | "contain"
  /** A product screenshot, used when there is no demo video yet. */
  image?: string
  /** Whether the product has a pipeline diagram (steps come from messages). */
  hasFlow?: boolean
}

export type Product = ProductBase & {
  layer: string
  tagline: string
  features: string[]
  flow?: string[]
}

/** Names, links and media; language-independent. */
export const products: ProductBase[] = [
  {
    id: "agents",
    name: "RantAI Agents",
    href: "https://agents.rantai.dev/",
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    id: "claw",
    name: "RantAI Claw",
    href: "https://claw.rantai.dev/",
    video: "/videos/rantai-claw/claw-demo.mp4",
    videoFit: "contain",
  },
  {
    id: "llmops",
    name: "RantAI LLMOps",
    href: "https://llmops.rantai.dev/",
    hasFlow: true,
  },
  {
    id: "lake",
    name: "RantAI Lakehouse",
    href: "https://lakehouse.rantai.dev/",
    image: "/products/lake-dashboard.jpg",
    hasFlow: true,
  },
]

/** The products with their text in the current language. */
export function useProducts(): Product[] {
  const t = useTranslations("platform.products")
  return useMemo(
    () =>
      products.map((p) => ({
        ...p,
        layer: t(`${p.id}.layer`),
        tagline: t(`${p.id}.tagline`),
        features: t.raw(`${p.id}.features`) as string[],
        flow: p.hasFlow ? (t.raw(`${p.id}.flow`) as string[]) : undefined,
      })),
    [t]
  )
}

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
  const t = useTranslations("platform.products")
  if (product.video) return <Video src={product.video} fit={product.videoFit} />
  if (product.image)
    return (
      <Image
        src={product.image}
        alt={t("imageAlt", { name: product.name })}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-top-left"
      />
    )
  return <Flow steps={product.flow ?? []} compact={compact} />
}
