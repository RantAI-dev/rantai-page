"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react"
import {
  ArrowUp,
  Check,
  Database,
  FileSpreadsheet,
  FileText,
  Loader2,
  MessageSquare,
  Sparkles,
  Table2,
} from "lucide-react"

import { ProductLogo, ProductTile } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

// Interactive product demos for the platform reel: each one plays a short,
// scripted session of the product on a light "desk", and visitors can pick
// another prompt to replay it. Content is illustrative.

const ease = [0.22, 1, 0.36, 1] as const
const W = 880
const H = 550
// Narrow screens get a portrait canvas with only the main cards, so the
// text stays readable instead of shrinking the desktop layout.
const CW = 400
const CH = 500
const COMPACT_BELOW = 640

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

// Each product sits on its own desk: a tint and a pattern (grid or dots).
const desks = {
  agents: { bg: "#edf3fd", line: "rgb(59 130 246 / 0.10)", pattern: "grid" },
  claw: { bg: "#fbf0e8", line: "rgb(234 88 12 / 0.16)", pattern: "dots" },
  llmops: { bg: "#f2eefc", line: "rgb(139 92 246 / 0.11)", pattern: "grid" },
  lake: { bg: "#e9f5f3", line: "rgb(13 148 136 / 0.18)", pattern: "dots" },
} as const

