"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react"
import { ArrowRight, ArrowUp, Check } from "lucide-react"
import { useTranslations } from "next-intl"

import { smoothScrollTo } from "@/components/layout/smooth-scroll"
import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { useEdgeFade } from "@/hooks/use-edge-fade"
import { useMediaQuery } from "@/hooks/use-media-query"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

// "What's slowing you down?" as a short chat: the visitor taps one of the
// four problems, it is sent as their message, RantAI "types" and answers
// with the service, the outcome, a small before → after visual, the steps
// and how long it usually takes. The order is shuffled on each visit and
// the first one plays when the chat scrolls into view. On phones the chat is pinned instead and scrolling
// walks through the four problems (tapping one still works: it scrolls
// there). Figures are illustrative.

const ease = [0.22, 1, 0.36, 1] as const
const TYPING_MS = 1000

type ProblemId = "slow" | "legacy" | "ai" | "people"

type Problem = {
  id: ProblemId
  service: string
  chip: string
  outcome: string
  steps: string[]
  weeks: string
  metric: { from: string; to: string; caption: string }
}

// What stays in code; the words come from messages (`problems.items.<id>`).
// Service names are product names and stay in English.
const problemMeta: { id: ProblemId; service: string }[] = [
  { id: "slow", service: "Software Engineering" },
  { id: "legacy", service: "Software Engineering" },
  { id: "ai", service: "AI Engineering" },
  { id: "people", service: "Forward Deployed Engineering" },
]

// Links to #forward-deployed-engineering open on the engineers problem.
const FDE_HASH = "#forward-deployed-engineering"
const PROBLEMS = 4

/** The four problems with their text in the current language. */
function useProblems(): Problem[] {
  const t = useTranslations("services.problems.items")
  return problemMeta.map((m) => ({
    ...m,
    chip: t(`${m.id}.chip`),
    outcome: t(`${m.id}.outcome`),
    steps: t.raw(`${m.id}.steps`) as string[],
    weeks: t(`${m.id}.weeks`),
    metric: t.raw(`${m.id}.metric`) as Problem["metric"],
  }))
}

/**
 * A figure such as "4", "1.2M" or "1,2 jt" that counts up to its value once
 * shown. Keeps the language's decimal mark and any unit around it.
 */
function CountUp({
  value,
  delay = 0,
}: Readonly<{ value: string; delay?: number }>) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    const m = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/.exec(value)
    if (!el || !m || reduce) return
    const [, pre, num, post] = m
    const mark = num.includes(",") ? "," : "."
    const decimals = num.split(mark)[1]?.length ?? 0
    const target = Number(num.replace(",", "."))
    const show = (v: number) => {
      el.textContent = `${pre}${v.toFixed(decimals).replace(".", mark)}${post}`
    }
    show(0)
    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease,
      onUpdate: show,
      onComplete: () => {
        el.textContent = value
      },
    })
    return () => controls.stop()
  }, [value, delay, reduce])
  return <span ref={ref}>{value}</span>
}

/* ------------------------------------------------------------------ */
/*  Visuals: one small before → after picture per problem              */
/* ------------------------------------------------------------------ */

/** "App is slow": p95 latency high and noisy, then a drop that stays low. */
function LatencyDrop() {
  const reduce = useReducedMotion()
  const d =
    "M0 16 L14 12 L28 18 L42 10 L56 15 L70 9 L84 17 L98 12 L112 16 L126 11 L140 14 L156 30 L170 58 L184 64 L198 62 L212 65 L226 63 L240 66 L254 64 L268 65 L284 63 L300 64"
  // Drawn left to right by a clip, so the stroke keeps its width when the
  // chart stretches (pathLength and non-scaling strokes don't mix).
  return (
    <motion.svg
      viewBox="0 0 300 76"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
      initial={{ clipPath: reduce ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: reduce ? 0 : 1.6, ease: "easeInOut", delay: 0.2 }}
    >
      {[18, 38, 58].map((y) => (
        <line
          key={y}
          x1="0"
          x2="300"
          y1={y}
          y2={y}
          className="stroke-neutral-200"
          strokeDasharray="2 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d={`${d} L300 76 L0 76 Z`} className="fill-neutral-900/[0.04]" />
      <path
        d={d}
        fill="none"
        className="stroke-neutral-900"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
  )
}

/** "Legacy": one block that splits into four independent services. */
function MonolithSplit() {
  const reduce = useReducedMotion()
  const [split, setSplit] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setSplit(true), reduce ? 0 : 700)
    return () => window.clearTimeout(id)
  }, [reduce])
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full items-stretch",
        !reduce &&
          "transition-[gap] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        split ? "gap-2.5" : "gap-0"
      )}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "flex flex-1 flex-col justify-center gap-1.5 bg-white px-3 ring-1 ring-neutral-200",
            !reduce &&
              "transition-[border-radius,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            split
              ? "rounded-lg shadow-[0_8px_20px_-12px_rgba(0,0,0,0.25)]"
              : cn(
                  "rounded-none",
                  i === 0 && "rounded-l-lg",
                  i === 3 && "rounded-r-lg"
                )
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors duration-500",
              split ? "bg-neutral-900" : "bg-neutral-300"
            )}
          />
          <span className="h-1 w-3/4 rounded-full bg-neutral-200" />
          <span className="h-1 w-1/2 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  )
}

