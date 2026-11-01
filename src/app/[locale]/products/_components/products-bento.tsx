"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import {
  Bot,
  BrainCircuit,
  Database,
  Server,
  Terminal,
  type LucideIcon,
} from "lucide-react"

import {
  ProductLogo,
  ProductTile,
  type ProductId,
} from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

// Products hero visual: an asymmetric bento of the four products, with
// their real screens and demo videos. Tiles at the right and bottom run off
// the desk on purpose; the name labels stay in view. On phones the bento
// fits the desk whole and drops the infrastructure tile.

const ease = [0.22, 1, 0.36, 1] as const

type P = {
  id: string
  name: string
  icon: LucideIcon
  tone: string
  src?: string
  video?: string
}
const products: P[] = [
  {
    id: "agents",
    name: "RantAI Agents",
    icon: Bot,
    tone: "#3b82f6",
    src: "/products/rantai-agents-chat.webp",
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    id: "claw",
    name: "RantAI Claw",
    icon: Terminal,
    tone: "#f97316",
    src: "/products/rantai-claw-console.webp",
    video: "/videos/rantai-claw/claw-demo.mp4",
  },
  {
    id: "lake",
    name: "RantAI Lakehouse",
    icon: Database,
    tone: "#14b8a6",
    src: "/products/lake-dashboard.jpg",
  },
  { id: "llmops", name: "RantAI LLMOps", icon: BrainCircuit, tone: "#8b5cf6" },
]

/** What a product shows on screen: its demo video, or a screenshot. */
function Screen({ p, video = true }: Readonly<{ p: P; video?: boolean }>) {
  if (video && p.video)
    return (
      <video
        src={p.video}
        autoPlay
        muted
        loop
        playsInline
        className="size-full object-cover object-top-left"
      />
    )
  return (
    <Image
      src={p.src!}
      alt=""
      fill
      sizes="(min-width: 1024px) 45vw, 100vw"
      className="object-cover object-top-left"
    />
  )
}

function Badge({ p }: Readonly<{ p: P }>) {
  return <ProductTile id={p.id as ProductId} />
}

/* 6 · Bento, mixed sizes: one big live tile, a tall, a wide and a stat - */
function Tile({
  p,
  className,
  delay,
  children,
}: Readonly<{
  p: P
  className?: string
  delay: number
  children: React.ReactNode
}>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_20px_50px_-36px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
        {children}
      </div>
      {/* Just the logo; the name slides out on hover */}
      <span
        aria-label={p.name}
        className="absolute top-3 left-3 flex items-center rounded-full bg-white/95 p-1 text-[12px] font-medium text-neutral-900 shadow-sm ring-1 ring-black/5"
      >
        <Badge p={p} />
        <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr]">
          <span className="overflow-hidden whitespace-nowrap">
            <span className="block pr-2 pl-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-100">
              {p.name}
            </span>
          </span>
        </span>
      </span>
    </motion.div>
  )
}

function Rise({
  delay,
  className,
  children,
}: Readonly<{ delay: number; className?: string; children: React.ReactNode }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className={cn(
        "overflow-hidden rounded-2xl shadow-[0_20px_50px_-36px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

/**
 * Two columns cut at different heights, so no gutter runs straight across:
 * left is a big live tile over a split row, right is a tall tile, a stat
 * and an infrastructure tile.
 */
function BentoMixed() {
  const t = useTranslations("products.bento")
  const [agents, claw, lake, llmops] = products
  return (
    <div className="absolute inset-0 flex gap-2.5 sm:-right-16 sm:-bottom-14 sm:gap-3">
      {/* Left column */}
      <div className="flex w-[56%] flex-col gap-2.5 sm:w-[60%] sm:gap-3">
        <Tile p={agents} className="basis-[58%]" delay={0.35}>
          <Screen p={agents} />
        </Tile>
        <Tile p={lake} className="flex-1" delay={0.55}>
          <Image
            src="/products/lake-dashboard.jpg"
            alt=""
            fill
            sizes="35vw"
            className="object-cover object-[0%_18%]"
          />
        </Tile>
      </div>

      {/* Right column, cut at different heights */}
      <div className="flex flex-1 flex-col gap-2.5 sm:gap-3">
        <Tile p={claw} className="basis-[52%] sm:basis-[40%]" delay={0.45}>
          <video
            src={claw.video}
            autoPlay
            muted
            loop
            playsInline
            className="size-full object-cover object-left"
          />
        </Tile>
        <Rise
          delay={0.6}
          className="flex flex-1 flex-col justify-between bg-[#8b5cf6] p-3.5 text-white sm:flex-initial sm:basis-[24%] sm:p-4"
        >
          <span className="flex items-center gap-2 text-[12px] leading-tight font-medium text-white/85">
            <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/15">
              <ProductLogo id="llmops" variant="dark" className="h-3" />
            </span>
            {llmops.name}
          </span>
          <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-[32px] leading-none font-medium tracking-[-0.03em] tabular-nums">
              +18%
            </span>
            <span className="text-[11.5px] text-white/75">
              {t("afterFineTuning")}
            </span>
          </span>
        </Rise>
        <Rise
          delay={0.75}
          className="hidden flex-1 flex-col justify-between bg-neutral-950 p-4 text-white sm:flex"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-white/10">
            <Server className="size-4" />
          </span>
          <span>
            <span className="block text-[15px] font-medium">
              {t("infraTitle")}
            </span>
            <span className="mt-2 flex flex-wrap gap-1.5">
              {(t.raw("infra") as string[]).map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/70"
                >
                  {label}
                </span>
              ))}
            </span>
          </span>
        </Rise>
      </div>
    </div>
  )
}

export { BentoMixed as ProductsHeroVisual }