/** Lays the demo out at a fixed design size and scales it to fit. */
function Stage({
  desk,
  compact,
  children,
}: Readonly<{
  desk: keyof typeof desks
  compact: boolean
  children: React.ReactNode
}>) {
  const w = compact ? CW : W
  const h = compact ? CH : H
  const d = desks[desk]
  const pattern =
    d.pattern === "grid"
      ? {
          backgroundImage: `linear-gradient(${d.line} 1px, transparent 1px), linear-gradient(90deg, ${d.line} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }
      : {
          backgroundImage: `radial-gradient(${d.line} 1.2px, transparent 1.4px)`,
          backgroundSize: "18px 18px",
        }
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setScale(
        Math.min(
          e.contentRect.width / w,
          e.contentRect.height / h,
          compact ? 1.15 : Infinity
        )
      )
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h, compact])
  return (
    <div
      ref={ref}
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: d.bg, ...pattern }}
    >
      <div
        className="absolute top-1/2 left-1/2 origin-center text-neutral-900"
        style={{
          width: w,
          height: h,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Card({
  className,
  children,
  delay = 0,
  show = true,
}: Readonly<{
  className?: string
  children: React.ReactNode
  delay?: number
  show?: boolean
}>) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            "absolute rounded-2xl border border-black/[0.07] bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.04)]",
            className
          )}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.55, ease, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Types `text` once `on` turns true. */
function Typed({
  text,
  on,
  speed = 28,
}: Readonly<{ text: string; on: boolean; speed?: number }>) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    // Driven by elapsed time, so a busy page skips ahead instead of lagging.
    const start = performance.now()
    const t = setInterval(() => {
      const i = Math.min(
        text.length,
        Math.floor((performance.now() - start) / speed) + 1
      )
      setN(i)
      if (i >= text.length) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [on, text, speed])
  const shown = on ? text.slice(0, n) : ""
  return (
    <>
      {shown}
      {on && n < text.length && (
        <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-current" />
      )}
    </>
  )
}

/**
 * Runs a script: the step advances through `durations` (ms) while playing,
 * holds at the end, then calls `onDone` (e.g. to move to the next prompt).
 */
function useScript(
  durations: number[],
  playing: boolean,
  runKey: string,
  onDone: () => void
) {
  // The step belongs to one run, so picking another prompt starts at 0 on
  // the same render instead of flashing the old run's later cards.
  const [state, setState] = useState({ run: runKey, step: 0 })
  const step = state.run === runKey ? state.step : 0
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  })
  const key = durations.join(",")
  useEffect(() => {
    if (!playing) return
    const timers: ReturnType<typeof setTimeout>[] = []
    let at = 300
    timers.push(setTimeout(() => setState({ run: runKey, step: 0 }), 0))
    durations.forEach((d, i) => {
      at += d
      timers.push(setTimeout(() => setState({ run: runKey, step: i + 1 }), at))
    })
    timers.push(setTimeout(() => done.current(), at + 4200))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `durations`
  }, [playing, runKey, key])
  return step
}

/** Plays while on screen (and while the panel says so). */
function usePlaying(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setCompact(e.contentRect.width < COMPACT_BELOW)
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return {
    ref,
    compact,
    playing: active && inView && !reduce,
    reduce: Boolean(reduce),
  }
}

function Chips({
  options,
  value,
  onPick,
}: Readonly<{
  options: string[]
  value: number
  onPick: (i: number) => void
}>) {
  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(i)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[12px] whitespace-nowrap transition-colors",
            i === value
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-black/10 bg-white/80 text-neutral-600 hover:border-black/25 hover:text-neutral-900"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function Step({
  done,
  active,
  label,
}: Readonly<{ done: boolean; active: boolean; label: string }>) {
  return (
    <li className="flex items-center gap-2.5 text-[13px]">
      <span
        className={cn(
          "grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors",
          done
            ? "border-[#3b82f6] bg-[#3b82f6] text-white"
            : active
              ? "border-[#3b82f6]"
              : "border-neutral-300"
        )}
      >
        {done ? (
          <Check className="size-3" strokeWidth={3} />
        ) : active ? (
          <Loader2 className="size-3 animate-spin text-[#3b82f6]" />
        ) : null}
      </span>
      <span
        className={cn(
          done
            ? "text-neutral-500"
            : active
              ? "text-neutral-900"
              : "text-neutral-500"
        )}
      >
        {label}
      </span>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/*  RantAI Agents: ask, retrieve, answer with a citation, artifact     */
/* ------------------------------------------------------------------ */

const agentPrompts = [
  {
    chip: "Leave policy",
    q: "How many leave days do new staff get?",
    sources: ["HR Policy 2026.pdf", "Leave SOP v3.docx", "Benefits.xlsx"],
    a: "New staff get 12 days of annual leave in their first year, rising to 15 days after two years of service.",
    cite: "HR Policy 2026 · p.4",
    artifact: "Leave summary.docx",
  },
  {
    chip: "Procurement",
    q: "Summarise this month's procurement requests",
    sources: [
      "Procurement log.xlsx",
      "Approval matrix.pdf",
      "Vendor list.xlsx",
    ],
    a: "42 requests this month: 31 approved, 8 waiting on budget review, and 3 sent back for missing quotes.",
    cite: "Procurement log · Oct",
    artifact: "Procurement brief.pdf",
  },
  {
    chip: "Vendor reply",
    q: "Draft a reply to the vendor about the late delivery",
    sources: ["Vendor contract.pdf", "Delivery tracker.xlsx", "Email thread"],
    a: "Drafted a reply citing clause 7.2 on delivery terms and proposing a revised date of 14 November.",
    cite: "Vendor contract · §7.2",
    artifact: "Reply draft.eml",
  },
]
const agentTiming = [1500, 1700, 2600]

export function AgentsDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const [pick, setPick] = useState(0)
  const p = agentPrompts[pick]
  const step = useScript(agentTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % agentPrompts.length)
  )
  const s = reduce ? 3 : step
  const sourceIcons = [FileText, FileText, FileSpreadsheet]

  return (
    <div ref={ref} className="size-full">
      <Stage desk="agents" compact={compact}>
        {/* Knowledge */}
        <Card className="top-16 left-8 w-[220px] p-4" show={!compact && s >= 1}>
          <p className="text-[12px] font-medium text-neutral-500">Knowledge</p>
          <ul className="mt-3 space-y-2.5">
            {p.sources.map((src, i) => {
              const Icon = sourceIcons[i] ?? MessageSquare
              return (
                <motion.li
                  key={src}
                  className="flex items-center gap-2.5 text-[13px]"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: s >= 1 ? 1 : 0.35 }}
                  transition={{ delay: 0.25 + i * 0.35 }}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex-1 truncate">{src}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: s >= 1 ? 1 : 0 }}
                    transition={{ delay: 0.35 + i * 0.35 }}
                  >
                    <Check
                      className="size-3.5 text-[#10b981]"
                      strokeWidth={3}
                    />
                  </motion.span>
                </motion.li>
              )
            })}
          </ul>
        </Card>

        {/* Chat */}
        <Card
          className={cn(
            "flex flex-col overflow-hidden",
            compact
              ? "inset-x-5 top-5 h-[318px]"
              : "top-10 left-[270px] h-[400px] w-[380px]"
          )}
          key={`chat-${pick}`}
        >
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3 text-[13px] font-medium">
            <ProductTile id="agents" />
            HR Assistant
          </div>
          <div className="flex-1 space-y-3 p-4">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-neutral-100 px-3.5 py-2.5 text-[13px]">
              <Typed text={p.q} on={s >= 0} />
            </div>
            {s >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] leading-relaxed"
              >
                {s === 1 ? (
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Loader2 className="size-3.5 animate-spin" /> Searching 3
                    sources…
                  </span>
                ) : (
                  <>
                    <Typed text={p.a} on={s >= 2} speed={18} />
                    {s >= 3 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2.5 flex w-fit items-center gap-1.5 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/[0.06] px-2.5 py-1 text-[11px] text-[#2563eb]"
                      >
                        <FileText className="size-3" /> {p.cite}
                      </motion.span>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
          <div className="mx-4 mb-4 flex items-center justify-between rounded-xl border border-black/[0.08] px-3 py-2 text-[12px] text-neutral-400">
            Ask anything about your documents…
            <span className="grid size-6 place-items-center rounded-full bg-neutral-900 text-white">
              <ArrowUp className="size-3" />
            </span>
          </div>
        </Card>

        {/* Artifact */}
        <Card
          className="inset-x-5 top-[352px] flex items-center gap-3 p-3"
          show={compact && s >= 3}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#8b5cf6]/12 text-[#8b5cf6]">
            <FileText className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-neutral-500">Artifact</span>
            <span className="block truncate text-[13px] font-medium">
              {p.artifact}
            </span>
          </span>
        </Card>
        <Card
          className="top-[190px] right-8 w-[190px] p-4"
          show={!compact && s >= 3}
        >
          <p className="text-[12px] font-medium text-neutral-500">Artifact</p>
          <div className="mt-3 rounded-xl border border-black/[0.07] bg-neutral-50 p-3">
            <span className="grid size-8 place-items-center rounded-lg bg-[#8b5cf6]/12 text-[#8b5cf6]">
              <FileText className="size-4" />
            </span>
            <p className="mt-2.5 text-[13px] font-medium">{p.artifact}</p>
            <div className="mt-2 space-y-1.5">
              <span className="block h-1.5 w-full rounded-full bg-neutral-200" />
              <span className="block h-1.5 w-4/5 rounded-full bg-neutral-200" />
              <span className="block h-1.5 w-3/5 rounded-full bg-neutral-200" />
            </div>
          </div>
        </Card>

        <Chips
          options={agentPrompts.map((a) => a.chip)}
          value={pick}
          onPick={setPick}
        />
      </Stage>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  RantAI Claw: a scheduled skill runs in the terminal                 */
/* ------------------------------------------------------------------ */

const clawRuns = [
  {
    chip: "daily-brief",
    lines: [
      "load skills",
      "✓ calendar",
      "✓ inbox",
      "✓ summarizer",
      "run daily-brief",
      "✓ 6 meetings · 14 emails read",
      "✓ brief posted to #ops",
    ],
    schedule: "Weekdays · 08:00",
  },
  {
    chip: "triage-inbox",
    lines: [
      "load skills",
      "✓ inbox",
      "✓ classifier",
      "run triage-inbox",
      "✓ 38 emails sorted",
      "✓ 5 flagged as urgent",
      "✓ summary sent to Telegram",
    ],
    schedule: "Every hour",
  },
  {
    chip: "weekly-report",
    lines: [
      "load skills",
      "✓ research-assistant",
      "✓ spreadsheet",
      "run weekly-report",
      "✓ 4 sources merged",
      "✓ report.pdf generated",
      "✓ shared with #leadership",
    ],
    schedule: "Fridays · 16:00",
  },
]

export function ClawDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const [pick, setPick] = useState(0)
  const run = clawRuns[pick]
  const timing = run.lines.map((_, i) => (i === 0 ? 900 : 520))
  const step = useScript(timing, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % clawRuns.length)
  )
  const shown = reduce ? run.lines.length : step

  return (
    <div ref={ref} className="size-full">
      <Stage desk="claw" compact={compact}>
        <Card
          className={cn(
            "overflow-hidden border-white/10 bg-[#0d0f12] text-white",
            compact ? "inset-x-5 top-5" : "top-10 left-10 w-[520px]"
          )}
          key={`term-${pick}`}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-white/15" />
            ))}
            <ProductLogo id="claw" variant="dark" className="ml-3 h-3.5" />
            <span className="[font-family:ui-monospace,monospace] text-[11px] text-white/45">
              rantaiclaw · ~/ops
            </span>
          </div>
          <div
            className={cn(
              "space-y-1.5 [font-family:ui-monospace,SFMono-Regular,Menlo,monospace]",
              compact
                ? "min-h-[228px] p-4 text-[12px]"
                : "min-h-[300px] p-5 text-[13px]"
            )}
          >
            <p>
              <span className="text-[#5cb6f9]">$</span> rantaiclaw run{" "}
              {run.chip}
            </p>
            {run.lines.slice(0, shown).map((l, i) => (
              <motion.p
                key={`${pick}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={
                  l.startsWith("✓") ? "pl-4 text-white/75" : "text-white/45"
                }
              >
                {l.startsWith("✓") ? (
                  <>
                    <span className="text-[#34d399]">✓</span>
                    {l.slice(1)}
                  </>
                ) : (
                  <>▸ {l}</>
                )}
              </motion.p>
            ))}
            {shown < run.lines.length && playing && (
              <span className="inline-block h-4 w-2 animate-pulse bg-white/70" />
            )}
          </div>
        </Card>

        <Card
          className={cn(
            "p-4",
            compact ? "inset-x-5 top-[310px]" : "top-16 right-8 w-[230px]"
          )}
          key={`sched-${pick}`}
        >
          <p className="text-[12px] font-medium text-neutral-500">Schedule</p>
          <p className="mt-2 text-[15px] font-medium">{run.chip}</p>
          <p className="mt-1 text-[12px] text-neutral-500">{run.schedule}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <motion.div
              className="h-full rounded-full bg-[#f97316]"
              animate={{ width: `${(shown / run.lines.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </Card>

        <Card className="right-8 bottom-24 w-[230px] p-4" show={!compact}>
          <p className="text-[12px] font-medium text-neutral-500">Channels</p>
          <ul className="mt-3 space-y-2 text-[13px]">
            {["Telegram", "Slack", "Email"].map((c) => (
              <li key={c} className="flex items-center justify-between">
                {c}
                <span className="flex items-center gap-1.5 text-[11px] text-[#10b981]">
                  <span className="size-1.5 rounded-full bg-[#10b981]" />{" "}
                  Connected
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Chips
          options={clawRuns.map((r) => r.chip)}
          value={pick}
          onPick={setPick}
        />
      </Stage>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  RantAI Lakehouse: ask in plain language, see the SQL, get a chart       */
/* ------------------------------------------------------------------ */

const lakeAsks = [
  {
    chip: "Top countries",
    q: "Which countries sent the most visitors in 2024?",
    sql: "SELECT country, SUM(visitors)\nFROM visitors_clean\nWHERE year = 2024\nGROUP BY country ORDER BY 2 DESC LIMIT 5;",
    title: "Top source countries · 2024",
    bars: [
      ["Malaysia", 1.6],
      ["Singapore", 1.5],
      ["Australia", 1.2],
      ["China", 1.0],
      ["Japan", 0.7],
    ] as [string, number][],
  },
  {
    chip: "Busiest months",
    q: "Which months had the most visitors last year?",
    sql: "SELECT month, SUM(visitors)\nFROM visitors_clean\nWHERE year = 2024\nGROUP BY month ORDER BY 2 DESC LIMIT 5;",
    title: "Busiest months · 2024",
    bars: [
      ["August", 1.4],
      ["July", 1.3],
      ["December", 1.2],
      ["June", 1.0],
      ["October", 0.9],
    ] as [string, number][],
  },
]
const lakeTiming = [1700, 1900, 600]

export function LakeDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const [pick, setPick] = useState(0)
  const a = lakeAsks[pick]
  const step = useScript(lakeTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % lakeAsks.length)
  )
  const s = reduce ? 3 : step
  const max = Math.max(...a.bars.map((b) => b[1]))

  return (
    <div ref={ref} className="size-full">
      <Stage desk="lake" compact={compact}>
        {/* Ask */}
        <Card
          className={cn(
            "p-3",
            compact
              ? "inset-x-5 top-5"
              : "top-8 left-1/2 w-[560px] -translate-x-1/2"
          )}
          key={`ask-${pick}`}
        >
          <div className="flex items-center gap-3 px-1">
            <ProductLogo id="lake" className="h-4" />
            <span className="flex-1 text-[14px]">
              <Typed text={a.q} on={s >= 0} />
            </span>
            <span className="grid size-7 place-items-center rounded-full bg-[#0b6ab0] text-white">
              <ArrowUp className="size-3.5" />
            </span>
          </div>
        </Card>

        {/* SQL */}
        <Card
          className={cn(
            "overflow-hidden",
            compact ? "inset-x-5 top-[104px]" : "top-[110px] left-8 w-[300px]"
          )}
          show={s >= 1 && (!compact || s < 2)}
          key={`sql-${pick}`}
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 text-[12px] font-medium text-neutral-500">
            Generated SQL
            {s === 1 ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5 text-[#10b981]" strokeWidth={3} />
            )}
          </div>
          <pre className="px-4 py-3 [font-family:ui-monospace,monospace] text-[11.5px] leading-relaxed whitespace-pre-wrap text-[#1e3a8a]">
            <Typed text={a.sql} on={s >= 1} speed={12} />
          </pre>
        </Card>

        {/* Chart */}
        <Card
          className={cn(
            "p-5",
            compact ? "inset-x-5 top-[104px]" : "top-[110px] right-8 w-[480px]"
          )}
          show={s >= 2}
          key={`chart-${pick}`}
        >
          <p className="text-[14px] font-medium">{a.title}</p>
          <p className="text-[11px] text-neutral-500">Visitors (millions)</p>
          <ul className="mt-4 space-y-2.5">
            {a.bars.map(([label, v], i) => (
              <li
                key={label}
                className="grid grid-cols-[80px_1fr_36px] items-center gap-3 text-[12px]"
              >
                <span className="text-neutral-600">{label}</span>
                <span className="h-4 overflow-hidden rounded bg-neutral-100">
                  <motion.span
                    className="block h-full rounded bg-[#6366f1]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(v / max) * 100}%` }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.1 }}
                  />
                </span>
                <span className="text-right text-neutral-500 tabular-nums">
                  {v.toFixed(1)}M
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Lineage */}
        <Card
          className={cn(
            "p-4",
            compact ? "inset-x-5 top-[340px]" : "bottom-20 left-8 w-[300px]"
          )}
          show={s >= 3}
        >
          <p className="text-[12px] font-medium text-neutral-500">Lineage</p>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            {[
              [Database, "raw"],
              [Table2, "clean"],
              [Sparkles, "answer"],
            ].map(([Icon, l], i) => {
              const I = Icon as typeof Database
              return (
                <span key={l as string} className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-lg border border-black/[0.08] px-2 py-1.5">
                    <I className="size-3.5 text-[#2563eb]" /> {l as string}
                  </span>
                  {i < 2 && <span className="h-px w-4 bg-neutral-300" />}
                </span>
              )
            })}
          </div>
        </Card>

        <Chips
          options={lakeAsks.map((x) => x.chip)}
          value={pick}
          onPick={setPick}
        />
      </Stage>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  RantAI LLMOps: dataset → fine-tune → evaluate → serve              */