/** "AI stuck in a demo": requests served climbing week by week. */
function RequestsClimb() {
  const reduce = useReducedMotion()
  const bars = Array.from({ length: 18 }, (_, i) =>
    Math.max(0.05, Math.pow(i / 17, 2.1))
  )
  return (
    <div aria-hidden="true" className="flex h-full items-end gap-[3px]">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className={cn(
            "flex-1 origin-bottom rounded-t-[3px]",
            i < 3 ? "bg-neutral-200" : "bg-neutral-900"
          )}
          style={{ height: `${h * 100}%` }}
          initial={{ scaleY: reduce ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease,
            delay: reduce ? 0 : 0.2 + i * 0.06,
          }}
        />
      ))}
    </div>
  )
}

/** "Short on engineers": backlog items ticked off one after another. */
function BacklogShipped() {
  const reduce = useReducedMotion()
  const widths = ["w-[72%]", "w-[54%]", "w-[64%]", "w-[44%]"]
  return (
    <ul aria-hidden="true" className="flex h-full flex-col justify-between">
      {widths.map((w, i) => {
        const delay = reduce ? 0 : 0.35 + i * 0.32
        return (
          <li key={w} className="flex items-center gap-2.5">
            <motion.span
              className="grid size-3.5 shrink-0 place-items-center rounded-full sm:size-4"
              initial={{
                backgroundColor: reduce ? "#171717" : "#ffffff",
                boxShadow: "inset 0 0 0 1px #d4d4d4",
              }}
              animate={{
                backgroundColor: "#171717",
                boxShadow: "inset 0 0 0 1px #171717",
              }}
              transition={{ duration: reduce ? 0 : 0.3, delay }}
            >
              <motion.span
                initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.3, delay }}
              >
                <Check className="size-2.5 text-white" strokeWidth={3} />
              </motion.span>
            </motion.span>
            <motion.span
              className={cn("h-1.5 rounded-full", w)}
              initial={{ backgroundColor: reduce ? "#e5e5e5" : "#a3a3a3" }}
              animate={{ backgroundColor: "#e5e5e5" }}
              transition={{ duration: reduce ? 0 : 0.4, delay }}
            />
          </li>
        )
      })}
    </ul>
  )
}

const visuals: Record<ProblemId, () => React.JSX.Element> = {
  slow: LatencyDrop,
  legacy: MonolithSplit,
  ai: RequestsClimb,
  people: BacklogShipped,
}

/** The figure card in a reply: before → after, its caption, the visual. */
function Figure({ p }: Readonly<{ p: Problem }>) {
  const Visual = visuals[p.id]
  return (
    <figure className="rounded-2xl bg-neutral-50 p-4 ring-1 ring-black/[0.04] sm:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="flex items-baseline gap-2 leading-none font-medium tracking-[-0.04em]">
          <span className="text-[17px] text-neutral-400 sm:text-[19px]">
            {p.metric.from}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 self-center text-neutral-300"
            strokeWidth={1.75}
          />
          <span className="text-[26px] text-neutral-950 tabular-nums sm:text-[30px]">
            {p.id === "slow" ? (
              p.metric.to
            ) : (
              <CountUp value={p.metric.to} delay={0.2} />
            )}
          </span>
        </span>
        <span className="text-[12px] text-neutral-500 sm:text-[13px]">
          {p.metric.caption}
        </span>
      </figcaption>
      <div className="mt-3 h-16 sm:mt-4 sm:h-[76px]">
        <Visual />
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  Chat pieces                                                        */
/* ------------------------------------------------------------------ */

function Avatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06]">
      <Image
        src="/rant-ai.png"
        alt=""
        width={36}
        height={36}
        className="size-4"
      />
    </span>
  )
}

