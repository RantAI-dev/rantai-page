"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import {
  Check,
  Code2,
  Compass,
  LifeBuoy,
  MapPin,
  PenTool,
  Rocket,
} from "lucide-react"

import { ProductTile, productIdFrom } from "@/components/shared/product-logo"
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

/**
 * A number that bumps every time the tile is hovered, so a scene can replay
 * its animation by keying on it.
 */
function useReplay(hover: boolean) {
  const [run, setRun] = useState(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- replay on hover
    if (hover) setRun((r) => r + 1)
  }, [hover])
  return run
}

type Scene = { hover: boolean }

/* Products, not just services: versions ship on hover ---------------- */
function OwnProducts({ hover }: Readonly<Scene>) {
  const items = [
    { name: "RantAI Agents", v: [3, 2] },
    { name: "RantAI Claw", v: [1, 8] },
    { name: "RantAI LLMOps", v: [2, 0] },
    { name: "RantAI Lakehouse", v: [1, 4] },
  ]
  return (
    <Rise className={cn(card, "w-full max-w-sm p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-neutral-500">
          Built and maintained by RantAI
        </p>
        <AnimatePresence>
          {hover && (
            <motion.span
              className="flex items-center gap-1 text-[11px] text-[#059669]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[#10b981]" />
              Shipping updates
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <motion.li
            key={it.name}
            className="flex items-center gap-3 text-[13px]"
            animate={{ x: hover ? 4 : 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 22,
              delay: hover ? i * 0.06 : 0,
            }}
          >
            <ProductTile
              id={productIdFrom(it.name)!}
              className="size-8 rounded-lg"
              logoClassName="h-4"
            />
            <span className="flex-1 font-medium">{it.name}</span>
            <span className="relative h-5 w-12 overflow-hidden text-right">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={String(hover)}
                  className={cn(
                    "absolute right-0 rounded-full px-2 py-0.5 text-[11px] tabular-nums",
                    hover
                      ? "bg-[#10b981]/12 text-[#047857]"
                      : "bg-neutral-100 text-neutral-500"
                  )}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease,
                    delay: hover ? 0.1 + i * 0.08 : 0,
                  }}
                >
                  v{it.v[0]}.{it.v[1] + (hover ? 1 : 0)}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

/* No vendor lock-in: swap models without touching code -------------- */
const models = [
  { name: "GPT-4o", logo: "openai" },
  { name: "Claude", logo: "claude" },
  { name: "Llama 3.1", logo: "meta" },
  { name: "Qwen 2.5", logo: "qwen" },
  { name: "DeepSeek V3", logo: "deepseek" },
  { name: "Gemini", logo: "gemini" },
  { name: "Mistral", logo: "mistral" },
]

function ModelPill({ m }: Readonly<{ m: (typeof models)[number] }>) {
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-1.5 text-[13px] font-medium text-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span className="grid size-6 place-items-center rounded-full bg-neutral-50">
        <Image src={`/models/${m.logo}.svg`} alt="" width={14} height={14} />
      </span>
      {m.name}
    </span>
  )
}

/** One row that glides sideways forever; its speed eases, never jumps. */
function ModelRow({
  row,
  speed,
  reverse,
}: Readonly<{ row: typeof models; speed: number; reverse: boolean }>) {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const v = useRef(speed)
  const half = useRef(0)
  // Off screen the row stands still, so it costs nothing.
  const inView = useInView(trackRef, { margin: "100px" })
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      half.current = 0
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useAnimationFrame((_, delta) => {
    const el = trackRef.current
    if (!el || reduce || !inView) return
    // Ease the current speed toward the target (px per second).
    v.current += (speed - v.current) * Math.min(1, delta / 250)
    // The track's width only changes with the layout: measure it once.
    if (!half.current) half.current = el.scrollWidth / 2
    const halfW = half.current
    let next = x.get() + (reverse ? 1 : -1) * v.current * (delta / 1000)
    if (next <= -halfW) next += halfW
    if (next > 0) next -= halfW
    x.set(next)
  })
  return (
    <div className="overflow-hidden">
      <motion.div ref={trackRef} className="flex w-max py-1" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-2.5 pr-2.5">
            {row.map((m) => (
              <ModelPill key={`${copy}-${m.name}`} m={m} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* No vendor lock-in: every model streams past, endlessly ------------- */
function ModelSwitch({ hover }: Readonly<Scene>) {
  // Five rows, biggest in the middle, so the wall reads as a curved drum.
  const shift = (k: number) => [...models.slice(k), ...models.slice(0, k)]
  const rows = [shift(2), shift(5), models, shift(3), shift(6)]
  const sizes = [0.78, 0.9, 1.06, 0.9, 0.78]
  return (
    <Rise className="-mx-5 w-[calc(100%+2.5rem)] sm:-mx-5">
      <div className="space-y-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent_2%,black_24%,black_76%,transparent_98%)]">
        {rows.map((row, r) => (
          <div
            key={r}
            style={{
              // Widen before scaling so every row still spans the tile.
              width: `${100 / sizes[r]}%`,
              marginLeft: `${(100 - 100 / sizes[r]) / 2}%`,
              transform: `scale(${sizes[r]})`,
              opacity: 0.45 + (sizes[r] - 0.78) * 1.9,
              marginBlock: `${(sizes[r] - 1) * 14}px`,
            }}
          >
            <ModelRow
              row={row}
              reverse={r % 2 === 1}
              speed={(hover ? 70 : 28) * (0.8 + sizes[r] * 0.2)}
            />
          </div>
        ))}
      </div>
    </Rise>
  )
}

/* Local expertise: the checks stamp in again, the pin drops ---------- */
function LocalRules({ hover }: Readonly<Scene>) {
  const run = useReplay(hover)
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
          <motion.span
            key={run}
            initial={{ y: -6 }}
            animate={{ y: [-6, 0, -2, 0] }}
            transition={{ duration: 0.6 }}
          >
            <MapPin className="size-3" />
          </motion.span>
          Jakarta region
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {rules.map((r, i) => (
          <li key={r} className="flex items-center gap-2.5 text-[13px]">
            <motion.span
              key={`${run}-${i}`}
              className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#10b981] text-white"
              initial={{ scale: run ? 0 : 1 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 18,
                delay: 0.1 + i * 0.15,
              }}
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
            {r}
          </li>
        ))}
      </ul>
    </Rise>
  )
}

/* Production-grade: a live pulse runs along the bars ----------------- */
function Uptime({ hover }: Readonly<Scene>) {
  const run = useReplay(hover)
  const days = Array.from({ length: 30 }, (_, i) => (i === 17 ? "warn" : "ok"))
  return (
    <Rise className={cn(card, "w-full max-w-md p-5")}>
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
          <span className="size-1.5 animate-pulse rounded-full bg-[#10b981]" />
          Uptime · last 30 days
        </p>
        <p className="text-xl font-medium tabular-nums">99.97%</p>
      </div>
      <div className="mt-4 flex gap-[3px]">
        {days.map((d, i) => (
          <motion.span
            key={`${run}-${i}`}
            className={cn(
              "h-8 flex-1 origin-bottom rounded-[3px]",
              d === "ok" ? "bg-[#10b981]" : "bg-[#f59e0b]"
            )}
            initial={{ scaleY: run ? 1 : 0 }}
            animate={run ? { scaleY: [1, 0.35, 1] } : { scaleY: 1 }}
            transition={{ duration: 0.45, ease, delay: i * 0.018 }}
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

/* End-to-end: a marker travels through every stage ------------------- */
const stages = [
  { label: "Strategy", icon: Compass },
  { label: "Design", icon: PenTool },
  { label: "Build", icon: Code2 },
  { label: "Deploy", icon: Rocket },
  { label: "Support", icon: LifeBuoy },
]
function Lifecycle({ hover }: Readonly<Scene>) {
  const reduce = useReducedMotion()
  const [at, setAt] = useState(stages.length - 1)
  useEffect(() => {
    if (!hover || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- rest state
      setAt(stages.length - 1)
      return
    }
    setAt(0)
    const t = setInterval(() => setAt((v) => (v + 1) % stages.length), 450)
    return () => clearInterval(t)
  }, [hover, reduce])
  return (
    <Rise className={cn(card, "w-full max-w-lg p-5")}>
      <p className="text-[12px] font-medium text-neutral-500">One partner</p>
      <ol className="relative mt-5 flex items-start justify-between">
        <span className="absolute top-4 right-6 left-6 h-px bg-[#bb5153]/20" />
        <motion.span
          className="absolute top-4 left-6 h-px origin-left bg-[#bb5153]"
          style={{ width: "calc(100% - 3rem)" }}
          animate={{ scaleX: at / (stages.length - 1) }}
          transition={{ duration: 0.4, ease }}
        />
        {stages.map((s, i) => (
          <li
            key={s.label}
            className="relative flex w-16 flex-col items-center gap-2"
          >
            <motion.span
              className="grid size-8 place-items-center rounded-full text-[11px] font-medium"
              animate={{
                backgroundColor: i <= at ? "#bb5153" : "#f5e6e7",
                color: i <= at ? "#ffffff" : "#bb5153",
                scale: i === at && hover ? 1.15 : 1,
              }}
              transition={{ duration: 0.25 }}
            >
              <s.icon className="size-3.5" strokeWidth={2.2} />
            </motion.span>
            <span className="text-[10.5px] text-neutral-600">{s.label}</span>
          </li>
        ))}
      </ol>
    </Rise>
  )
}

/* Open standards: the commands type out again ------------------------ */
const commands = [
  "$ curl localhost:8080/openapi.json",
  "$ docker compose up -d",
  "✓ services running on your own host",
]
function OpenStack({ hover }: Readonly<Scene>) {
  const run = useReplay(hover)
  const badges = ["OpenAPI", "OpenTelemetry", "PostgreSQL", "Docker"]
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Rise className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f12] p-4 [font-family:ui-monospace,monospace] text-[12.5px] text-white/75 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
        {commands.map((c, i) => (
          <motion.p
            key={`${run}-${i}`}
            className={cn(
              "overflow-hidden whitespace-nowrap",
              i === 2 && "text-white/45"
            )}
            initial={run ? { width: "0%" } : false}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "linear", delay: i * 0.5 }}
          >
            {c.startsWith("$") ? (
              <>
                <span className="text-[#5cb6f9]">$</span>
                {c.slice(1)}
              </>
            ) : (
              c
            )}
          </motion.p>
        ))}
      </Rise>
      <div className="flex flex-wrap gap-2">
        {badges.map((b, i) => (
          <motion.span
            key={b}
            className="rounded-full border border-[#517fbb]/25 bg-white px-3 py-1 text-[12px] text-[#3b64a0]"
            animate={{ y: hover ? -3 : 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
              delay: hover ? 1.4 + i * 0.07 : 0,
            }}
          >
            {b}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export const whyRantAIVisuals: ((p: Scene) => React.JSX.Element)[] = [
  OwnProducts,
  ModelSwitch,
  LocalRules,
  Uptime,
  Lifecycle,
  OpenStack,
]
