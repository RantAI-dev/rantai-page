"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Database, Lock, Workflow, type LucideIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import { useEffect, useRef, useState } from "react"

import { DarkPanel } from "@/components/dark-panel"
import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { MotionInView } from "@/components/motion-in-view"
import { PillLink } from "@/components/pill-link"
import { cn } from "@/lib/utils"

const agentFeatures = [
  {
    title: "Knowledge Base & RAG",
    body: "Agents retrieve the right answer from your documents, manuals, policies, and internal data.",
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    title: "Agent Builder",
    body: "Design specialized agents with clear roles, model settings, tools, and guardrails.",
    video: "/videos/rantai-agents/file-upload.mp4",
  },
  {
    title: "Artifacts",
    body: "Turn conversations into reports, documents, and code your team can review.",
    video: "/videos/rantai-agents/prompt-artifact.mp4",
  },
  {
    title: "Skills",
    body: "Extend every agent with reusable capabilities for research, search, and internal tools.",
    video: "/videos/rantai-agents/skills.mp4",
  },
] as const

const clawFeatures = [
  {
    title: "Terminal UI",
    body: "A fast, keyboard-driven session with your agents. No browser required.",
  },
  {
    title: "Web Control UI",
    body: "Monitor live sessions, channels, memory, and status from one dashboard.",
  },
  {
    title: "Skills & ClawHub",
    body: "Bundle tools and instructions into installable skills, or pull ready-made ones.",
  },
] as const

const moreProducts: {
  name: string
  body: string
  icon: LucideIcon
  href: string | null
  image: string | null
}[] = [
  {
    name: "RantAI LLMOps",
    body: "Model lifecycle control with a sovereign registry, fine-tuning, orchestration, and evaluation.",
    icon: Workflow,
    href: null,
    image: null,
  },
  {
    name: "RantAI Lake",
    body: "A sovereign, AI-native lakehouse from raw data to BI-ready insight.",
    icon: Database,
    href: null,
    image: null,
  },
]

function DemoVideo({
  src,
  label,
  className,
}: Readonly<{ src: string; label: string; className?: string }>) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { margin: "200px 0px" })
  const reduce = Boolean(useReducedMotion())

  useEffect(() => {
    const video = ref.current
    if (!video || reduce) return
    if (inView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView, reduce, src])

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      muted
      loop
      playsInline
      preload={reduce ? "metadata" : "none"}
      controls={reduce}
      aria-label={label}
      className={className}
    />
  )
}

function BrowserFrame({
  children,
  url,
}: Readonly<{ children: React.ReactNode; url: string }>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span aria-hidden="true" className="flex w-12 shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 text-xs text-white/55">
          <Lock aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate">{url}</span>
        </span>
        <span aria-hidden="true" className="w-12 shrink-0" />
      </div>
      {children}
    </div>
  )
}

function ProductHeading({
  logo,
  name,
  tagline,
}: Readonly<{ logo: string; name: string; tagline: string }>) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5">
          <Image src={logo} alt="" width={44} height={44} className="h-5 w-auto" />
        </span>
        <h3 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          {name}
        </h3>
      </div>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
        {tagline}
      </p>
    </>
  )
}

function ExternalLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <PillLink href={href} icon="external" newTab className="mt-8">
      {children}
    </PillLink>
  )
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return isDesktop
}

