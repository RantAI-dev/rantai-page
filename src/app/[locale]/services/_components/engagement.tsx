"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react"
import {
  CalendarDays,
  Check,
  FileCheck2,
  GitPullRequest,
  LifeBuoy,
  LineChart,
  Lock,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Eyebrow } from "@/components/shared/eyebrow"
import { PillLink } from "@/components/shared/pill-link"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { smoothScrollTo } from "@/components/layout/smooth-scroll"
import { SplitReveal } from "@/components/shared/split-reveal"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

// "How we work", the long version for the Services page: one engagement
// from the first call to handover, in five phases. The panel grows to full
// width (the navbar turns dark) and scroll walks through the phases.
// Durations and figures are illustrative.

const ease = [0.22, 1, 0.36, 1] as const

type Phase = {
  id: string
  /** The mockup's light desk: a tint and the colour of its dots. */
  desk: { bg: string; dot: string }
  when: string
  title: string
  line: string
  get: string[]
  short: string
  icon: LucideIcon
  tone: string
  Visual: (props: VisualProps) => React.JSX.Element
}

/** A visual's progress on phones (0–1); undefined plays it on its timers. */
type VisualProps = Readonly<{ at?: number }>

/** How far (0–1, eased) the scroll has got through [a, b] of a phase. */
function seg(at: number, a: number, b: number) {
  const x = Math.min(1, Math.max(0, (at - a) / (b - a)))
  return 1 - (1 - x) ** 3
}

/**
 * Motion props for one element: on its own timer (desktop, tablet), or set
 * straight from the scroll on phones, between `from` and `to` over [a, b].
 */
function drive(
  at: number | undefined,
  a: number,
  b: number,
  from: Record<string, number>,
  to: Record<string, number>,
  transition: Transition
) {
  if (at === undefined) return { initial: from, animate: to, transition }
  const k = seg(at, a, b)
  const now = Object.fromEntries(
    Object.keys(to).map((key) => [key, from[key] + (to[key] - from[key]) * k])
  )
  return { initial: false as const, animate: now, transition: { duration: 0 } }
}

// The mockups sit on a light desk, like the product demos on the Platform
// page: white cards, dark text, the phase's colour for accents.
const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.04)]"

function Rise({
  delay = 0,
  p,
  className,
  children,
}: Readonly<{
  delay?: number
  /** Phones: how far it has risen (0–1), from the scroll. */
  p?: number
  className?: string
  children: React.ReactNode
}>) {
  if (p !== undefined)
    return (
      <div
        className={className}
        style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}
      >
        {children}
      </div>
    )
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  One visual per phase                                               */
/* ------------------------------------------------------------------ */

function CallVisual({ at }: VisualProps) {
  const t = useTranslations("services.engagement.call")
  const qs = t.raw("questions") as string[]
  return (
    <div className="grid w-full max-w-[460px] gap-3">
      <Rise
        p={at === undefined ? undefined : seg(at, 0, 0.3)}
        className={cn(card, "flex items-center gap-4 p-4")}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarDays className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium">{t("title")}</span>
          <span className="block text-[12.5px] text-neutral-500">
            {t("meta")}
          </span>
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
          {t("free")}
        </span>
      </Rise>
      <Rise
        delay={0.12}
        p={at === undefined ? undefined : seg(at, 0.15, 0.45)}
        className={cn(card, "p-4")}
      >
        <p className="text-[12px] text-neutral-500">{t("weAsk")}</p>
        <ul className="mt-3 space-y-2.5">
          {qs.map((q, i) => (
            <motion.li
              key={q}
              className="flex items-center gap-2.5 text-[13.5px] text-neutral-700"
              {...drive(
                at,
                0.3 + i * 0.12,
                0.5 + i * 0.12,
                { opacity: 0, x: -8 },
                { opacity: 1, x: 0 },
                { delay: 0.3 + i * 0.15 }
              )}
            >
              <span className="size-1.5 rounded-full bg-[#3b82f6]" />
              {q}
            </motion.li>
          ))}
        </ul>
      </Rise>
    </div>
  )
}

