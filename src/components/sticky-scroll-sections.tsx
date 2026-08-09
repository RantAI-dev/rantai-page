"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRightIcon,
  BlocksIcon,
  BracesIcon,
  CheckIcon,
  GaugeIcon,
  LayersIcon,
  MapPinIcon,
  NetworkIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  WaypointsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const missions = [
  {
    index: "01",
    title: "Productize real workflows",
    description:
      "Build AI systems around operational problems, not showcase demos or isolated experiments.",
  },
  {
    index: "02",
    title: "Keep teams in control",
    description:
      "Make advanced AI usable without hiding governance, human oversight, or system behavior.",
  },
  {
    index: "03",
    title: "Prove outcomes in production",
    description:
      "Take organizations from strategy to deployed systems with observable, measurable results.",
  },
  {
    index: "04",
    title: "Grow local capability",
    description:
      "Develop Indonesian AI and software talent through hands-on engineering and education.",
  },
] as const

const operatingSteps = [
  {
    icon: ScanSearchIcon,
    label: "Understand",
    value: "Operational context",
    surface: "border-feature-teal/40 bg-feature-teal/15",
    accent: "text-feature-teal",
    glow: "bg-feature-teal/20",
  },
  {
    icon: LayersIcon,
    label: "Engineer",
    value: "Production systems",
    surface: "border-feature-purple/40 bg-feature-purple/15",
    accent: "text-feature-purple",
    glow: "bg-feature-purple/20",
  },
  {
    icon: GaugeIcon,
    label: "Operate",
    value: "Measurable outcomes",
    surface: "border-feature-copper/40 bg-feature-copper/15",
    accent: "text-feature-copper",
    glow: "bg-feature-copper/20",
  },
] as const

const platforms = [
  {
    value: "agents",
    name: "RantAI Agents",
    category: "Enterprise AI agent platform",
    headline:
      "Turn organizational knowledge into agents that can do real work.",
    description:
      "Build knowledge-driven applications with RAG pipelines, reusable skills, multi-channel deployment, and human-in-the-loop workflows in one operational platform.",
    capabilities: [
      "Knowledge base and RAG",
      "Agent builder and reusable skills",
      "Multi-channel deployment",
      "Human review and control",
    ],
    image: "/products/rantai-agents-chat.png",
    imageAlt: "RantAI Agents chat and artifact workspace",
    visual: {
      backdrop: "from-feature-purple/35 via-muted/90 to-background",
      glow: "bg-feature-purple/35",
      frame: "border-feature-purple/30",
    },
    href: "https://agents.rantai.dev/",
    cta: "Open RantAI Agents",
  },
  {
    value: "claw",
    name: "RantAIClaw",
    category: "Production multi-agent runtime",
    headline: "Run autonomous agents on infrastructure you control.",
    description:
      "Deploy, control, and extend autonomous agents through a fast Rust runtime with terminal and web interfaces built for self-hosted operations.",
    capabilities: [
      "100% Rust runtime",
      "Terminal and web control",
      "Reusable agent skills",
      "Self-hosted operations",
    ],
    image: "/products/rantai-claw-console.png",
    imageAlt: "RantAIClaw web console",
    visual: {
      backdrop: "from-feature-teal/35 via-muted/90 to-background",
      glow: "bg-brand-1/30",
      frame: "border-brand-1/30",
    },
    href: "https://claw.rantai.dev/",
    cta: "Open RantAIClaw",
  },
  {
    value: "llmops",
    name: "RantAI LLMOps",
    category: "Sovereign model operations",
    headline: "Operate the model lifecycle from one sovereign control plane.",
    description:
      "Manage model registry, fine-tuning, orchestration, evaluation, and playground workflows without surrendering control of your AI stack.",
    capabilities: [
      "Model registry and routing",
      "Fine-tuning workflows",
      "Evaluation and comparison",
      "Provider-independent orchestration",
    ],
    image: "/products/analytics-screenshot.png",
    imageAlt: "RantAI LLMOps analytics interface",
    visual: {
      backdrop: "from-feature-blue/35 via-muted/90 to-background",
      glow: "bg-feature-blue/35",
      frame: "border-feature-blue/30",
    },
    href: "#contact",
    cta: "Request product updates",
  },
] as const