function AgentsBlock() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const segmentProgress = useMotionValue(1)
  const reduce = Boolean(useReducedMotion())
  const isDesktop = useIsDesktop()
  const scrollDriven = isDesktop && !reduce
  const feature = agentFeatures[active]
  const count = agentFeatures.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!scrollDriven) return
    const position = Math.min(Math.max(value, 0), 0.9999) * count
    const index = Math.floor(position)
    setActive(index)
    segmentProgress.set(position - index)
  })

  const select = (index: number) => {
    const container = containerRef.current
    if (!scrollDriven || !container) {
      setActive(index)
      return
    }
    const top = container.getBoundingClientRect().top + window.scrollY
    const span = container.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (span * (index + 0.5)) / count, behavior: "smooth" })
  }

  return (
    <div
      ref={containerRef}
      id="rantai-agents"
      className="scroll-mt-24 lg:h-[300vh]"
    >
      <div className="grid items-center gap-10 lg:sticky lg:top-[max(6rem,calc(50svh-20rem))] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <ProductHeading
            logo="/logo/RantAI Agents Dark.svg"
            name="RantAI Agents"
            tagline="Deploy AI agents that handle real work, not just demos."
          />
          <ul className="mt-8 border-t border-white/10" aria-label="RantAI Agents capabilities">
            {agentFeatures.map((item, index) => {
              const selected = index === active
              return (
                <li key={item.title} className="border-b border-white/10">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(index)}
                    className="group w-full py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          "text-base font-medium transition-colors duration-300",
                          selected ? "text-white" : "text-white/50 group-hover:text-white/80"
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative h-px w-10 overflow-hidden bg-white/20"
                      >
                        {selected && (
                          <motion.span
                            className="absolute inset-0 origin-left bg-brand-1"
                            style={{ scaleX: scrollDriven ? segmentProgress : 1 }}
                          />
                        )}
                      </span>
                    </span>
                    <AnimatePresence initial={false}>
                      {selected && (
                        <motion.span
                          className="block overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="block pt-2 text-sm leading-relaxed text-white/55">
                            {item.body}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              )
            })}
          </ul>
          <ExternalLink href="https://agents.rantai.dev/">Visit RantAI Agents</ExternalLink>
        </div>

        <BrowserFrame url="agents.rantai.dev">
          <div className="relative aspect-video w-full">
            <AnimatePresence initial={false}>
              <motion.div
                key={feature.video}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <DemoVideo
                  src={feature.video}
                  label={`RantAI Agents demo: ${feature.title}`}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </BrowserFrame>
      </div>
    </div>
  )
}

function ClawBlock() {
  return (
    <div
      id="rantaiclaw"
      className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
    >
      <div className="lg:order-2">
        <ProductHeading
          logo="/logo/RantAIClaw Dark.svg"
          name="RantAIClaw"
          tagline="A lightweight multi-agent runtime written in Rust. Run, control, and extend autonomous agents your way."
        />
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {clawFeatures.map((item) => (
            <li key={item.title} className="bg-black p-5">
              <p className="text-base font-medium">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.body}</p>
            </li>
          ))}
        </ul>
        <ExternalLink href="https://claw.rantai.dev/">Visit RantAIClaw</ExternalLink>
      </div>

      <div className="lg:order-1">
        <BrowserFrame url="claw.rantai.dev">
          <DemoVideo
            src="/videos/rantai-claw/claw-demo.mp4"
            label="RantAIClaw terminal demo"
            className="aspect-[16/11] w-full bg-[#0b0d10] object-contain"
          />
        </BrowserFrame>
      </div>
    </div>
  )
}

export function ProductShowcase({
  showIntro = true,
  showAllProductsLink = true,
}: Readonly<{ showIntro?: boolean; showAllProductsLink?: boolean }>) {
  return (
    <DarkPanel
      id="platform"
      aria-label={showIntro ? undefined : "RantAI products"}
      aria-labelledby={showIntro ? "platform-heading" : undefined}
      className="scroll-mt-20"
    >
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-36">
          {showIntro && (
            <MotionInView className="mx-auto mb-20 max-w-3xl text-center lg:mb-28">
              <Eyebrow className="text-white/50">Platform</Eyebrow>
              <SplitReveal
                id="platform-heading"
                text="Products built to run in production."
                className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
              />
            </MotionInView>
          )}

          <div className="space-y-28 lg:space-y-36">
            <MotionInView>
              <AgentsBlock />
            </MotionInView>
            <MotionInView>
              <ClawBlock />
            </MotionInView>
          </div>

          <MotionInView className="mt-28 border-t border-white/10 pt-12 lg:mt-36">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                More from the RantAI stack
              </h3>
              {showAllProductsLink && (
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  All products
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {moreProducts.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.name}
                    className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="relative aspect-[16/10] border-b border-white/10 bg-neutral-900">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={`${item.name} interface`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,182,249,0.18),transparent_65%)]"
                        >
                          <span className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                            <Icon className="size-7 text-white/60" strokeWidth={1.5} />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <p className="text-xl font-medium tracking-[-0.02em]">{item.name}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/55">{item.body}</p>
                      {item.href && (
                        <PillLink href={item.href} icon="external" newTab className="mt-6 self-start">
                          Visit {item.name}
                        </PillLink>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </MotionInView>
        </div>
    </DarkPanel>
  )
}