/* ------------------------------------------------------------------ */

const llmRuns = [
  {
    chip: "support-assistant",
    data: "support-tickets.jsonl",
    rows: "12,480 rows",
    base: 71,
    tuned: 89,
  },
  {
    chip: "contract-classifier",
    data: "contracts-labelled.jsonl",
    rows: "8,215 rows",
    base: 64,
    tuned: 92,
  },
]
const llmTiming = [900, 2600, 1300, 900]

export function LlmopsDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const [pick, setPick] = useState(0)
  const r = llmRuns[pick]
  const step = useScript(llmTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % llmRuns.length)
  )
  const s = reduce ? 4 : step
  const loss = "M0,10 C40,14 60,52 110,62 S190,78 240,84 S300,88 320,89"

  return (
    <div ref={ref} className="size-full">
      <Stage desk="llmops" compact={compact}>
        <Card
          className={cn(
            "p-4",
            compact ? "inset-x-5 top-5" : "top-10 left-8 w-[250px]"
          )}
          key={`run-${pick}`}
        >
          <p className="flex items-center gap-2 text-[12px] font-medium text-neutral-500">
            <ProductTile id="llmops" className="size-5" logoClassName="h-3" />
            Run · {r.chip}
          </p>
          <ul className="mt-3 space-y-3">
            {["Load dataset", "Fine-tune", "Evaluate", "Serve"].map((l, i) => (
              <Step
                key={l}
                label={l}
                done={s > i + 1 || (i === 3 && s >= 4)}
                active={s === i + 1 && !(i === 3 && s >= 4)}
              />
            ))}
          </ul>
          <div
            className={cn(
              "mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-[12px]",
              compact && "hidden"
            )}
          >
            <FileText className="size-3.5 text-[#8b5cf6]" />
            <span className="flex-1 truncate">{r.data}</span>
            <span className="text-neutral-400">{r.rows}</span>
          </div>
        </Card>

        <Card
          className={cn(
            "p-5",
            compact ? "inset-x-5 top-[196px]" : "top-10 right-8 w-[540px]"
          )}
          show={s >= 2 && (!compact || s < 3)}
          key={`train-${pick}`}
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[14px] font-medium">Training loss</p>
            <p className="text-[11px] text-neutral-500">
              {s >= 3 ? "Done · 3 epochs" : "Epoch 2 / 3"}
            </p>
          </div>
          <svg
            viewBox="0 0 320 100"
            className={cn(
              "mt-3 w-full overflow-visible",
              compact ? "h-[110px]" : "h-[150px]"
            )}
          >
            {[25, 50, 75].map((y) => (
              <line
                key={y}
                x1="0"
                x2="320"
                y1={y}
                y2={y}
                stroke="rgb(0 0 0 / 0.06)"
              />
            ))}
            <motion.path
              d={loss}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </svg>
        </Card>

        <Card
          className={cn(
            "p-4",
            compact
              ? "inset-x-5 top-[232px]"
              : "right-[300px] bottom-20 w-[260px]"
          )}
          show={s >= 3}
          key={`eval-${pick}`}
        >
          <p className="text-[12px] font-medium text-neutral-500">
            Eval · your test set
          </p>
          {[
            ["Base model", r.base, "#cbd5e1"],
            ["Fine-tuned", r.tuned, "#10b981"],
          ].map(([l, v, c]) => (
            <div key={l as string} className="mt-3">
              <div className="flex justify-between text-[12px]">
                <span>{l as string}</span>
                <span className="tabular-nums">{v as number}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c as string }}
                  initial={{ width: 0 }}
                  animate={{ width: `${v}%` }}
                  transition={{ duration: 0.9, ease }}
                />
              </div>
            </div>
          ))}
        </Card>

        <Card
          className={cn(
            "p-4",
            compact ? "inset-x-5 top-[354px]" : "right-8 bottom-20 w-[250px]"
          )}
          show={s >= 4}
        >
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-neutral-500">Endpoint</p>
            <span className="flex items-center gap-1.5 text-[11px] text-[#10b981]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#10b981]" />{" "}
              Live
            </span>
          </div>
          <p className="mt-2 rounded-lg bg-neutral-50 px-2.5 py-2 [font-family:ui-monospace,monospace] text-[11px] text-neutral-700">
            POST /v1/chat/completions
          </p>
          <p
            className={cn(
              "mt-2 text-[11px] text-neutral-500",
              compact && "hidden"
            )}
          >
            OpenAI-compatible · on your GPUs
          </p>
        </Card>

        <Chips
          options={llmRuns.map((x) => x.chip)}
          value={pick}
          onPick={setPick}
        />
      </Stage>
    </div>
  )
}

export const demos: Record<
  string,
  (p: { active?: boolean }) => React.JSX.Element
> = {
  agents: AgentsDemo,
  claw: ClawDemo,
  llmops: LlmopsDemo,
  lake: LakeDemo,
}
