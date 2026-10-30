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

type Capability = { icon: LucideIcon; title: string; body: string; product: string }

const rows: Capability[][] = [
  [
    { icon: DatabaseZap, title: "Knowledge Base & RAG", body: "Answers grounded in your documents and data", product: "RantAI Agents" },
    { icon: Bot, title: "Agent Builder", body: "Roles, tools, and guardrails for each agent", product: "RantAI Agents" },
    { icon: ScrollText, title: "Artifacts", body: "Reports, docs, and code from a conversation", product: "RantAI Agents" },
    { icon: Zap, title: "Skills", body: "Reusable capabilities shared across agents", product: "RantAI Agents" },
    { icon: Users, title: "Forward Deployed Engineering", body: "Engineers working inside your environment", product: "Services" },
  ],
  [
    { icon: Terminal, title: "Terminal UI", body: "Keyboard-driven sessions, no browser required", product: "RantAIClaw" },
    { icon: LayoutDashboard, title: "Web Control UI", body: "Sessions, channels, and memory in one view", product: "RantAIClaw" },
    { icon: Blocks, title: "ClawHub skills", body: "Installable skills from a shared catalog", product: "RantAIClaw" },
    { icon: Server, title: "Self-hosted runtime", body: "Runs on your own infrastructure", product: "RantAIClaw" },
  ],
]

function Card({ item, duplicate }: Readonly<{ item: Capability; duplicate: boolean }>) {
  const Icon = item.icon
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex w-[300px] shrink-0 flex-col gap-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:w-[340px]">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-100">
          <Icon aria-hidden="true" className="size-5 text-neutral-900" strokeWidth={1.75} />
        </span>
        <span className="text-xs font-medium tracking-[0.08em] text-neutral-400 uppercase">
          {item.product}
        </span>
      </div>
      <div>
        <p className="text-lg font-medium tracking-[-0.02em] text-neutral-950">{item.title}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{item.body}</p>
      </div>
    </li>
  )
}

function Row({ items, reverse }: Readonly<{ items: Capability[]; reverse?: boolean }>) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto">
      <ul
        className={cn(
          "flex w-max gap-3 pr-3 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[...items, ...items].map((item, index) => (
          <Card key={`${item.title}-${index}`} item={item} duplicate={index >= items.length} />
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