const differentiators = [
  {
    icon: BlocksIcon,
    tone: "border-feature-teal bg-feature-teal text-white",
    title: "Products, not just services",
    description:
      "A reusable platform roadmap creates continuity beyond any single implementation project.",
  },
  {
    icon: NetworkIcon,
    tone: "border-feature-green bg-feature-green text-white",
    title: "No model lock-in",
    description:
      "Support for 100+ LLMs lets teams change providers without rebuilding the operational layer.",
  },
  {
    icon: MapPinIcon,
    tone: "border-feature-copper bg-feature-copper text-white",
    title: "Local operating context",
    description:
      "Architecture and delivery shaped by Indonesian enterprise, government, and regulatory realities.",
  },
  {
    icon: ShieldCheckIcon,
    tone: "border-feature-purple bg-feature-purple text-white",
    title: "Production by design",
    description:
      "Security, observability, reliability, and human control are system requirements—not later additions.",
  },
  {
    icon: WaypointsIcon,
    tone: "border-feature-red bg-feature-red text-white",
    title: "One accountable lifecycle",
    description:
      "Strategy, experience design, engineering, deployment, monitoring, and support from one team.",
  },
  {
    icon: BracesIcon,
    tone: "border-feature-blue bg-feature-blue text-white",
    title: "Open foundations",
    description:
      "Auditable, portable systems built on open standards instead of opaque proprietary dependencies.",
  },
] as const

const revealViewport = { once: true, amount: 0.2 } as const

type Platform = (typeof platforms)[number]

export function StickyScrollSections() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <div className="border-y border-border bg-background">
      <VisionMissionSection reduceMotion={reduceMotion} />
      <PlatformsSection reduceMotion={reduceMotion} />
      <WhyRantaiSection reduceMotion={reduceMotion} />
    </div>
  )
}

function SectionLabel({
  index,
  children,
}: {
  index: string
  children: string
}) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
      <span>{index}</span>
      <Separator className="!w-10" />
      <span>{children}</span>
    </div>
  )
}

