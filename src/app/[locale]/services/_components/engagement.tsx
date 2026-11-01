"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
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
  when: string
  title: string
  line: string
  get: string[]
  short: string
  icon: LucideIcon
  tone: string
  Visual: () => React.JSX.Element
}

const card =
  "rounded-2xl border border-white/10 bg-white/[0.04] text-white backdrop-blur-sm"

function Rise({
  delay = 0,
  className,
  children,
}: Readonly<{
  delay?: number
  className?: string
  children: React.ReactNode
}>) {
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

function CallVisual() {
  const t = useTranslations("services.engagement.call")
  const qs = t.raw("questions") as string[]
  return (
    <div className="grid w-full max-w-[460px] gap-3">
      <Rise className={cn(card, "flex items-center gap-4 p-4")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#3b82f6]/20 text-[#93c5fd]">
          <CalendarDays className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium">{t("title")}</span>
          <span className="block text-[12.5px] text-white/50">{t("meta")}</span>
        </span>
        <span className="rounded-full bg-[#10b981]/15 px-2.5 py-1 text-[11px] text-[#6ee7b7]">
          {t("free")}
        </span>
      </Rise>
      <Rise delay={0.12} className={cn(card, "p-4")}>
        <p className="text-[12px] text-white/45">{t("weAsk")}</p>
        <ul className="mt-3 space-y-2.5">
          {qs.map((q, i) => (
            <motion.li
              key={q}
              className="flex items-center gap-2.5 text-[13.5px] text-white/85"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
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

function ScopeVisual() {
  const t = useTranslations("services.engagement.scope")
  const rows = t.raw("rows") as { key: string; value: string }[]
  return (
    <Rise className={cn(card, "w-full max-w-[460px] overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <FileCheck2 className="size-4 text-[#c4b5fd]" /> {t("title")}
        </span>
        <motion.span
          className="flex items-center gap-1 rounded-full bg-[#8b5cf6]/20 px-2.5 py-0.5 text-[11px] text-[#ddd6fe]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
            delay: 0.9,
          }}
        >
          <Check className="size-3" strokeWidth={3} /> {t("signedOff")}
        </motion.span>
      </div>
      <dl className="divide-y divide-white/[0.07]">
        {rows.map(({ key: k, value: v }, i) => (
          <motion.div
            key={i}
            className="grid grid-cols-[90px_1fr] gap-4 px-5 py-3 text-[13px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.12 }}
          >
            <dt className="text-white/45">{k}</dt>
            <dd className="text-white/90">{v}</dd>
          </motion.div>
        ))}
      </dl>
    </Rise>
  )
}

function BuildVisual() {
  const t = useTranslations("services.engagement.build")
  // PR titles and "Merged" read like git output, so they stay in English.
  const prs = [
    ["#12", "Connect ERP read-only", "merged"],
    ["#18", "Invoice extraction model", "merged"],
    ["#23", "Approval rules from policy", "merged"],
    ["#27", "Deploy to private cloud", "running"],
  ]
  return (
    <Rise className={cn(card, "w-full max-w-[460px] overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <GitPullRequest className="size-4 text-[#fdba74]" />{" "}
          your-org/invoice-agent
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-white/50">
          <Lock className="size-3" /> {t("yourRepo")}
        </span>
      </div>
      <ul className="divide-y divide-white/[0.07]">
        {prs.map(([n, title, st], i) => (
          <motion.li
            key={n}
            className="flex items-center gap-3 px-5 py-3 text-[13px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.14 }}
          >
            <span className="w-8 text-white/40 tabular-nums">{n}</span>
            <span className="flex-1 text-white/90">{title}</span>
            {st === "merged" ? (
              <span className="rounded-full bg-[#8b5cf6]/20 px-2 py-0.5 text-[11px] text-[#ddd6fe]">
                Merged
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-[#f97316]/15 px-2 py-0.5 text-[11px] text-[#fdba74]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#f97316]" />{" "}
                {t("deploying")}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </Rise>
  )
}

function PilotVisual() {
  const t = useTranslations("services.engagement.pilot")
  const bars = [22, 34, 41, 55, 63, 72, 81]
  return (
    <div className="grid w-full max-w-[460px] gap-3">
      <Rise className={cn(card, "p-5")}>
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] text-white/45">{t("handled")}</p>
          <p className="text-[28px] leading-none font-medium tracking-[-0.03em] text-[#6ee7b7] tabular-nums">
            81%
          </p>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background:
                  i === bars.length - 1 ? "#10b981" : "rgb(16 185 129 / 0.3)",
              }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.07 }}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/40">{t("weeks")}</p>
      </Rise>
      <Rise
        delay={0.2}
        className={cn(
          card,
          "flex items-center justify-between p-4 text-[13px]"
        )}
      >
        <span className="text-white/70">{t("team")}</span>
        <span className="flex">
          {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"].map(
            (c, i) => (
              <span
                key={c}
                className="-ml-1.5 size-6 rounded-full border-2 border-black first:ml-0"
                style={{ background: c, zIndex: 5 - i }}
              />
            )
          )}
          <span className="ml-2 text-white/50">{t("people")}</span>
        </span>
      </Rise>
    </div>
  )
}

function HandoverVisual() {
  const t = useTranslations("services.engagement.handover")
  const items = t.raw("items") as { text: string; tag: string }[]
  return (
    <Rise className={cn(card, "w-full max-w-[460px] p-5")}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <LifeBuoy className="size-4 text-[#5eead4]" /> {t("title")}
        </span>
        <span className="text-[11px] text-white/45">{t("owns")}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map(({ text, tag }, i) => (
          <motion.li
            key={i}
            className="flex items-center gap-3 text-[13.5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.15 }}
          >
            <motion.span
              className="grid size-5 shrink-0 place-items-center rounded-full bg-[#14b8a6] text-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 18,
                delay: 0.25 + i * 0.15,
              }}
            >
              <Check className="size-3" strokeWidth={3.5} />
            </motion.span>
            <span className="flex-1 text-white/85">{text}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/50">
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
const phaseMeta: (Pick<Phase, "icon" | "tone" | "Visual"> & { id: PhaseId })[] =
  [
    { id: "call", icon: CalendarDays, tone: "#3b82f6", Visual: CallVisual },
    { id: "scope", icon: FileCheck2, tone: "#8b5cf6", Visual: ScopeVisual },
    { id: "build", icon: GitPullRequest, tone: "#f97316", Visual: BuildVisual },
    { id: "pilot", icon: LineChart, tone: "#10b981", Visual: PilotVisual },
    { id: "handover", icon: LifeBuoy, tone: "#14b8a6", Visual: HandoverVisual },
  ]

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
}: Readonly<{
  phases: Phase[]
  progress: MotionValue<number>
  active: number
  onPick: (i: number) => void
}>) {
  const t = useTranslations("services.engagement")
  const n = phases.length
  // Within phase i (progress i/n … (i+1)/n) the marker crosses its weeks.
  const at = useTransform(progress, (v) => {
    const seg = Math.min(n - 0.0001, Math.max(0, v * n))
    const i = Math.floor(seg)
    const [s0, s1] = spans[i]
    return ((s0 + (seg - i) * (s1 - s0)) / WEEKS) * 100
  })
  const left = useTransform(at, (x) => `${x}%`)
  return (
    <div className="relative">
      {/* Week ruler */}
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
      {/* Phase bars */}
      <div className="relative h-11 rounded-xl bg-white/[0.03]">
        {phases.map((p, i) => {
          const [s0, s1] = spans[i]
          const done = i < active
          const now = i === active
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPick(i)}
              className="group absolute inset-y-1 px-0.5"
              style={{
                left: `${(s0 / WEEKS) * 100}%`,
                width: `${((s1 - s0) / WEEKS) * 100}%`,
              }}
            >
              <motion.span
                className="flex h-full items-center gap-1.5 overflow-hidden rounded-lg px-2.5 text-[12px] font-medium whitespace-nowrap"
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
                <p.icon className="size-3.5 shrink-0" />
                <span className="truncate">{p.short}</span>
              </motion.span>
            </button>
          )
        })}
        {/* You are here */}
        <motion.span
          className="pointer-events-none absolute -top-9 -bottom-2 z-10 w-px bg-white"
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
    <div ref={ref} className="relative h-[520svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-[min(3rem,5svh)] px-14 pt-16">
        <Header />
        <Timeline
          phases={phases}
          progress={progress}
          active={active}
          onPick={pick}
        />
        <div className="grid min-h-[min(380px,44svh)] grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-16">
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
            style={{
              backgroundColor: `${phase.tone}14`,
              backgroundImage: `radial-gradient(${phase.tone}38 1.1px, transparent 1.3px)`,
              backgroundSize: "18px 18px",
            }}
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

function Stacked() {
  const phases = usePhases()
  return (
    <div className="px-5 py-24 sm:px-10">
      <Header />
      <ol className="mt-14 space-y-14">
        {phases.map((p) => (
          <li key={p.id} className="grid gap-6">
            <PhaseCopy phase={p} />
            <div
              aria-hidden="true"
              className="flex justify-center rounded-[24px] p-5 sm:p-8"
              style={{
                backgroundColor: `${p.tone}14`,
                backgroundImage: `radial-gradient(${p.tone}38 1.1px, transparent 1.3px)`,
                backgroundSize: "18px 18px",
              }}
            >
              <p.Visual />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const q = window.matchMedia("(min-width: 1024px)")
    const update = () => setDesktop(q.matches)
    update()
    q.addEventListener("change", update)
    return () => q.removeEventListener("change", update)
  }, [])
  return desktop
}

export function Engagement() {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  return (
    <ExpandingPanel
      id="how-we-work"
      aria-labelledby="engagement-heading"
      className="scroll-mt-20"
    >
      {desktop && !reduce ? <Pinned /> : <Stacked />}
    </ExpandingPanel>
  )
}