function ScopeVisual({ at }: VisualProps) {
  const t = useTranslations("services.engagement.scope")
  const rows = t.raw("rows") as { key: string; value: string }[]
  return (
    <Rise
      p={at === undefined ? undefined : seg(at, 0, 0.25)}
      className={cn(card, "w-full max-w-[460px] overflow-hidden")}
    >
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <FileCheck2 className="size-4 text-violet-600" /> {t("title")}
        </span>
        <motion.span
          className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700"
          {...drive(
            at,
            0.6,
            0.75,
            { scale: 0 },
            { scale: 1 },
            { type: "spring", stiffness: 500, damping: 20, delay: 0.9 }
          )}
        >
          <Check className="size-3" strokeWidth={3} /> {t("signedOff")}
        </motion.span>
      </div>
      <dl className="divide-y divide-black/[0.06]">
        {rows.map(({ key: k, value: v }, i) => (
          <motion.div
            key={i}
            className="grid grid-cols-[90px_1fr] gap-4 px-5 py-3 text-[13px] max-md:grid-cols-[64px_1fr] max-md:gap-3 max-md:px-4"
            {...drive(
              at,
              0.15 + i * 0.12,
              0.35 + i * 0.12,
              { opacity: 0 },
              { opacity: 1 },
              { delay: 0.15 + i * 0.12 }
            )}
          >
            <dt className="text-neutral-500">{k}</dt>
            <dd className="text-neutral-800">{v}</dd>
          </motion.div>
        ))}
      </dl>
    </Rise>
  )
}

