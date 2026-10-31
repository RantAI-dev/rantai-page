"use client"

import { motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Database,
  Server,
  Terminal,
  type LucideIcon,
} from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"

const ease = [0.22, 1, 0.36, 1] as const

// How the four products fit together, read left to right: data comes in,
// models learn from it, the runtime runs the work, agents face your team.
const layers: {
  icon: LucideIcon
  tone: string
  layer: string
  name: string
  role: string
}[] = [
  {
    icon: Database,
    tone: "#14b8a6",
    layer: "Data",
    name: "RantAI Lake",
    role: "Brings raw data into one governed, queryable place.",
  },
  {
    icon: BrainCircuit,
    tone: "#8b5cf6",
    layer: "Models",
    name: "RantAI LLMOps",
    role: "Fine-tunes and serves models on that data.",
  },
  {
    icon: Terminal,
    tone: "#f97316",
    layer: "Runtime",
    name: "RantAIClaw",
    role: "Runs agents and scheduled skills, anywhere.",
  },
  {
    icon: Bot,
    tone: "#3b82f6",
    layer: "Applications",
    name: "RantAI Agents",
    role: "Puts it all in front of your team as agents.",
  },
]

export function ProductStack() {
  const reduce = Boolean(useReducedMotion())
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.7, ease, delay },
        }

  return (
    <section
      aria-labelledby="stack-heading"
      className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <Eyebrow className="text-neutral-500">The stack</Eyebrow>
      <SplitReveal
        id="stack-heading"
        text="One stack, from your data to action."
        className="mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
      />
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-500">
        Use one product or all four. Each works on its own and connects to the
        rest.
      </p>

      <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {layers.map((l, i) => (
          <motion.li
            key={l.name}
            {...rise(0.1 * i)}
            className="relative flex flex-col rounded-2xl bg-neutral-100 p-6"
          >
            <span
              className="grid size-11 place-items-center rounded-xl"
              style={{ background: `${l.tone}1f`, color: l.tone }}
            >
              <l.icon className="size-5" />
            </span>
            <p className="mt-8 text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
              {String(i + 1).padStart(2, "0")} · {l.layer}
            </p>
            <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-neutral-950">
              {l.name}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
              {l.role}
            </p>
            {/* Arrow to the next layer */}
            {i < layers.length - 1 && (
              <span className="absolute top-1/2 -right-[19px] z-10 hidden size-8 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-400 lg:grid">
                <ArrowRight className="size-3.5" />
              </span>
            )}
          </motion.li>
        ))}
      </ol>

      {/* The base everything runs on */}
      <motion.div
        {...rise(0.45)}
        className="mt-3 flex flex-col gap-3 rounded-2xl bg-neutral-950 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-white/10">
            <Server className="size-4" />
          </span>
          <span className="text-[15px] font-medium">Your infrastructure</span>
        </span>
        <span className="flex flex-wrap gap-2">
          {["On-premise", "Private cloud", "Air-gapped"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </span>
      </motion.div>
    </section>
  )
}
