import {
  Blocks,
  Bot,
  DatabaseZap,
  LayoutDashboard,
  ScrollText,
  Server,
  Terminal,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { cn } from "@/lib/utils"

type Capability = {
  icon: LucideIcon
  title: string
  body: string
  product: string
}

const rows: Capability[][] = [
  [
    {
      icon: DatabaseZap,
      title: "Knowledge Base & RAG",
      body: "Answers grounded in your documents and data",
      product: "RantAI Agents",
    },
    {
      icon: Bot,
      title: "Agent Builder",
      body: "Roles, tools, and guardrails for each agent",
      product: "RantAI Agents",
    },
    {
      icon: ScrollText,
      title: "Artifacts",
      body: "Reports, docs, and code from a conversation",
      product: "RantAI Agents",
    },
    {
      icon: Zap,
      title: "Skills",
      body: "Reusable capabilities shared across agents",
      product: "RantAI Agents",
    },
    {
      icon: Users,
      title: "Forward Deployed Engineering",
      body: "Engineers working inside your environment",
      product: "Services",
    },
  ],
  [
    {
      icon: Terminal,
      title: "Terminal UI",
      body: "Keyboard-driven sessions, no browser required",
      product: "RantAI Claw",
    },
    {
      icon: LayoutDashboard,
      title: "Web Control UI",
      body: "Sessions, channels, and memory in one view",
      product: "RantAI Claw",
    },
    {
      icon: Blocks,
      title: "ClawHub skills",
      body: "Installable skills from a shared catalog",
      product: "RantAI Claw",
    },
    {
      icon: Server,
      title: "Self-hosted runtime",
      body: "Runs on your own infrastructure",
      product: "RantAI Claw",
    },
  ],
]

// One colour per capability, from the site's feature palette.
const tones: Record<string, string> = {
  "Knowledge Base & RAG": "#3b82f6",
  "Agent Builder": "#8b5cf6",
  Artifacts: "#f59e0b",
  Skills: "#ec4899",
  "Forward Deployed Engineering": "#10b981",
  "Terminal UI": "#0ea5e9",
  "Web Control UI": "#6366f1",
  "ClawHub skills": "#f97316",
  "Self-hosted runtime": "#14b8a6",
}
const toneFor = (title: string) => tones[title] ?? "#64748b"

function Card({
  item,
  duplicate,
}: Readonly<{ item: Capability; duplicate: boolean }>) {
  const Icon = item.icon
  const tone = toneFor(item.title)
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex w-[300px] shrink-0 flex-col gap-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:w-[340px]"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: `${tone}1f`, color: tone }}
        >
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
        </span>
        <span className="text-xs font-medium tracking-[0.08em] text-neutral-400 uppercase">
          {item.product}
        </span>
      </div>
      <div>
        <p className="text-lg font-medium tracking-[-0.02em] text-neutral-950">
          {item.title}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
          {item.body}
        </p>
      </div>
    </li>
  )
}

function Row({
  items,
  reverse,
}: Readonly<{ items: Capability[]; reverse?: boolean }>) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto">
      <ul
        className={cn(
          "flex w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[...items, ...items].map((item, index) => (
          <Card
            key={`${item.title}-${index}`}
            item={item}
            duplicate={index >= items.length}
          />
        ))}
      </ul>
    </div>
  )
}

export function CapabilityMarquee() {
  return (
    <section aria-labelledby="capabilities-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14">
        <Eyebrow className="text-neutral-500">Capabilities</Eyebrow>
        <SplitReveal
          id="capabilities-heading"
          text="What you can build with RantAI."
          className="mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
        />
      </div>
      <div className="mt-14 space-y-3">
        <Row items={rows[0]} />
        <Row items={rows[1]} reverse />
      </div>
    </section>
  )
}
