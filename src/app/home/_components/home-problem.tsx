"use client"

import {
  Check,
  Clock,
  Cloud,
  Database,
  FileSpreadsheet,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useRef, useState } from "react"

import { SplitReveal } from "@/components/split-reveal"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

const problems = [
  {
    title: "Your knowledge is scattered.",
    body: "Policies, manuals, spreadsheets, and chats live in different places.",
  },
  {
    title: "AI stops at the demo.",
    body: "Pilots look good in a meeting, then never reach daily work.",
  },
  {
    title: "Most tools want your data out.",
    body: "They run in someone else's cloud. Regulated teams can't send data there.",
  },
] as const

// Muted colours from the site's feature palette, one per kind of source.
const scattered: {
  icon: LucideIcon
  label: string
  x: string
  y: string
  r: number
  color: string
  dx: number
  dy: number
}[] = [
  {
    icon: FileText,
    label: "Policy.pdf",
    x: "8%",
    y: "12%",
    r: -8,
    color: "#d9868a",
    dx: -1,
    dy: -1,
  },
  {
    icon: FileSpreadsheet,
    label: "Q3 data.xlsx",
    x: "56%",
    y: "6%",
    r: 6,
    color: "#5fc29a",
    dx: 1,
    dy: -1,
  },
  {
    icon: Mail,
    label: "Email thread",
    x: "62%",
    y: "44%",
    r: -4,
    color: "#d99a6c",
    dx: 1,
    dy: 0.3,
  },
  {
    icon: MessageSquare,
    label: "Team chat",
    x: "14%",
    y: "52%",
    r: 5,
    color: "#a99be6",
    dx: -1,
    dy: 0.4,
  },
  {
    icon: Database,
    label: "CRM records",
    x: "38%",
    y: "74%",
    r: -3,
    color: "#4fb3c9",
    dx: 0.2,
    dy: 1,
  },
  {
    icon: FileText,
    label: "SOP v3.docx",
    x: "30%",
    y: "30%",
    r: 3,
    color: "#7aa2e3",
    dx: -0.3,
    dy: -0.4,
  },
]

