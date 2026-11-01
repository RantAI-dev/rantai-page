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
} from "motion/react"
import {
  ArrowRight,
  Bot,
  Boxes,
  Check,
  Gauge,
  Hash,
  NotebookPen,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Eyebrow } from "@/components/shared/eyebrow"
import { smoothScrollTo } from "@/components/layout/smooth-scroll"
import { SplitReveal } from "@/components/shared/split-reveal"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

// "What's slowing you down?" Visitors pick the problem they have; the
// panel shows it before and after we step in, which service fits, and how
// long it usually takes. Figures are illustrative.

const ease = [0.22, 1, 0.36, 1] as const

type Problem = {
  id: string
  chip: string
  icon: LucideIcon
  tone: string
  service: string
  outcome: string
  steps: string[]
  weeks: string
  Before: () => React.JSX.Element
  After: () => React.JSX.Element
}

const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.04)]"

/* ------------------------------------------------------------------ */
/*  Slow app: response times                                           */
/* ------------------------------------------------------------------ */

function Latency({ good }: Readonly<{ good: boolean }>) {
  const bad =
    "M0,62 L20,40 L40,58 L60,18 L80,50 L100,10 L120,44 L140,22 L160,52 L180,8 L200,36"
  const ok =
    "M0,82 L20,80 L40,83 L60,79 L80,81 L100,80 L120,82 L140,79 L160,81 L180,80 L200,81"
  const t = useTranslations("services.problems.latency")
  const tone = good ? "#10b981" : "#ef4444"
  return (
    <div className={cn(card, "w-full max-w-[440px] p-5")}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] text-neutral-500">{t("label")}</p>
        <motion.p
          key={String(good)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[28px] leading-none font-medium tracking-[-0.03em] tabular-nums"
          style={{ color: tone }}
        >
          {good ? t("good") : t("bad")}
        </motion.p>
      </div>
      <svg
        viewBox="0 0 200 92"
        className="mt-4 h-[140px] w-full overflow-visible"
      >
        {[23, 46, 69].map((y) => (
          <line
            key={y}
            x1="0"
            x2="200"
            y1={y}
            y2={y}
            stroke="rgb(0 0 0 / 0.06)"
          />
        ))}
        <motion.path
          key={String(good)}
          d={good ? ok : bad}
          fill="none"
          stroke={tone}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <p className="mt-2 text-[12px] text-neutral-500">
        {good ? t("goodCaption") : t("badCaption")}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Legacy system: one monolith, then services, no downtime            */
/* ------------------------------------------------------------------ */

function Legacy({ good }: Readonly<{ good: boolean }>) {
  const t = useTranslations("services.problems.legacy")
  const parts = t.raw("parts") as string[]
  return (
    <div className={cn(card, "w-full max-w-[440px] p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-neutral-500">{t("label")}</p>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            good
              ? "bg-[#10b981]/12 text-[#059669]"
              : "bg-[#ef4444]/10 text-[#dc2626]"
          )}
        >
          {good ? t("goodBadge") : t("badBadge")}
        </span>
      </div>
      <div className="relative mt-4 h-[150px]">
        <AnimatePresence mode="popLayout">
          {good ? (
            parts.map((p, i) => (
              <motion.div
                key={i}
                className="absolute flex h-[66px] w-[calc(50%-6px)] flex-col justify-between rounded-xl border border-[#3b82f6]/25 bg-[#3b82f6]/[0.06] p-3"
                style={{
                  left: i % 2 ? "calc(50% + 6px)" : 0,
                  top: i < 2 ? 0 : 78,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: i % 2 ? -40 : 40,
                  y: i < 2 ? 30 : -30,
                }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              >
                <Boxes className="size-4 text-[#3b82f6]" />
                <span className="text-[12.5px] font-medium">
                  {t("service", { name: p })}
                </span>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="monolith"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <Server className="size-6 text-neutral-400" />
              <span className="text-[13px] font-medium text-neutral-600">
                legacy-erp.war
              </span>
              <span className="text-[11px] text-neutral-400">
                {t("deployAll")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  AI stuck in the demo: a notebook, then a live endpoint             */
/* ------------------------------------------------------------------ */

function DemoToProd({ good }: Readonly<{ good: boolean }>) {
  const t = useTranslations("services.problems.demo")
  const stats = t.raw("stats") as { value: string; label: string }[]
  return (
    <AnimatePresence mode="wait">
      {good ? (
        <motion.div
          key="prod"
          className={cn(card, "w-full max-w-[440px] p-5")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] font-medium">
              <Bot className="size-4 text-[#8b5cf6]" /> invoice-agent
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#059669]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#10b981]" />
              {t("live")}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stats.map(({ value: v, label: l }, i) => (
              <motion.div
                key={i}
                className="rounded-xl bg-neutral-50 px-3 py-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <p className="text-[18px] font-medium tracking-[-0.02em] tabular-nums">
                  {v}
                </p>
                <p className="text-[11px] text-neutral-500">{l}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 [font-family:ui-monospace,monospace] text-[11px] text-neutral-600">
            {t("monitored")}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="demo"
          className={cn(card, "w-full max-w-[440px] overflow-hidden")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5 text-[12px] text-neutral-500">
            <NotebookPen className="size-3.5" /> demo_final_v3.ipynb
          </div>
          <div className="space-y-2 p-4 [font-family:ui-monospace,monospace] text-[11.5px]">
            <p className="text-neutral-700">model.predict(sample_invoice)</p>
            <p className="text-[#059669]">{t("works")}</p>
            <p className="text-neutral-700">deploy_to_production()</p>
            <p className="text-[#dc2626]">{t("broken")}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Short on engineers: a backlog, then our team joins and it moves    */
/* ------------------------------------------------------------------ */

function Backlog({ good }: Readonly<{ good: boolean }>) {
  const t = useTranslations("services.problems.backlog")
  const tickets = t.raw("tickets") as string[]
  const columns = t.raw("columns") as string[]
  return (
    <div className={cn(card, "w-full max-w-[440px] p-5")}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[12px] text-neutral-500">
          <Hash className="size-3.5" /> product-team
        </p>
        <div className="flex">
          {[
            { i: "YT", c: "#a3a3a3" },
            ...(good
              ? [
                  { i: "RA", c: "#3b82f6" },
                  { i: "MC", c: "#8b5cf6" },
                  { i: "IS", c: "#10b981" },
                ]
              : []),
          ].map((p, k) => (
            <motion.span
              key={p.i}
              className="-ml-1.5 grid size-6 place-items-center rounded-full border-2 border-white text-[8px] font-semibold text-white first:ml-0"
              style={{ background: p.c }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 22,
                delay: k * 0.1,
              }}
            >
              {p.i}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {columns.map((col, c) => (
          <div key={c} className="rounded-xl bg-neutral-50 p-2.5">
            <p className="px-1 text-[11px] font-medium text-neutral-500">
              {col}
            </p>
            <ul className="mt-2 min-h-[132px] space-y-1.5">
              {tickets
                .map((label, i) => ({ label, i }))
                .filter(({ i }) =>
                  good ? (c === 1 ? i < 4 : i >= 4) : c === 0
                )
                .map(({ label, i }) => (
                  <motion.li
                    key={i}
                    layoutId={`ticket-${i}`}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    transition={{ duration: 0.5, ease }}
                  >
                    {c === 1 && (
                      <Check
                        className="size-3 text-[#10b981]"
                        strokeWidth={3}
                      />
                    )}
                    {label}
                  </motion.li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

type ProblemId = "slow" | "legacy" | "ai" | "people"

// What stays in code; the words come from messages (`problems.items.<id>`).
// Service names are product names and stay in English.
const problemMeta: (Omit<Problem, "chip" | "outcome" | "steps" | "weeks"> & {
  id: ProblemId
})[] = [
  {
    id: "slow",
    icon: Gauge,
    tone: "#ef4444",
    service: "Software Engineering",
    Before: () => <Latency good={false} />,
    After: () => <Latency good />,
  },
  {
    id: "legacy",
    icon: Server,
    tone: "#3b82f6",
    service: "Software Engineering",
    Before: () => <Legacy good={false} />,
    After: () => <Legacy good />,
  },
  {
    id: "ai",
    icon: Bot,
    tone: "#8b5cf6",
    service: "AI Engineering",
    Before: () => <DemoToProd good={false} />,
    After: () => <DemoToProd good />,
  },
  {
    id: "people",
    icon: Users,
    tone: "#10b981",
    service: "Forward Deployed Engineering",
    Before: () => <Backlog good={false} />,
    After: () => <Backlog good />,
  },
]

/** The four problems with their text in the current language. */
function useProblems(): Problem[] {
  const t = useTranslations("services.problems.items")
  return problemMeta.map((m) => ({
    ...m,
    chip: t(`${m.id}.chip`),
    outcome: t(`${m.id}.outcome`),
    steps: t.raw(`${m.id}.steps`) as string[],
    weeks: t(`${m.id}.weeks`),
  }))
}

function ProgressSegment({
  progress,
  index,
  count,
  tone,
  label,
  active,
}: Readonly<{
  progress: MotionValue<number>
  index: number
  count: number
  tone: string
  label: string
  active: boolean
}>) {
  const fill = useTransform(progress, (v) =>
    Math.min(1, Math.max(0, v * count - index))
  )
  return (
    <div className="flex flex-col gap-2">
      <span className="h-1 overflow-hidden rounded-full bg-neutral-200">
        <motion.span
          className="block h-full origin-left rounded-full"
          style={{ scaleX: fill, background: tone }}
        />
      </span>
      <span
        className={cn(
          "truncate text-[12px] transition-colors duration-300",
          active ? "font-medium text-neutral-900" : "text-neutral-500"
        )}
      >
        {label}
      </span>
    </div>
  )
}

/** The tall scroll track; reports how far through it the page has scrolled. */
function PinnedTrack({
  trackRef,
  onProgress,
  children,
}: Readonly<{
  trackRef: React.RefObject<HTMLDivElement | null>
  onProgress: (v: number) => void
  children: React.ReactNode
}>) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })
  useMotionValueEvent(scrollYProgress, "change", onProgress)
  return (
    <div ref={trackRef} data-problem-track className="relative h-[420svh]">
      {children}
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

export function ProblemPicker() {
  const t = useTranslations("services.problems")
  const problems = useProblems()
  const reduce = useReducedMotion()
  const desktop = useIsDesktop()
  // Desktop: the section pins and scroll walks through the problems, each
  // showing its "before" and then its fix. Elsewhere it is click-driven.
  const pinned = desktop && !reduce
  const [pick, setPick] = useState(0)
  const [after, setAfter] = useState(false)
  const p = problems[pick]

  const trackRef = useRef<HTMLDivElement | null>(null)
  const progress = useMotionValue(0)
  const onProgress = (v: number) => {
    progress.set(v)
    const seg = Math.min(
      problems.length - 0.001,
      Math.max(0, v) * problems.length
    )
    const i = Math.floor(seg)
    setPick(i)
    setAfter(seg - i > 0.45)
  }
  /** Scroll to problem `i`, on its before (0.15) or after (0.75) half. */
  const scrollTo = (i: number, half: number) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    smoothScrollTo(top + span * ((i + half) / problems.length))
  }
  const choose = (i: number) => (pinned ? scrollTo(i, 0.15) : setPick(i))
  const flip = (toAfter: boolean) =>
    pinned ? scrollTo(pick, toAfter ? 0.75 : 0.15) : setAfter(toAfter)

  // Links to #forward-deployed-engineering open on the engineers problem.
  useEffect(() => {
    if (window.location.hash === "#forward-deployed-engineering") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once on load
      setPick(3)
    }
  }, [])

  // Click-driven: each pick shows the "before" first, then the fix.
  useEffect(() => {
    if (pinned) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset per pick
    setAfter(Boolean(reduce))
    if (reduce) return
    const timer = setTimeout(() => setAfter(true), 1800)
    return () => clearTimeout(timer)
  }, [pick, reduce, pinned])

  const View = after ? p.After : p.Before
  const mail = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(p.chip)}`

  const header = (
    <>
      <span id="forward-deployed-engineering" className="block scroll-mt-20" />
      <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
      <SplitReveal
        id="problem-heading"
        text={t("title")}
        className={cn(
          "mt-5 font-medium tracking-[-0.045em] text-neutral-950",
          pinned
            ? "text-[clamp(2.25rem,4.2vw,4rem)]"
            : "text-[clamp(2.25rem,5vw,4.5rem)]",
          "leading-[1]"
        )}
      />
    </>
  )

  const body = (
    <>
      {/* Problems */}
      <div
        role="tablist"
        aria-label={t("tablist")}
        className={cn(
          "-mx-5 flex gap-2.5",
          pinned ? "mt-[min(2.5rem,4svh)]" : "mt-12",
          "overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        )}
      >
        {problems.map((q, i) => {
          const on = i === pick
          return (
            <button
              key={q.id}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => choose(i)}
              className={cn(
                "relative isolate flex h-12 shrink-0 items-center gap-2.5 rounded-full border pr-5 pl-2 text-[15px] font-medium whitespace-nowrap transition-colors",
                on
                  ? "border-transparent text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
              )}
            >
              {on && (
                <motion.span
                  layoutId="problem-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-neutral-950"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className="grid size-8 place-items-center rounded-full"
                style={{
                  background: on ? "rgb(255 255 255 / 0.12)" : `${q.tone}14`,
                  color: on ? "#fff" : q.tone,
                }}
              >
                <q.icon className="size-4" />
              </span>
              {q.chip}
            </button>
          )
        })}
      </div>

      {/* The answer */}
      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div
          className="relative flex h-[440px] flex-col items-center gap-6 overflow-hidden rounded-[28px] p-6 transition-colors duration-700 sm:p-10 lg:h-[min(470px,52svh)]"
          style={{
            backgroundColor: `${p.tone}0f`,
            backgroundImage: `radial-gradient(${p.tone}2e 1.2px, transparent 1.4px)`,
            backgroundSize: "18px 18px",
          }}
        >
          {/* Before / after */}
          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
            {[t("before"), t("after")].map((label, i) => {
              const on = (i === 1) === after
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => flip(i === 1)}
                  className={cn(
                    "relative isolate rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                    on
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-800"
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="before-after"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ background: i === 1 ? p.tone : "#737373" }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  )}
                  {label}
                </button>
              )
            })}
          </div>
          {/* Before and after cross-fade in one fixed slot, so nothing jumps */}
          <div className="relative w-full flex-1">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${p.id}-${after}`}
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center max-md:filter-none!"
                initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease }}
              >
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative h-[460px] overflow-hidden rounded-[28px] bg-neutral-100 lg:h-[min(470px,52svh)]">
          <AnimatePresence initial={false}>
            <motion.div
              key={p.id}
              className="absolute inset-0 flex flex-col p-7 sm:p-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease }}
            >
              <span
                className="flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium text-neutral-900"
                style={{ background: `${p.tone}24` }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: p.tone }}
                />
                {p.service}
              </span>
              <h3 className="mt-5 line-clamp-2 min-h-[2.1em] text-[clamp(1.6rem,2.3vw,2.25rem)] leading-[1.05] font-medium tracking-[-0.035em] text-neutral-950">
                {p.outcome}
              </h3>
              <ol className="mt-6 space-y-3">
                {p.steps.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 text-[16px] text-neutral-700"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[12px] font-medium text-neutral-500 tabular-nums">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.07] pt-6">
                <span className="w-full text-[14px] text-neutral-600">
                  {t.rich("typically", {
                    weeks: p.weeks,
                    b: (chunks) => (
                      <span className="font-medium text-neutral-900">
                        {chunks}
                      </span>
                    ),
                  })}
                </span>
                <a
                  href="#how-we-work"
                  className="text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {t("seeHow")}
                </a>
                <a
                  href={mail}
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 text-[14px] font-medium text-white"
                >
                  {t("talk")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )

  if (!pinned)
    return (
      <section
        id="what-we-do"
        aria-labelledby="problem-heading"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
      >
        {header}
        {body}
      </section>
    )

  return (
    <section
      id="what-we-do"
      aria-labelledby="problem-heading"
      className="scroll-mt-20 pt-24 lg:pt-28"
    >
      <PinnedTrack trackRef={trackRef} onProgress={onProgress}>
        <div className="sticky top-16 mx-auto flex h-[calc(100svh-4rem)] max-w-[1440px] flex-col justify-center px-14">
          {header}
          {body}
          {/* How far through the four problems, filling with the scroll */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {problems.map((q, i) => (
              <ProgressSegment
                key={q.id}
                progress={progress}
                index={i}
                count={problems.length}
                tone={q.tone}
                label={q.chip}
                active={i === pick}
              />
            ))}
          </div>
        </div>
      </PinnedTrack>
    </section>
  )
}