/** RantAI's side of the chat: the mark on the left, content on the right. */
function FromRantAI({
  children,
  wide,
}: Readonly<{ children: React.ReactNode; wide?: boolean }>) {
  const t = useTranslations("services.problems.chat")
  // `wide`: on phones the content takes the full width and the mark sits
  // inline with its first line (see Reply), so less of it wraps.
  return (
    <div className="flex items-start gap-3">
      <span className={cn(wide && "max-sm:hidden")}>
        <Avatar />
      </span>
      <div className="min-w-0 flex-1">
        <span className="sr-only">{t("name")}: </span>
        {children}
      </div>
    </div>
  )
}

function Typing() {
  const t = useTranslations("services.problems.chat")
  return (
    <FromRantAI>
      <span className="inline-flex h-7 items-center gap-1 rounded-full bg-neutral-100 px-3">
        <span className="sr-only">{t("typing")}</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="size-1.5 rounded-full bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </FromRantAI>
  )
}

/** The answer: service, outcome, figure, steps, timeline and next steps. */
function Reply({ p, onHow }: Readonly<{ p: Problem; onHow: () => void }>) {
  const t = useTranslations("services.problems")
  const reduce = useReducedMotion()
  const mail = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(p.chip)}`
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 6 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  }
  return (
    <FromRantAI wide>
      <motion.div
        initial={reduce ? "shown" : "hidden"}
        animate="shown"
        transition={{ staggerChildren: reduce ? 0 : 0.12 }}
      >
        <motion.p
          variants={item}
          className="flex items-center gap-2 text-[12px] text-neutral-500"
        >
          <span className="sm:hidden">
            <Avatar />
          </span>
          {p.service}
        </motion.p>
        <motion.p
          variants={item}
          className="mt-1 text-[17px] leading-snug font-medium tracking-[-0.02em] text-balance text-neutral-950 sm:text-[19px]"
        >
          {p.outcome}
        </motion.p>
        <motion.div variants={item} className="mt-3 sm:mt-3.5">
          <Figure p={p} />
        </motion.div>
        <motion.div variants={item} className="mt-3 sm:mt-3.5">
          <p className="sr-only">{t("approach")}</p>
          {/* Short phones: the pinned card has no room for the steps */}
          <ol className="space-y-1 text-[14px] text-neutral-600 max-sm:[@media(max-height:800px)]:hidden">
            {p.steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-2.5">
                <span className="text-[11px] text-neutral-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-2.5 text-[13px] text-neutral-500">
            {t.rich("typically", {
              weeks: p.weeks,
              b: (chunks) => (
                <span className="font-medium text-neutral-900">{chunks}</span>
              ),
            })}
          </p>
        </motion.div>
        <motion.div
          variants={item}
          className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-0 max-sm:flex-nowrap max-sm:gap-x-4 sm:mt-3.5"
        >
          <a
            href={mail}
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-4.5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800 max-sm:h-10 max-sm:gap-1.5 max-sm:px-4 max-sm:text-[13px]"
          >
            {t("talk")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-we-work"
            onClick={(e) => {
              e.preventDefault()
              onHow()
            }}
            className="inline-flex min-h-11 items-center text-[14px] whitespace-nowrap text-neutral-500 transition-colors hover:text-neutral-900 max-sm:min-h-10 max-sm:text-[13px] max-sm:[@media(max-height:800px)]:hidden"
          >
            {t("seeHow")}
          </a>
        </motion.div>
      </motion.div>
    </FromRantAI>
  )
}

/** Free text goes to our inbox, like the footer's composer. */
function Composer() {
  const t = useTranslations("services.problems.chat")
  const [value, setValue] = useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(t("subject"))}${
          value ? `&body=${encodeURIComponent(value)}` : ""
        }`
      }}
      className="flex items-center gap-2 rounded-2xl bg-neutral-100/80 py-1.5 pr-1.5 pl-4 ring-1 ring-transparent transition-shadow focus-within:bg-white focus-within:ring-neutral-300"
    >
      <label htmlFor="problem-ask" className="sr-only">
        {t("label")}
      </label>
      <input
        id="problem-ask"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("placeholder")}
        autoComplete="off"
        className="h-9 min-w-0 flex-1 bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-[14px]"
      />
      <button
        type="submit"
        aria-label={t("send")}
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
          value
            ? "bg-neutral-950 text-white hover:bg-neutral-800"
            : "bg-white text-neutral-400 ring-1 ring-neutral-200"
        )}
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  The section                                                        */
/* ------------------------------------------------------------------ */

type Turn = { n: number; i: number; answered: boolean }