function Chip({
  item,
  index,
  reduce,
  progress,
}: Readonly<{
  item: (typeof scattered)[number]
  index: number
  reduce: boolean
  progress: MotionValue<number>
}>) {
  const Icon = item.icon
  // Scrolling pushes the pieces further apart: the scatter grows.
  const x = useTransform(progress, (p) => item.dx * p * 28)
  const y = useTransform(progress, (p) => item.dy * p * 22)
  const rotate = useTransform(progress, (p) => item.r * (1 + p * 0.8))
  return (
    <motion.div
      className="absolute"
      style={{ left: item.x, top: item.y, x, y, rotate }}
    >
      <motion.div
        className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white py-2 pr-3.5 pl-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]"
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={
          reduce
            ? undefined
            : { opacity: 1, scale: 1, y: [0, index % 2 ? -6 : 6, 0] }
        }
        transition={{
          opacity: { duration: 0.4, delay: index * 0.06 },
          scale: { duration: 0.4, delay: index * 0.06, ease },
          y: { duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <span
          className="grid size-7 place-items-center rounded-lg"
          style={{ background: `${item.color}22`, color: item.color }}
        >
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />
        </span>
        <span className="text-sm whitespace-nowrap text-neutral-700">
          {item.label}
        </span>
      </motion.div>
    </motion.div>
  )
}

function ScatteredVisual({
  reduce,
  progress,
}: Readonly<{ reduce: boolean; progress: MotionValue<number> }>) {
  return (
    <div className="relative h-full w-full">
      {scattered.map((item, index) => (
        <Chip
          key={item.label}
          item={item}
          index={index}
          reduce={reduce}
          progress={progress}
        />
      ))}
    </div>
  )
}

// A pilot that never ships, as a project timeline (illustrative).
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
const col = (m: number) => `${(m / months.length) * 100}%`

/** The problem as a product moment: the pilot bar just keeps growing. */
function StalledVisual({
  progress,
}: Readonly<{ progress: MotionValue<number> }>) {
  const idea = useTransform(progress, [0.02, 0.12], [0, 1], { clamp: true })
  const demo = useTransform(progress, [0.1, 0.2], [0, 1], { clamp: true })
  // The pilot starts in March and stretches on with the scroll.
  const pilotSpan = useTransform(progress, [0.2, 0.88], [0, 6.6], {
    clamp: true,
  })
  const pilotWidth = useTransform(pilotSpan, (m) => col(m))
  const days = useTransform(pilotSpan, (m) => `${Math.round(m * 30.4)} days`)
  // Show the bar only once the pilot has started, and its label only once
  // the bar is wide enough to hold it.
  const pilotOpacity = useTransform(pilotSpan, [0, 0.15], [0, 1])
  const daysOpacity = useTransform(pilotSpan, [1.1, 1.5], [0, 1])
  // Pilot planned to wrap by August; past that it turns overdue.
  const DEADLINE = 7
  const [overdue, setOverdue] = useState(() => 2 + pilotSpan.get() > DEADLINE)
  useMotionValueEvent(pilotSpan, "change", (m) => setOverdue(2 + m > DEADLINE))
  const stalled = useTransform(progress, [0.86, 0.95], [0, 1])
  const noteY = useTransform(stalled, [0, 1], [8, 0])
  const [isStalled, setStalled] = useState(() => stalled.get() > 0.5)
  useMotionValueEvent(stalled, "change", (v) => setStalled(v > 0.5))

  const row = "relative h-7"
  const label =
    "absolute -left-0 -translate-x-full pr-3 text-[11px] leading-7 text-neutral-500"

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35),0_1px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <span className="flex items-center gap-2 text-[11px]">
            <span className="text-neutral-400">Projects</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-800">invoice-agent</span>
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-500",
              isStalled
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {isStalled ? "Stalled" : "Active"}
          </span>
        </div>

        <div className="pt-4 pr-4 pb-7 pl-[5.5rem]">
          {/* Month axis */}
          <div className="relative h-5">
            {months.map((m, i) => (
              <span
                key={m}
                className="absolute top-0 text-[10px] text-neutral-400"
                style={{ left: col(i) }}
              >
                {m}
              </span>
            ))}
          </div>

          <div className="relative">
            {/* Grid lines */}
            {months.map((m, i) => (
              <span
                key={m}
                className="absolute inset-y-0 w-px bg-neutral-100"
                style={{ left: col(i) }}
              />
            ))}
            {/* Planned deadline */}
            <span
              className="absolute -top-1 -bottom-1 w-px border-l border-dashed border-[#dc5b62]/70"
              style={{ left: col(DEADLINE) }}
            >
              <span className="absolute top-full mt-1 -translate-x-1/2 rounded bg-[#dc5b62]/10 px-1 text-[9px] font-medium whitespace-nowrap text-[#c94a51]">
                Deadline
              </span>
            </span>

            <div className="relative space-y-1.5">
              <div className={row}>
                <span className={label}>Idea</span>
                <motion.span
                  className="absolute top-1.5 h-4 origin-left rounded-md bg-[#5fc29a]"
                  style={{ left: col(0), width: col(0.9), scaleX: idea }}
                />
              </div>
              <div className={row}>
                <span className={label}>Demo</span>
                <motion.span
                  className="absolute top-1.5 h-4 origin-left rounded-md bg-[#4fb3c9]"
                  style={{ left: col(1), width: col(0.9), scaleX: demo }}
                />
              </div>
              <div className={row}>
                <span className={cn(label, "text-neutral-900")}>Pilot</span>
                <motion.span
                  className="absolute top-1.5 flex h-4 items-center justify-end overflow-hidden rounded-md pr-1.5 transition-[background-color] duration-300"
                  style={{
                    left: col(2),
                    width: pilotWidth,
                    opacity: pilotOpacity,
                    backgroundImage: overdue
                      ? "repeating-linear-gradient(135deg,#dc5b62 0 6px,#e57f85 6px 12px)"
                      : "repeating-linear-gradient(135deg,#f59e0b 0 6px,#f8b545 6px 12px)",
                  }}
                >
                  <motion.span
                    className="text-[9px] font-medium whitespace-nowrap text-white tabular-nums"
                    style={{ opacity: daysOpacity }}
                  >
                    {days}
                  </motion.span>
                </motion.span>
              </div>
              <div className={row}>
                <span className={cn(label, "text-neutral-400")}>
                  Production
                </span>
                <span
                  className="absolute top-1.5 flex h-4 items-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-1.5 text-[9px] whitespace-nowrap text-neutral-400 italic"
                  style={{
                    left: col(DEADLINE + 0.15),
                    right: 0,
                    justifyContent: "center",
                  }}
                >
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="mx-4 mb-4 flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5"
          style={{ opacity: stalled, y: noteY }}
        >
          <Clock
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-amber-600"
          />
          <span className="text-xs leading-relaxed text-neutral-600">
            <span className="font-medium text-neutral-900">
              No update in 6 weeks.
            </span>{" "}
            The team went back to the old process.
          </span>
        </motion.div>
      </div>
    </div>
  )
}