function VisionMissionSection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="01">Vision &amp; mission</SectionLabel>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Our vision
            </p>
            <h2 className="mt-5 max-w-4xl text-4xl leading-[0.98] font-medium tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Operational intelligence, built for the real world.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              To be Indonesia&apos;s leading AI products company—enabling
              government and enterprise to operate intelligently through
              production-grade AI platforms.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,var(--feature-purple),transparent_34%),radial-gradient(circle_at_100%_100%,var(--feature-teal),transparent_40%)] opacity-15" />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              animate={reduceMotion ? undefined : { x: ["-120%", "420%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "linear",
              }}
            />
            <div className="relative flex items-center justify-between border-b border-border px-5 py-4 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              <span>Operating thesis</span>
              <Badge variant="outline">RantAI / 2026</Badge>
            </div>
            <div className="relative flex flex-col gap-0 px-5 py-3">
              {operatingSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={revealViewport}
                  transition={{
                    duration: 0.5,
                    delay: reduceMotion ? 0 : 0.18 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative grid grid-cols-[2.5rem_1fr] items-center gap-3 overflow-hidden border-b border-border py-5 last:border-b-0"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-y-2 -left-12 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                      step.glow
                    )}
                  />
                  <motion.div
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.08, rotate: -4 }
                    }
                    className={cn(
                      "relative flex size-9 items-center justify-center rounded-md border shadow-lg shadow-black/20",
                      step.surface
                    )}
                  >
                    <step.icon className={cn("size-4", step.accent)} />
                  </motion.div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {step.label}
                      </p>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                        {step.value}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-[10px] font-medium",
                        step.accent
                      )}
                    >
                      0{index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-20">
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Our mission
          </p>
          <div className="mt-5 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-4">
            {missions.map((mission) => (
              <motion.article
                key={mission.index}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : Number(mission.index) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex min-h-72 flex-col border-r border-b border-border p-6 sm:p-7"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {mission.index}
                </span>
                <h3 className="mt-auto text-xl font-medium tracking-tight text-foreground">
                  {mission.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {mission.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlatformsSection({ reduceMotion }: { reduceMotion: boolean }) {
  const storyRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activePlatform = platforms[activeIndex]

  useEffect(() => {
    function updateActivePlatform() {
      frameRef.current = null

      const story = storyRef.current
      if (!story) return

      const storyTop = window.scrollY + story.getBoundingClientRect().top
      const scrollableDistance = Math.max(
        1,
        story.offsetHeight - window.innerHeight
      )
      const progress = Math.min(
        0.9999,
        Math.max(0, (window.scrollY - storyTop) / scrollableDistance)
      )
      const nextIndex = Math.floor(progress * platforms.length)

      if (activeIndexRef.current === nextIndex) return

      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    }

    function scheduleUpdate() {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(updateActivePlatform)
    }

    updateActivePlatform()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function handlePlatformChange(value: string) {
    const nextIndex = platforms.findIndex(
      (platform) => platform.value === value
    )
    const story = storyRef.current

    if (nextIndex < 0 || !story) return

    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)

    const storyTop = window.scrollY + story.getBoundingClientRect().top
    const scrollableDistance = Math.max(
      0,
      story.offsetHeight - window.innerHeight
    )
    const chapterPosition = (nextIndex + 0.5) / platforms.length

    window.scrollTo({
      top: storyTop + scrollableDistance * chapterPosition,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <section className="border-t border-border bg-background px-5 pt-24 sm:px-8 sm:pt-32 lg:px-10">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        <SectionLabel index="02">Our platforms</SectionLabel>
        <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="max-w-4xl text-4xl leading-[0.98] font-medium tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Three platforms.
            <br />
            One intelligence layer.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            A connected product stack for knowledge, agent execution, and model
            operations—designed to move AI from experimentation into daily work.
          </p>
        </div>
      </motion.div>

      <div
        ref={storyRef}
        className="relative mx-auto mt-12 h-[260svh] max-w-7xl"
      >
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center py-5 sm:py-8">
          <Tabs
            value={activePlatform.value}
            onValueChange={handlePlatformChange}
            className="w-full gap-0"
          >
            <TabsList variant="line" className="grid h-auto w-full grid-cols-3">
              {platforms.map((platform) => (
                <TabsTrigger
                  key={platform.value}
                  value={platform.value}
                  className="h-auto min-w-0 py-4 after:hidden"
                >
                  <span className="truncate">{platform.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activePlatform.value}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: reduceMotion ? 0 : 0.42 }}
              >
                <TabsContent
                  value={activePlatform.value}
                  forceMount
                  className="mt-6"
                >
                  <PlatformPanel
                    platform={activePlatform}
                    reduceMotion={reduceMotion}
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

function PlatformPanel({
  platform,
  reduceMotion,
}: {
  platform: Platform
  reduceMotion: boolean
}) {
  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-background lg:grid-cols-[0.88fr_1.12fr]">
      <div className="flex flex-col p-6 sm:p-8 lg:min-h-125 lg:p-9">
        <p className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
          {platform.category}
        </p>

        <h3 className="mt-8 text-3xl leading-tight font-medium tracking-[-0.03em] text-foreground sm:text-4xl lg:mt-10">
          {platform.headline}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:mt-5">
          {platform.description}
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:mt-8 lg:gap-3">
          {platform.capabilities.map((capability) => (
            <div
              key={capability}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
            >
              <CheckIcon className="size-3.5 text-foreground" />
              {capability}
            </div>
          ))}
        </div>

        <Button asChild variant="outline" className="mt-9 w-fit lg:mt-auto">
          <Link
            href={platform.href}
            {...(platform.href.startsWith("http")
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            {platform.cta}
            <ArrowUpRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div
        className={cn(
          "relative min-h-40 overflow-hidden border-t border-border bg-gradient-to-br sm:min-h-72 lg:min-h-125 lg:border-t-0 lg:border-l",
          platform.visual.backdrop
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
        <motion.div
          aria-hidden
          className={cn(
            "absolute -top-20 -right-16 size-72 rounded-full blur-3xl",
            platform.visual.glow
          )}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -18, 0],
                  y: [0, 14, 0],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(
            "absolute inset-4 overflow-hidden rounded-lg border bg-background/65 shadow-2xl shadow-black/50 sm:inset-7 lg:inset-8",
            platform.visual.frame
          )}
          animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={platform.image}
            alt={platform.imageAlt}
            fill
            loading="eager"
            unoptimized
            className="object-contain object-center p-2 sm:p-3"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </motion.div>
      </div>
    </div>
  )
}

function WhyRantaiSection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="border-t border-border px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="03">Why RantAI</SectionLabel>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-4xl leading-[0.98] font-medium tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Own the stack.
            <br />
            Move faster.
          </motion.h2>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:pb-2"
          >
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              RantAI combines product continuity, open infrastructure, and local
              delivery experience so organizations can operate AI without giving
              up control of their stack.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge variant="outline">100+ LLM models</Badge>
              <Badge variant="outline">Open standards</Badge>
              <Badge variant="outline">Indonesia-based team</Badge>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex min-h-80 flex-col border-r border-b border-border p-6 transition-colors hover:bg-card sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-md border shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110",
                    item.tone
                  )}
                >
                  <item.icon className="size-5" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
