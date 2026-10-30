"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { DarkPanel } from "@/components/dark-panel"
import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"
import { PillLink } from "@/components/pill-link"
import { siteConfig } from "@/lib/config"
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

const upcoming = [
  {
    name: "RantAI LLMOps",
    body: "Model lifecycle control with a sovereign registry, fine-tuning, orchestration, and evaluation.",
  },
  {
    name: "RantAI Lake",
    body: "A sovereign, AI-native lakehouse from raw data to BI-ready insight.",
  },
] as const

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

function MediaFrame({
  children,
  caption,
}: Readonly<{ children: React.ReactNode; caption: string }>) {
  return (
    <figure className="rounded-[22px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_30px_100px_-30px_rgba(92,182,249,0.35)]">
      <div className="overflow-hidden rounded-2xl bg-neutral-900">{children}</div>
      <figcaption className="flex items-center gap-2 px-3 pt-3 pb-1 font-label text-[11px] tracking-[0.14em] text-white/45 uppercase">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        {caption}
      </figcaption>
    </figure>
  )
}

function ProductHeading({
  index,
  logo,
  name,
  tagline,
}: Readonly<{ index: string; logo: string; name: string; tagline: string }>) {
  return (
    <>
      <Eyebrow className="text-white/50">Product {index}</Eyebrow>
      <div className="mt-6 flex items-center gap-3">
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

function AgentsBlock() {
  const [active, setActive] = useState(0)
  const feature = agentFeatures[active]

  return (
    <div
      id="rantai-agents"
      className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div>
        <ProductHeading
          index="01"
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
                  onClick={() => setActive(index)}
                  className="group w-full py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "text-base font-medium transition-colors",
                        selected ? "text-white" : "text-white/50 group-hover:text-white/80"
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px transition-all duration-500",
                        selected ? "w-10 bg-brand-1" : "w-4 bg-white/20"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500",
                      selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-2 text-sm leading-relaxed text-white/55">
                        {item.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <ExternalLink href="https://agents.rantai.dev/">Visit RantAI Agents</ExternalLink>
      </div>

      <MediaFrame caption={`Product demo · ${feature.title}`}>
        <DemoVideo
          src={feature.video}
          label={`RantAI Agents demo: ${feature.title}`}
          className="aspect-video w-full object-cover"
        />
      </MediaFrame>
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
          index="02"
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
        <MediaFrame caption="Product demo · Terminal UI">
          <DemoVideo
            src="/videos/rantai-claw/claw-demo.mp4"
            label="RantAIClaw terminal demo"
            className="aspect-[16/11] w-full bg-[#0b0d10] object-contain"
          />
        </MediaFrame>
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
              <h2
                id="platform-heading"
                className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
              >
                Products built to run in production.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
                Knowledge-grounded assistants for your teams, and a lean runtime
                for the autonomous agents behind them.
              </p>
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
              <div>
                <Eyebrow className="text-white/50">Coming next</Eyebrow>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                  The rest of the stack is in progress.
                </h3>
              </div>
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
              {upcoming.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xl font-medium tracking-[-0.02em]">{item.name}</p>
                    <span className="rounded-full border border-white/15 px-2.5 py-1 font-label text-[10px] tracking-[0.16em] text-white/60 uppercase">
                      In progress
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/55">{item.body}</p>
                  <Link
                    href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent(`${item.name} updates`)}`}
                    className="group mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    Notify me when available
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </MotionInView>
        </div>
    </DarkPanel>
  )
}