// Sensitive data a cloud tool asks to upload (illustrative).
const uploads = [
  {
    icon: Database,
    name: "Citizen records",
    meta: "2.4M rows",
    color: "#7aa2e3",
  },
  { icon: FileText, name: "Contracts", meta: "18,240 files", color: "#d99a6c" },
  {
    icon: FileSpreadsheet,
    name: "Finance ledger",
    meta: "6.1 GB",
    color: "#5fc29a",
  },
]

function UploadRow({
  item,
  index,
  progress,
}: Readonly<{
  item: (typeof uploads)[number]
  index: number
  progress: MotionValue<number>
}>) {
  const Icon = item.icon
  const k = useTransform(progress, (p) =>
    Math.max(0, Math.min(1, (p - index * 0.08) / 0.12))
  )
  // Read the current value too: the step can open part-way (fast scroll).
  const [checked, setChecked] = useState(() => k.get() > 0.5)
  useMotionValueEvent(k, "change", (v) => setChecked(v > 0.5))
  return (
    <motion.li
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ opacity: useTransform(k, [0, 1], [0.35, 1]) }}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300",
          checked
            ? "border-[#5cb6f9] bg-[#5cb6f9] text-white"
            : "border-neutral-300 bg-white"
        )}
      >
        {checked && (
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        )}
      </span>
      <span
        className="grid size-7 shrink-0 place-items-center rounded-lg"
        style={{ background: `${item.color}22`, color: item.color }}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />
      </span>
      <span className="flex-1 truncate text-[13px] text-neutral-800">
        {item.name}
      </span>
      <span className="text-[11px] text-neutral-400 tabular-nums">
        {item.meta}
      </span>
    </motion.li>
  )
}

/**
 * The problem as a product moment: a cloud tool asks to upload sensitive
 * data, the upload starts… and stops at your network's edge.
 */