export function ProblemPicker() {
  const t = useTranslations("services.problems")
  const tc = useTranslations("services.problems.chat")
  const all = useProblems()
  // A different order on each visit (the chips, the scroll walk on phones
  // and the opener all follow it). Server render keeps the written order.
  const [order, setOrder] = useState<number[] | null>(null)
  useEffect(() => {
    const o = Array.from({ length: PROBLEMS }, (_, i) => i)
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[o[i], o[j]] = [o[j], o[i]]
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- once, on mount
    setOrder(o)
  }, [])
  const problems = order ? order.map((i) => all[i]) : all
  const fde = Math.max(
    0,
    problems.findIndex((q) => q.id === "people")
  )
  const reduce = useReducedMotion()
  const chatRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inView = useInView(chatRef, { once: true, amount: 0.45 })
  const [turn, setTurn] = useState<Turn | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const { ref: chipsRef, style: chipsFade } = useEdgeFade<HTMLDivElement>()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const current = useRef(-1)
  // True while "See how we work" skips past the track (no asks).
  const leaving = useRef(false)
  const phone = useMediaQuery("(max-width: 639px)")
  // Phones: the card pins under the navbar (4.5rem) for the whole track.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 72px", "end end"],
  })

  /** Sends problem `i` as the visitor's message; RantAI answers after a beat. */
  const ask = useCallback(
    (i: number) => {
      window.clearTimeout(timer.current)
      const n = Date.now()
      current.current = i
      setTurn({ n, i, answered: !!reduce })
      logRef.current?.scrollTo({ top: 0 })
      // If the picked chip is cut off at an edge of the scrolling row, bring
      // it just into view (the row, not the page). A chip already in full
      // view leaves the row where it is.
      const row = rowRef.current
      const chip = row?.children[i] as HTMLElement | undefined
      if (row && chip && row.scrollWidth > row.clientWidth) {
        const pad = 24
        const box = row.getBoundingClientRect()
        const c = chip.getBoundingClientRect()
        const left = c.left - box.left
        const right = c.right - box.left
        const shift =
          left < pad
            ? left - pad
            : right > row.clientWidth - pad
              ? right - (row.clientWidth - pad)
              : 0
        if (shift)
          row.scrollTo({
            left: row.scrollLeft + shift,
            behavior: reduce ? "auto" : "smooth",
          })
      }
      if (reduce) return
      timer.current = window.setTimeout(
        () => setTurn((c) => (c?.n === n ? { ...c, answered: true } : c)),
        TYPING_MS
      )
    },
    [reduce]
  )
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Phones: each quarter of the track asks the next problem.
  useEffect(() => {
    if (!phone) return
    return scrollYProgress.on("change", (v) => {
      const step = Math.min(PROBLEMS - 1, Math.max(0, Math.floor(v * PROBLEMS)))
      if (!leaving.current && step !== current.current) ask(step)
    })
  }, [phone, scrollYProgress, ask])

  /**
   * "See how we work": glide to the next section. Phones first skip
   * (instantly, the card stays pinned so nothing visibly jumps) to the end
   * of the track, so the glide doesn't page through the other problems.
   */
  const goHow = useCallback(() => {
    const el = document.getElementById("how-we-work")
    if (!el) return
    const track = trackRef.current
    if (phone && track) {
      const end =
        track.getBoundingClientRect().top +
        window.scrollY +
        track.offsetHeight -
        window.innerHeight
      if (window.scrollY < end) {
        leaving.current = true
        window.scrollTo(0, end)
        window.setTimeout(() => (leaving.current = false), 1400)
      }
    }
    // Land where the phases are pinned in place (the start of their track,
    // less the sticky offset), not on the section's top edge.
    const start = [
      ...el.querySelectorAll<HTMLElement>("[data-how-start]"),
    ].find((t) => t.offsetParent)
    const sticky = start?.firstElementChild
    const y = start
      ? start.getBoundingClientRect().top +
        window.scrollY -
        (sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0) +
        // Phones build each phase's mockup with the scroll: go far enough
        // into the first phase (3/4 of its fifth) that it's complete.
        (phone ? (start.offsetHeight - window.innerHeight) * 0.15 : 1)
      : el.getBoundingClientRect().top + window.scrollY - 80
    // Unhurried: longer trips take longer, within 1.2–2s.
    const trip = Math.abs(y - window.scrollY) / window.innerHeight
    smoothScrollTo(y, Math.min(2, Math.max(1.2, 0.8 + trip * 0.4)))
    history.replaceState(null, "", "#how-we-work")
  }, [phone])

  /** Tapped chip or link: phones scroll to that problem's part of the track. */
  const pick = useCallback(
    (i: number) => {
      const track = trackRef.current
      if (!phone || !track) return ask(i)
      const top = track.getBoundingClientRect().top + window.scrollY
      const start = top - 72
      const end = top + track.offsetHeight - window.innerHeight
      smoothScrollTo(start + (end - start) * ((i + 0.5) / PROBLEMS), 0.9)
    },
    [phone, ask]
  )

  // The first problem (or the engineers one, from a link) plays once
  // in view.
  useEffect(() => {
    if (!inView || turn) return
    const hash = window.location.hash === FDE_HASH
    const id = window.setTimeout(
      () => (hash ? pick(fde) : ask(0)),
      reduce ? 0 : 500
    )
    return () => window.clearTimeout(id)
  }, [inView, turn, ask, pick, reduce, fde])

  // A link to #forward-deployed-engineering while already on the page.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === FDE_HASH) pick(fde)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [pick, fde])

  const shown = turn ? problems[turn.i] : null

  return (
    <section
      id="what-we-do"
      aria-labelledby="problem-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-20 sm:px-10 sm:py-24 lg:px-14"
    >
      <span id="forward-deployed-engineering" className="block scroll-mt-20" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 xl:gap-24">
        <div>
          <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
          <SplitReveal
            id="problem-heading"
            text={t("title")}
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
          />
          <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-pretty text-neutral-500 lg:mt-7 lg:text-[17px]">
            {t("lead")}
          </p>
        </div>

        {/* The chat window. Phones: pinned on a tall track */}
        <div ref={trackRef} className="min-w-0 max-sm:h-[340svh]">
          <div
            ref={chatRef}
            className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.07] max-sm:sticky max-sm:top-[4.5rem] max-sm:-mx-1 max-sm:h-[calc(100svh-5.5rem)] lg:rounded-[28px]"
          >
            <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-neutral-100 px-4 sm:h-14 sm:px-6">
              <Avatar />
              <p className="text-[14px] text-neutral-900">
                <span className="font-medium">{tc("name")}</span>
                <span className="text-neutral-400"> · {tc("team")}</span>
              </p>
            </div>

            {/* Messages: a fixed height so nothing around it jumps. Phones have
              no inner scroll, so a swipe always moves the page */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="min-h-0 flex-1 overflow-hidden px-4 py-4 sm:h-[500px] sm:flex-none sm:overflow-y-auto sm:overscroll-contain sm:px-6 sm:py-5 lg:h-[min(500px,calc(100vh-330px))] lg:min-h-[440px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {!shown || !turn ? (
                  <motion.div
                    key="hello"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <FromRantAI>
                      <p className="pt-1 text-[15px] text-neutral-700">
                        {tc("greeting")}
                      </p>
                    </FromRantAI>
                  </motion.div>
                ) : (
                  <motion.div
                    key={turn.n}
                    className="space-y-4 sm:space-y-5"
                    initial={{ opacity: reduce ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      className="flex justify-end"
                      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease }}
                    >
                      <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-neutral-100 px-4 py-2.5 text-[15px] text-neutral-900">
                        <span className="sr-only">{tc("you")}: </span>
                        {shown.chip}
                      </p>
                    </motion.div>
                    <AnimatePresence mode="wait" initial={false}>
                      {turn.answered ? (
                        <motion.div
                          key="reply"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                        >
                          <Reply p={shown} onHow={goHow} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            transition: { delay: 0.25, duration: 0.3 },
                          }}
                          exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        >
                          <Typing />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Suggestions and the composer */}
            <div className="shrink-0 border-t border-neutral-100 px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
              <div
                ref={(el) => {
                  rowRef.current = el
                  chipsRef(el)
                }}
                style={chipsFade}
                role="group"
                aria-label={tc("suggestions")}
                className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-3 [scrollbar-width:none] sm:-mx-4 sm:gap-1.5 sm:px-4 [&::-webkit-scrollbar]:hidden"
              >
                {problems.map((q, i) => {
                  const on = turn?.i === i
                  return (
                    <button
                      key={q.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(i)}
                      className={cn(
                        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-[13px] whitespace-nowrap transition-colors duration-300 sm:min-h-9 sm:px-3 sm:tracking-[-0.01em]",
                        on
                          ? "border-neutral-300 bg-neutral-100 text-neutral-950"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                      )}
                    >
                      {q.chip}
                    </button>
                  )
                })}
              </div>
              <Composer />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