function BuildVisual({ at }: VisualProps) {
  const t = useTranslations("services.engagement.build")
  // PR titles and "Merged" read like git output, so they stay in English.
  const prs = [
    ["#12", "Connect ERP read-only", "merged"],
    ["#18", "Invoice extraction model", "merged"],
    ["#23", "Approval rules from policy", "merged"],
    ["#27", "Deploy to private cloud", "running"],
  ]
  return (
    <Rise
      p={at === undefined ? undefined : seg(at, 0, 0.25)}
      className={cn(card, "w-full max-w-[460px] overflow-hidden")}
    >
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3 max-md:px-4 max-md:py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <GitPullRequest className="size-4 text-orange-600" />{" "}
          your-org/invoice-agent
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <Lock className="size-3" /> {t("yourRepo")}
        </span>
      </div>
      <ul className="divide-y divide-black/[0.06]">
        {prs.map(([n, title, st], i) => (
          <motion.li
            key={n}
            className="flex items-center gap-3 px-5 py-3 text-[13px] max-md:gap-2.5 max-md:px-4 max-md:py-2.5"
            {...drive(
              at,
              0.15 + i * 0.12,
              0.35 + i * 0.12,
              { opacity: 0, x: -8 },
              { opacity: 1, x: 0 },
              { delay: 0.15 + i * 0.14 }
            )}
          >
            <span className="w-8 text-neutral-500 tabular-nums max-md:w-7">
              {n}
            </span>
            <span className="flex-1 text-neutral-800">{title}</span>
            {st === "merged" ? (
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                Merged
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                <span className="size-1.5 animate-pulse rounded-full bg-orange-500" />{" "}
                {t("deploying")}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

function PilotVisual({ at }: VisualProps) {
  const t = useTranslations("services.engagement.pilot")
  const bars = [22, 34, 41, 55, 63, 72, 81]
  return (
    <div className="grid w-full max-w-[460px] gap-3">
      <Rise
        p={at === undefined ? undefined : seg(at, 0, 0.2)}
        className={cn(card, "p-5 max-md:p-4")}
      >
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] text-neutral-500">{t("handled")}</p>
          <p className="text-[28px] leading-none font-medium tracking-[-0.03em] text-emerald-700 tabular-nums">
            {/* Phones: the figure climbs with the bars */}
            {at === undefined
              ? 81
              : Math.round(
                  bars[0] +
                    (bars[bars.length - 1] - bars[0]) * seg(at, 0.1, 0.72)
                )}
            %
          </p>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2 max-md:h-20">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background:
                  i === bars.length - 1 ? "#10b981" : "rgb(16 185 129 / 0.25)",
              }}
              {...(at === undefined
                ? {
                    initial: { height: 0 },
                    animate: { height: `${h}%` },
                    transition: { duration: 0.6, ease, delay: 0.1 + i * 0.07 },
                  }
                : {
                    initial: false as const,
                    animate: {
                      height: `${h * seg(at, 0.1 + i * 0.07, 0.3 + i * 0.07)}%`,
                    },
                    transition: { duration: 0 },
                  })}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-neutral-500">{t("weeks")}</p>
      </Rise>
      <Rise
        delay={0.2}
        p={at === undefined ? undefined : seg(at, 0.55, 0.75)}
        className={cn(
          card,
          "flex items-center justify-between p-4 text-[13px]"
        )}
      >
        <span className="text-neutral-700">{t("team")}</span>
        <span className="flex">
          {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"].map(
            (c, i) => (
              <span
                key={c}
                className="-ml-1.5 size-6 rounded-full border-2 border-white first:ml-0"
                style={{ background: c, zIndex: 5 - i }}
              />
            )
          )}
          <span className="ml-2 text-neutral-500">{t("people")}</span>
        </span>
      </Rise>
    </div>
  )
}

function HandoverVisual({ at }: VisualProps) {
  const t = useTranslations("services.engagement.handover")
  const items = t.raw("items") as { text: string; tag: string }[]
  return (
    <Rise
      p={at === undefined ? undefined : seg(at, 0, 0.2)}
      className={cn(card, "w-full max-w-[460px] p-5 max-md:p-4")}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <LifeBuoy className="size-4 text-teal-600" /> {t("title")}
        </span>
        <span className="text-[11px] text-neutral-500">{t("owns")}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map(({ text, tag }, i) => (
          <motion.li
            key={i}
            className="flex items-center gap-3 text-[13.5px] max-md:gap-2.5 max-md:text-[13px]"
            {...drive(
              at,
              0.15 + i * 0.14,
              0.3 + i * 0.14,
              { opacity: 0 },
              { opacity: 1 },
              { delay: 0.15 + i * 0.15 }
            )}
          >
            <motion.span
              className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-600 text-white"
              {...drive(
                at,
                0.2 + i * 0.14,
                0.33 + i * 0.14,
                { scale: 0 },
                { scale: 1 },
                {
                  type: "spring",
                  stiffness: 500,
                  damping: 18,
                  delay: 0.25 + i * 0.15,
                }
              )}
            >
              <Check className="size-3" strokeWidth={3.5} />
            </motion.span>
            <span className="flex-1 text-neutral-800">{text}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              {tag}
            </span>
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

type PhaseId = "call" | "scope" | "build" | "pilot" | "handover"

// What stays in code; the words come from messages (`engagement.phases.<id>`).
const phaseMeta: (Pick<Phase, "icon" | "tone" | "desk" | "Visual"> & {
  id: PhaseId
})[] = [
  {
    id: "call",
    icon: CalendarDays,
    tone: "#3b82f6",
    desk: { bg: "#edf3fd", dot: "rgb(59 130 246 / 0.18)" },
    Visual: CallVisual,
  },
  {
    id: "scope",
    icon: FileCheck2,
    tone: "#8b5cf6",
    desk: { bg: "#f2eefc", dot: "rgb(139 92 246 / 0.18)" },
    Visual: ScopeVisual,
  },
  {
    id: "build",
    icon: GitPullRequest,
    tone: "#f97316",
    desk: { bg: "#fbf0e8", dot: "rgb(234 88 12 / 0.16)" },
    Visual: BuildVisual,
  },
  {
    id: "pilot",
    icon: LineChart,
    tone: "#10b981",
    desk: { bg: "#eaf6ef", dot: "rgb(16 185 129 / 0.2)" },
    Visual: PilotVisual,
  },
  {
    id: "handover",
    icon: LifeBuoy,
    tone: "#14b8a6",
    desk: { bg: "#e9f5f3", dot: "rgb(13 148 136 / 0.18)" },
    Visual: HandoverVisual,
  },
]

/** The light, dotted desk a phase's mockup sits on. */
function deskStyle({ desk }: Phase): React.CSSProperties {
  return {
    backgroundColor: desk.bg,
    backgroundImage: `radial-gradient(${desk.dot} 1.2px, transparent 1.4px)`,
    backgroundSize: "18px 18px",
  }
}

const PHASES = phaseMeta.length

/** The five phases with their text in the current language. */
function usePhases(): Phase[] {
  const t = useTranslations("services.engagement.phases")
  return phaseMeta.map((m) => ({
    ...m,
    when: t(`${m.id}.when`),
    short: t(`${m.id}.short`),
    title: t(`${m.id}.title`),
    line: t(`${m.id}.line`),
    get: t.raw(`${m.id}.get`) as string[],
  }))
}

function Header() {
  const t = useTranslations("services.engagement")
  const mail = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(t("mailSubject"))}`
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Eyebrow className="text-white/50">{t("eyebrow")}</Eyebrow>
        <SplitReveal
          id="engagement-heading"
          text={t("title")}
          className="mt-5 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[1] font-medium tracking-[-0.045em]"
        />
      </div>
      <PillLink href={mail} size="lg" icon="external" className="w-fit">
        {t("book")}
      </PillLink>
    </div>
  )
}

/** The phase details: when, title, line, what you get. */
function PhaseCopy({ phase }: Readonly<{ phase: Phase }>) {
  const t = useTranslations("services.engagement")
  return (
    <div>
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium"
        style={{ background: `${phase.tone}26`, color: phase.tone }}
      >
        <phase.icon className="size-3.5" />
        {phase.when}
      </span>
      <h3 className="mt-5 text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.035em]">
        {phase.title}
      </h3>
      <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/60">
        {phase.line}
      </p>
      <p className="mt-8 text-[12px] font-medium tracking-[0.08em] text-white/60 uppercase">
        {t("youGet")}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {phase.get.map((g) => (
          <li
            key={g}
            className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[13px] text-white/80"
          >
            <Check
              className="size-3.5"
              style={{ color: phase.tone }}
              strokeWidth={3}
            />
            {g}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Where each phase sits on the week ruler: [start week, end week).
const spans: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 6],
  [6, 9],
  [9, 11],
]
const WEEKS = 11

// Phones: the same ruler, but the one-week phases get wider columns (and
// the later weeks narrower ones) so every phase name fits in its bar.
const phoneWeeks = [
  2.4, 2.4, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1.9, 1.9,
]
const phoneEdges = phoneWeeks.reduce<number[]>(
  (acc, w) => [...acc, acc[acc.length - 1] + w],
  [0]
)
const phoneTotal = phoneEdges[WEEKS]
/** Where week `w` (may be fractional) starts on the phone ruler, in %. */
function phoneX(w: number) {
  const i = Math.min(WEEKS - 1, Math.floor(w))
  const x = phoneEdges[i] + (w - i) * phoneWeeks[i]
  return (x / phoneTotal) * 100
}

/**
 * The plan as a Gantt-style timeline: a week ruler, one bar per phase at
 * its real length, and a "you are here" line that glides along the weeks
 * with the scroll. Passed bars fill, the current one glows.
 */
function Timeline({
  phases,
  progress,
  active,
  onPick,
  compact = false,
}: Readonly<{
  phases: Phase[]
  progress: MotionValue<number>
  active: number
  onPick: (i: number) => void
  /** Phones: a slimmer ruler with names only, sized to fit. */
  compact?: boolean
}>) {
  const t = useTranslations("services.engagement")
  const n = phases.length
  // Within phase i (progress i/n … (i+1)/n) the marker crosses its weeks.
  const at = useTransform(progress, (v) => {
    const seg = Math.min(n - 0.0001, Math.max(0, v * n))
    const i = Math.floor(seg)
    const [s0, s1] = spans[i]
    if (compact) return phoneX(s0 + (seg - i) * (s1 - s0))
    return ((s0 + (seg - i) * (s1 - s0)) / WEEKS) * 100
  })
  const left = useTransform(at, (x) => `${x}%`)
  return (
    <div className="relative">
      {/* Week ruler. Phones label each phase's span ("W2–5") over its bar,
          as single weeks don't fit. */}
      {compact ? (
        <div className="relative h-[22px] text-[11px] text-white/55 tabular-nums">
          {spans.map(([s0, s1], i) => (
            <span
              key={s0}
              className={cn(
                "absolute top-0 text-center whitespace-nowrap transition-colors duration-300",
                i === active && "text-white"
              )}
              style={{
                left: `${phoneX(s0)}%`,
                width: `${phoneX(s1) - phoneX(s0)}%`,
              }}
            >
              {i === spans.length - 1
                ? t("then")
                : s1 - s0 > 1
                  ? `${t("week", { n: s0 })}–${s1 - 1}`
                  : t("week", { n: s0 })}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="grid text-[11px] text-white/55 tabular-nums"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: WEEKS }, (_, w) => (
            <span key={w} className="border-l border-white/10 pb-2 pl-1.5">
              {w < 10 ? t("week", { n: w }) : t("then")}
            </span>
          ))}
        </div>
      )}
      {/* Phase bars */}
      <div
        className={cn(
          "relative rounded-xl bg-white/[0.03]",
          compact ? "h-9" : "h-11"
        )}
      >
        {phases.map((p, i) => {
          const [s0, s1] = spans[i]
          const done = i < active
          const now = i === active
          const x0 = compact ? phoneX(s0) : (s0 / WEEKS) * 100
          const x1 = compact ? phoneX(s1) : (s1 / WEEKS) * 100
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPick(i)}
              className="group absolute inset-y-1 px-0.5"
              style={{ left: `${x0}%`, width: `${x1 - x0}%` }}
            >
              <motion.span
                className={cn(
                  "flex h-full items-center overflow-hidden font-medium whitespace-nowrap",
                  compact
                    ? "justify-center rounded-md px-0.5 text-[11px]"
                    : "gap-1.5 rounded-lg px-2.5 text-[12px]"
                )}
                animate={{
                  backgroundColor: now
                    ? p.tone
                    : done
                      ? `${p.tone}59`
                      : "rgba(255,255,255,0.06)",
                  // Dark text on the bright current bar: white on these
                  // tones falls below readable contrast.
                  color: now
                    ? "#0a0a0a"
                    : done
                      ? "#ffffff"
                      : "rgba(255,255,255,0.6)",
                  boxShadow: now
                    ? `0 0 0 1px ${p.tone}, 0 8px 24px -8px ${p.tone}`
                    : "0 0 0 1px rgba(255,255,255,0)",
                }}
                transition={{ duration: 0.35 }}
              >
                {!compact && <p.icon className="size-3.5 shrink-0" />}
                <span className="truncate">{p.short}</span>
              </motion.span>
            </button>
          )
        })}
        {/* You are here */}
        <motion.span
          className={cn(
            "pointer-events-none absolute z-10 w-px bg-white",
            compact ? "-top-7 -bottom-1.5" : "-top-9 -bottom-2"
          )}
          style={{ left }}
        >
          <span className="absolute -top-1 -left-[3px] size-[7px] rounded-full bg-white" />
        </motion.span>
      </div>
    </div>
  )
}

function Pinned() {
  const phases = usePhases()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // JS copy: native scroll timelines mis-measure sticky content.
  const progress = useMotionValue(0)
  const [active, setActive] = useState(0)
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        progress.set(v)
        setActive(Math.min(PHASES - 1, Math.floor(v * PHASES)))
      }),
    [scrollYProgress, progress]
  )
  const pick = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    smoothScrollTo(top + span * ((i + 0.5) / PHASES))
  }
  const phase = phases[active]
  return (
    <div ref={ref} data-how-start className="relative h-[520svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-[min(3rem,5svh)] px-14 pt-16">
        <Header />
        <Timeline
          phases={phases}
          progress={progress}
          active={active}
          onPick={pick}
        />
        <div className="grid min-h-[min(380px,44svh)] grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-10 sm:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
            >
              <PhaseCopy phase={phase} />
            </motion.div>
          </AnimatePresence>
          <div
            className="relative flex h-full min-h-[min(380px,44svh)] items-center justify-center overflow-hidden rounded-[28px] p-8 transition-colors duration-700"
            style={deskStyle(phase)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                aria-hidden="true"
                key={phase.id}
                className="flex w-full justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <phase.Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Phones: the heading scrolls by, then the phases pin and play one at a
 * time. The desktop timeline sits on top as the "you are here", and each
 * phase's visual is driven by the scroll (as on the Platform page).
 */
function PhoneSequence() {
  const phases = usePhases()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const progress = useMotionValue(0)
  const [active, setActive] = useState(0)
  // Where the current phase's visual is (0–1). It finishes three quarters
  // of the way through the phase, so each one is seen complete.
  const [at, setAt] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.set(v)
    const i = Math.min(PHASES - 1, Math.floor(v * PHASES))
    setActive(i)
    setAt(Math.min(1, Math.max(0, (v * PHASES - i) / 0.75)))
  })
  // Tapping a bar scrolls to the middle of its phase.
  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    smoothScrollTo(top + span * ((i + 0.5) / PHASES), 1.1)
  }
  const phase = phases[active]
  return (
    <div className="pt-16 pb-6">
      <div className="px-5">
        <Header />
      </div>
      <div ref={ref} data-how-start className="relative h-[450svh]">
        {/* Top-aligned, with fixed heights for the text and the visual, so
            nothing moves from one phase to the next */}
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col px-5 pt-[min(2.75rem,6svh)] pb-4">
          <Timeline
            compact
            phases={phases}
            progress={progress}
            active={active}
            onPick={jump}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase.id}
              className="mt-[min(2rem,4svh)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium"
                style={{ background: `${phase.tone}26`, color: phase.tone }}
              >
                <phase.icon className="size-3.5" />
                {phase.when}
              </span>
              {/* Room for a two-line title and description together, so the
                  description sits right under the title and the visual
                  below never moves */}
              <div className="mt-3 min-h-[6.75rem]">
                <h3 className="text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-balance">
                  {phase.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-normal text-white/60">
                  {phase.line}
                </p>
              </div>
              <div
                aria-hidden="true"
                className="mt-[min(1.25rem,2.5svh)] flex h-[min(20rem,calc(100svh-23rem))] items-center justify-center rounded-[24px] px-4"
                style={deskStyle(phase)}
              >
                <phase.Visual at={at} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Stacked() {
  const phases = usePhases()
  return (
    <div className="px-5 py-16 sm:px-10 sm:py-24">
      <Header />
      <ol className="mt-10 space-y-14 sm:mt-14">
        {phases.map((p) => (
          <li key={p.id} className="grid gap-6">
            <PhaseCopy phase={p} />
            <div
              aria-hidden="true"
              className="flex justify-center rounded-[24px] p-5 sm:p-8"
              style={deskStyle(p)}
            >
              <p.Visual />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Phones (< 768px), tablets, or desktop (≥ 1024px); null until mounted. */
function useLayout() {
  const [layout, setLayout] = useState<"phone" | "tablet" | "desktop">()
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)")
    const md = window.matchMedia("(min-width: 768px)")
    const update = () =>
      setLayout(lg.matches ? "desktop" : md.matches ? "tablet" : "phone")
    update()
    lg.addEventListener("change", update)
    md.addEventListener("change", update)
    return () => {
      lg.removeEventListener("change", update)
      md.removeEventListener("change", update)
    }
  }, [])
  return layout
}

export function Engagement() {
  const layout = useLayout()
  const reduce = useReducedMotion()
  return (
    <ExpandingPanel
      id="how-we-work"
      aria-labelledby="engagement-heading"
      className="scroll-mt-20"
    >
      {reduce ? (
        <Stacked />
      ) : layout === "desktop" ? (
        <Pinned />
      ) : layout === "phone" ? (
        <PhoneSequence />
      ) : (
        <Stacked />
      )}
    </ExpandingPanel>
  )
}