function BoundaryVisual({
  progress,
}: Readonly<{ progress: MotionValue<number> }>) {
  // 0.35–0.7: upload creeps forward; then it halts.
  const uploaded = useTransform(progress, [0.35, 0.7], [0, 0.34], {
    clamp: true,
  })
  const barWidth = useTransform(uploaded, (u) => `${u * 100}%`)
  const percent = useTransform(uploaded, (u) => `${Math.round(u * 100)}%`)
  const blocked = useTransform(progress, [0.7, 0.8], [0, 1])
  const bannerY = useTransform(blocked, [0, 1], [8, 0])
  const [isBlocked, setBlocked] = useState(() => blocked.get() > 0.5)
  useMotionValueEvent(blocked, "change", (v) => setBlocked(v > 0.5))

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35),0_1px_0_rgba(0,0,0,0.02)]">
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-neutral-200" />
            ))}
          </span>
          <span className="mx-auto flex items-center gap-1.5 text-[11px] text-neutral-500">
            <Cloud
              aria-hidden="true"
              className="size-3.5 text-[#5cb6f9]"
              strokeWidth={1.75}
            />
            app.cloud-tool.com
          </span>
          <span className="w-[38px]" />
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="text-sm font-medium text-neutral-900">
            Connect your data
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Upload sources to our cloud to get started.
          </p>
        </div>

        <ul className="divide-y divide-neutral-100">
          {uploads.map((item, i) => (
            <UploadRow
              key={item.name}
              item={item}
              index={i}
              progress={progress}
            />
          ))}
        </ul>

        {/* Upload progress */}
        <div className="border-t border-neutral-100 px-4 pt-3 pb-4">
          <div className="flex items-baseline justify-between text-[11px]">
            <span
              className={cn(
                "transition-colors",
                isBlocked ? "font-medium text-[#c94a51]" : "text-neutral-500"
              )}
            >
              {isBlocked ? "Upload stopped" : "Uploading to cloud…"}
            </span>
            <motion.span className="text-neutral-400 tabular-nums">
              {percent}
            </motion.span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
            <motion.div
              className={cn(
                "h-full rounded-full transition-colors duration-500",
                isBlocked
                  ? "bg-[#dc5b62]"
                  : "bg-linear-to-r from-[#7aa2e3] to-[#5cb6f9]"
              )}
              style={{ width: barWidth }}
            />
          </div>

          {/* Policy */}
          <motion.div
            className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#dc5b62]/25 bg-[#dc5b62]/[0.06] px-3 py-2.5"
            style={{ opacity: blocked, y: bannerY }}
          >
            <Lock
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 text-[#c94a51]"
            />
            <span className="text-xs leading-relaxed text-neutral-600">
              <span className="font-medium text-[#c94a51]">
                Blocked by data policy.
              </span>{" "}
              Sensitive data can&apos;t leave your network.
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/** One rail segment: fills while its problem is on screen. */
function RailSegment({
  overall,
  index,
  active,
}: Readonly<{ overall: MotionValue<number>; index: number; active: boolean }>) {
  const n = problems.length
  const width = useTransform(
    overall,
    (v) => `${Math.max(0, Math.min(1, v * n - index)) * 100}%`
  )
  return (
    <span
      className={cn(
        "relative h-1 overflow-hidden rounded-full bg-neutral-200 transition-[width] duration-500",
        active ? "w-16" : "w-8"
      )}
    >
      <motion.span
        className="absolute inset-y-0 left-0 rounded-full bg-neutral-900"
        style={{ width }}
      />
    </span>
  )
}

// Soft tint behind each visual.
const tints = [
  "radial-gradient(ellipse at 20% 0%, rgb(122 162 227 / 0.16), transparent 60%), radial-gradient(ellipse at 100% 100%, rgb(217 134 138 / 0.12), transparent 55%)",
  "radial-gradient(ellipse at 15% 100%, rgb(92 182 249 / 0.16), transparent 60%), radial-gradient(ellipse at 90% 0%, rgb(245 158 11 / 0.1), transparent 55%)",
  "radial-gradient(ellipse at 50% 0%, rgb(95 194 154 / 0.16), transparent 60%), radial-gradient(ellipse at 0% 100%, rgb(79 179 201 / 0.12), transparent 55%)",
]

export function HomeProblem() {
  const ref = useRef<HTMLElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [index, setIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // JS copies (sticky-safe): overall progress, and progress within the
  // current problem, which the visuals follow.
  const overall = useMotionValue(0)
  const step = useMotionValue(0)

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const v = Math.max(0, Math.min(1, value))
    overall.set(v)
    const i = Math.min(problems.length - 1, Math.floor(v * problems.length))
    step.set(Math.min(1, v * problems.length - i))
    setIndex(i)
  })

  const problem = problems[index]

  return (
    <section
      ref={ref}
      aria-labelledby="problem-heading"
      className="relative h-[420svh]"
    >
      <h2 id="problem-heading" className="sr-only">
        Why AI projects stall
      </h2>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14">
          <div className="order-2 lg:order-1">
            <div className="grid min-h-[11rem] sm:min-h-[14rem]">
              <AnimatePresence initial={false}>
                <div key={index} className="col-start-1 row-start-1">
                  <SplitReveal
                    as="p"
                    text={problem.title}
                    trigger="mount"
                    className="text-[clamp(2.5rem,5.4vw,5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-neutral-950"
                  />
                  <motion.p
                    className="mt-5 max-w-md text-lg leading-relaxed text-neutral-600"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduce
                        ? undefined
                        : { opacity: 0, transition: { duration: 0.2 } }
                    }
                    transition={{ duration: 0.5, ease, delay: 0.3 }}
                  >
                    {problem.body}
                  </motion.p>
                </div>
              </AnimatePresence>
            </div>
            {/* Scroll progress: the rail fills as you scroll through each one */}
            <div className="mt-8 flex items-center gap-4" aria-hidden="true">
              <span className="text-xs text-neutral-500 tabular-nums">
                <span className="text-neutral-950">0{index + 1}</span> / 0
                {problems.length}
              </span>
              <div className="flex gap-2">
                {problems.map((item, i) => (
                  <RailSegment
                    key={item.title}
                    overall={overall}
                    index={i}
                    active={i === index}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="order-1 grid aspect-[4/3] w-full overflow-hidden rounded-3xl bg-neutral-100 p-6 transition-[background-image] duration-700 sm:aspect-[5/4] lg:order-2"
            style={{ backgroundImage: tints[index] }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                className="col-start-1 row-start-1 h-full w-full"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease }}
                aria-hidden="true"
              >
                {index === 0 && (
                  <ScatteredVisual reduce={reduce} progress={step} />
                )}
                {index === 1 && <StalledVisual progress={step} />}
                {index === 2 && <BoundaryVisual progress={step} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
