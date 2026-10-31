"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  Bot,
  BrainCircuit,
  Check,
  Database,
  MapPin,
  Terminal,
} from "lucide-react"

import { cn } from "@/lib/utils"

// One small product fragment per "Why RantAI" point, in the same card style
// as the platform demos. Content is illustrative.

const ease = [0.22, 1, 0.36, 1] as const
const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.04)]"

function Rise({
  delay = 0,
  className,
  children,
}: Readonly<{
  delay?: number
  className?: string
  children: React.ReactNode
}>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/* 01 · Products, not just services ----------------------------------- */
function OwnProducts() {
  const items = [
    { icon: Bot, tone: "#3b82f6", name: "RantAI Agents", v: "v3.2" },
    { icon: Terminal, tone: "#f97316", name: "RantAIClaw", v: "v1.8" },
    { icon: BrainCircuit, tone: "#8b5cf6", name: "RantAI LLMOps", v: "v2.0" },
    { icon: Database, tone: "#14b8a6", name: "RantAI Lake", v: "v1.4" },
  ]
  return (
    <Rise className={cn(card, "w-full max-w-sm p-5")}>
      <p className="text-[12px] font-medium text-neutral-500">
        Built and maintained by RantAI
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <motion.li
            key={it.name}
            className="flex items-center gap-3 text-[13px]"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <span
              className="grid size-8 place-items-center rounded-lg"
              style={{ background: `${it.tone}1f`, color: it.tone }}
            >
              <it.icon className="size-4" />
            </span>
            <span className="flex-1 font-medium">{it.name}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500 tabular-nums">
              {it.v}
            </span>
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

/* 02 · No vendor lock-in --------------------------------------------- */
const models = ["GPT-4o", "Claude", "Llama 3.1", "Qwen 2.5"]
function ModelSwitch() {
  const reduce = useReducedMotion()
  const [at, setAt] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setAt((v) => (v + 1) % models.length), 1600)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <Rise className={cn(card, "w-full max-w-sm p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-neutral-500">Model</p>
        <span className="flex items-center gap-1.5 text-[11px] text-[#059669]">
          <Check className="size-3" strokeWidth={3} /> No code changes
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {models.map((m, i) => (
          <li
            key={m}
            className={cn(
              "relative flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors",
              i === at ? "text-neutral-950" : "text-neutral-500"
            )}
          >
            {i === at && (
              <motion.span
                layoutId="model-pick"
                className="absolute inset-0 rounded-lg bg-[#32836a]/10 ring-1 ring-[#32836a]/25"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{m}</span>
            {i === at && (
              <span className="relative text-[11px] text-[#32836a]">
                Active
              </span>
            )}
          </li>
        ))}
      </ul>
    </Rise>
  )
}

/* 03 · Local expertise ----------------------------------------------- */
function LocalRules() {
  const rules = [
    "Personal data protection (UU PDP)",
    "Data stays in Indonesia",
    "Audit trail for every action",
  ]
  return (
    <Rise className={cn(card, "w-full max-w-sm p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-neutral-500">Compliance</p>
        <span className="flex items-center gap-1 rounded-full bg-[#bb7851]/12 px-2 py-0.5 text-[11px] text-[#9a5b37]">
          <MapPin className="size-3" /> Jakarta region
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {rules.map((r, i) => (
          <motion.li
            key={r}
            className="flex items-center gap-2.5 text-[13px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span className="grid size-[18px] place-items-center rounded-full bg-[#10b981] text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {r}
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

/* 04 · Production-grade ---------------------------------------------- */
function Uptime() {
  const days = Array.from({ length: 30 }, (_, i) => (i === 17 ? "warn" : "ok"))
  return (
    <Rise className={cn(card, "w-full max-w-md p-5")}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] font-medium text-neutral-500">
          Uptime · last 30 days
        </p>
        <p className="text-xl font-medium tabular-nums">99.97%</p>
      </div>
      <div className="mt-4 flex gap-[3px]">
        {days.map((d, i) => (
          <motion.span
            key={i}
            className={cn(
              "h-8 flex-1 rounded-[3px]",
              d === "ok" ? "bg-[#10b981]" : "bg-[#f59e0b]"
            )}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.015 }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <div className="rounded-lg bg-neutral-50 px-3 py-2">
          <p className="text-neutral-500">p95 latency</p>
          <p className="mt-0.5 text-[15px] font-medium tabular-nums">420 ms</p>
        </div>
        <div className="rounded-lg bg-neutral-50 px-3 py-2">
          <p className="text-neutral-500">Requests today</p>
          <p className="mt-0.5 text-[15px] font-medium tabular-nums">1.2M</p>
        </div>
      </div>
    </Rise>
  )
}

/* 05 · End-to-end ---------------------------------------------------- */
function Lifecycle() {
  const stages = ["Strategy", "Design", "Build", "Deploy", "Support"]
  return (
    <Rise className={cn(card, "w-full max-w-lg p-5")}>
      <p className="text-[12px] font-medium text-neutral-500">One partner</p>
      <ol className="mt-5 flex items-center">
        {stages.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-2">
              <motion.span
                className="grid size-8 place-items-center rounded-full bg-[#bb5153] text-[11px] font-medium text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15 + i * 0.12,
                  type: "spring",
                  stiffness: 400,
                  damping: 22,
                }}
              >
                {i + 1}
              </motion.span>
              <span className="text-[11.5px] text-neutral-600">{s}</span>
            </span>
            {i < stages.length - 1 && (
              <motion.span
                className="mx-1.5 mb-6 h-px flex-1 origin-left bg-[#bb5153]/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.12 }}
              />
            )}
          </li>
        ))}
      </ol>
    </Rise>
  )
}

/* 06 · Open standards ------------------------------------------------ */
function OpenStack() {
  const badges = ["OpenAPI", "OpenTelemetry", "PostgreSQL", "Docker"]
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Rise className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f12] p-4 [font-family:ui-monospace,monospace] text-[12.5px] text-white/75 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
        <p>
          <span className="text-[#5cb6f9]">$</span> curl
          localhost:8080/openapi.json
        </p>
        <p>
          <span className="text-[#5cb6f9]">$</span> docker compose up -d
        </p>
        <p className="text-white/45">✓ services running on your own host</p>
      </Rise>
      <Rise delay={0.15} className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-full border border-[#517fbb]/25 bg-white px-3 py-1 text-[12px] text-[#3b64a0]"
          >
            {b}
          </span>
        ))}
      </Rise>
    </div>
  )
}

export const whyRantAIVisuals = [
  OwnProducts,
  ModelSwitch,
  LocalRules,
  Uptime,
  Lifecycle,
  OpenStack,
]
