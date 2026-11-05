"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
  useReducedMotion,
  useScroll,
} from "motion/react"
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  Database,
  FileSpreadsheet,
  FileText,
  Globe,
  Server,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { smoothScrollTo } from "@/components/layout/smooth-scroll"
import { products } from "@/components/platform/products"
import { logoSrc } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

// "One request, four products": a single monthly report travels from raw
// data through Lakehouse, LLMOps and Claw to an answer in Agents. On desktop the
// section pins and scroll moves the request along; each stop lights up with
// a small piece of its product. Content is illustrative.

const ease = [0.22, 1, 0.36, 1] as const

// Each stop's name and line come from messages (platform.journey.stops.<id>).
type Stop = {
  id: "sources" | "lake" | "llmops" | "claw" | "agents"
  icon: LucideIcon
  tone: string
  /** The product's own logo, on its own tile colour, where one exists. */
  logo?: { src: string; bg: string }
}

const stops: Stop[] = [
  {
    id: "sources",
    icon: Server,
    tone: "#737373",
  },
  {
    id: "lake",
    icon: Database,
    tone: "#14b8a6",
    logo: { src: logoSrc("lake"), bg: "#ffffff" },
  },
  {
    id: "llmops",
    icon: BrainCircuit,
    tone: "#8b5cf6",
    logo: { src: logoSrc("llmops"), bg: "#ffffff" },
  },
  {
    id: "claw",
    icon: Terminal,
    tone: "#f97316",
    logo: { src: logoSrc("claw"), bg: "#ffffff" },
  },
  {
    id: "agents",
    icon: Bot,
    tone: "#3b82f6",
    logo: { src: logoSrc("agents"), bg: "#ffffff" },
  },
]

/** Where each product lives, from the shared product list. */
const appHref = Object.fromEntries(products.map((p) => [p.id, p.href]))

function OpenApp({ stop }: Readonly<{ stop: Stop }>) {
  const t = useTranslations("platform.journey")
  const href = appHref[stop.id]
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white py-1.5 pr-3 pl-2 text-[13px] font-medium text-neutral-700 transition-colors hover:text-neutral-950 max-lg:py-2.5"
    >
      <span
        className="grid size-5 place-items-center rounded-full text-white ring-1 ring-black/5"
        style={{ background: stop.logo?.bg ?? stop.tone }}
      >
        {stop.logo ? (
          <Image
            src={stop.logo.src}
            alt=""
            width={14}
            height={14}
            className="h-3 w-auto"
          />
        ) : (
          <stop.icon className="size-3" />
        )}
      </span>
      {/* What you would do there, after this step of the demo */}
      {t(`stops.${stop.id}.cta`)}
      <ArrowUpRight className="size-3.5 text-neutral-400 transition-colors group-hover:text-neutral-900" />
    </a>
  )
}

const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.04)]"

/* ------------------------------------------------------------------ */
/*  One small scene per stop                                           */
/* ------------------------------------------------------------------ */

/** How far (0–1, eased) the scroll has got through [a, b] of a step. */
function seg(at: number, a: number, b: number) {
  const x = Math.min(1, Math.max(0, (at - a) / (b - a)))
  return 1 - (1 - x) ** 3
}

/** A scene's progress on phones; undefined plays it on its own timer. */
type SceneProps = Readonly<{ at?: number }>

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

function SourcesScene({ at }: SceneProps) {
  const t = useTranslations("platform.journey.scenes.sources")
  const items = [
    {
      icon: Database,
      label: "visits_2024",
      meta: "PostgreSQL",
      tone: "#3b82f6",
    },
    {
      icon: FileSpreadsheet,
      label: "Border counts.xlsx",
      meta: "Excel",
      tone: "#10b981",
    },
    { icon: Globe, label: t("hotel"), meta: "REST API", tone: "#f59e0b" },
  ]
  return (
    <div className="grid w-full max-w-[520px] gap-3">
      {items.map((it, i) => (
        <Rise
          key={it.label}
          delay={i * 0.08}
          p={at === undefined ? undefined : seg(at, i * 0.25, i * 0.25 + 0.5)}
          className={cn(card, "flex items-center gap-3 p-4")}
        >
          <span
            className="grid size-10 place-items-center rounded-xl"
            style={{ background: `${it.tone}1a`, color: it.tone }}
          >
            <it.icon className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-medium">{it.label}</span>
            <span className="block text-[12px] text-neutral-500">
              {it.meta}
              {/* Phones: the status joins this line, so the name keeps
                  the card's width instead of wrapping beside a pill. */}
              <span className="sm:hidden"> · {t("notConnected")}</span>
            </span>
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500 max-sm:hidden">
            {t("notConnected")}
          </span>
        </Rise>
      ))}
    </div>
  )
}

function LakeScene({ at }: SceneProps) {
  const t = useTranslations("platform.journey.scenes.lake")
  const countries = t.raw("countries") as string[]
  const rows = (
    [
      [1.61, 100],
      [1.48, 92],
      [1.19, 74],
      [0.98, 61],
    ] as const
  ).map(([v, w], i) => [countries[i], t("value", { v }), w] as const)
  return (
    <Rise
      p={at === undefined ? undefined : seg(at, 0, 0.3)}
      className={cn(card, "w-full max-w-[560px] overflow-hidden")}
    >
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3">
        <span className="text-[13px] font-medium">visitors_clean</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#0f766e]">
          <Check className="size-3.5" strokeWidth={3} />{" "}
          {t("merged", { count: 3 })}
        </span>
      </div>
      <ul className="divide-y divide-black/[0.05]">
        {rows.map(([country, value, w], i) => (
          <li
            key={country}
            className="grid grid-cols-[110px_1fr_56px] items-center gap-4 px-5 py-3 text-[13px] max-md:grid-cols-[88px_1fr_52px] max-md:gap-3 max-md:px-4"
          >
            <span>{country}</span>
            <span className="h-2 overflow-hidden rounded-full bg-neutral-100">
              {at === undefined ? (
                <motion.span
                  className="block h-full rounded-full bg-[#14b8a6]"
                  initial={{ width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.08 }}
                />
              ) : (
                <span
                  className="block h-full rounded-full bg-[#14b8a6]"
                  style={{
                    width: `${w * seg(at, 0.2 + i * 0.12, 0.6 + i * 0.12)}%`,
                  }}
                />
              )}
            </span>
            <span className="text-right text-neutral-500 tabular-nums">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </Rise>
  )
}

function LlmopsScene({ at }: SceneProps) {
  const t = useTranslations("platform.journey.scenes.llmops")
  const scroll = at !== undefined
  // Phones: the curve draws and the accuracy climbs with the scroll.
  const curve = scroll ? seg(at, 0.1, 0.7) : 1
  const climb = scroll ? seg(at, 0.45, 1) : 1
  return (
    <div className="grid w-full max-w-[560px] grid-cols-[1.4fr_1fr] gap-3">
      <Rise
        p={scroll ? seg(at, 0, 0.25) : undefined}
        className={cn(card, "p-5 max-md:p-4")}
      >
        <p className="text-[12px] text-neutral-500">{t("loss")}</p>
        <svg
          viewBox="0 0 200 90"
          className="mt-3 h-[130px] w-full overflow-visible max-md:h-[110px]"
        >
          {[22, 45, 68].map((y) => (
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
            d="M0,8 C30,12 45,50 80,60 S150,78 200,82"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            {...(scroll
              ? { initial: false, style: { pathLength: curve } }
              : {
                  initial: { pathLength: 0 },
                  animate: { pathLength: 1 },
                  transition: { duration: 1.4, ease: "easeInOut" },
                })}
          />
        </svg>
      </Rise>
      <Rise
        delay={0.15}
        p={scroll ? seg(at, 0.3, 0.55) : undefined}
        className={cn(card, "flex flex-col justify-between p-5 max-md:p-4")}
      >
        <p className="text-[12px] text-neutral-500">{t("accuracy")}</p>
        <div>
          <p
            className="text-[13px] text-neutral-400 tabular-nums line-through"
            style={scroll ? { opacity: climb } : undefined}
          >
            {t("percent", { v: 0.71 })}
          </p>
          <p className="text-[40px] leading-none font-medium tracking-[-0.03em] text-[#7c3aed] tabular-nums max-md:text-[34px]">
            {t("percent", { v: Math.round(71 + 18 * climb) / 100 })}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">{t("testSet")}</p>
        </div>
      </Rise>
    </div>
  )
}

function ClawScene({ at }: SceneProps) {
  const t = useTranslations("platform.journey.scenes.claw")
  const lines = [
    "query visitors_clean",
    "summarise with tourism-model",
    "build monthly-report.pdf",
    "post to #tourism-office",
  ]
  return (
    <Rise
      p={at === undefined ? undefined : seg(at, 0, 0.2)}
      className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#0d0f12] text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2.5 rounded-full bg-white/15" />
          ))}
        </span>
        <span className="rounded-full bg-[#f97316]/15 px-2.5 py-0.5 text-[11px] text-[#fdba74]">
          {t("schedule")}
        </span>
      </div>
      <div className="space-y-2 p-5 [font-family:ui-monospace,monospace] text-[13px] max-md:px-4 max-md:text-[12px]">
        <p>
          <span className="text-[#5cb6f9]">$</span> rantaiclaw run
          monthly-report
        </p>
        {lines.map((l, i) => {
          const line = (
            <>
              <span className="text-[#34d399]">✓</span> {l}
            </>
          )
          if (at !== undefined) {
            const p = seg(at, 0.2 + i * 0.18, 0.38 + i * 0.18)
            return (
              <p
                key={l}
                className="text-white/75"
                style={{
                  opacity: p,
                  transform: `translateX(${(1 - p) * -6}px)`,
                }}
              >
                {line}
              </p>
            )
          }
          return (
            <motion.p
              key={l}
              className="text-white/75"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.28 }}
            >
              {line}
            </motion.p>
          )
        })}
      </div>
    </Rise>
  )
}

function AgentsScene({ at }: SceneProps) {
  const t = useTranslations("platform.journey.scenes.agents")
  const scroll = at !== undefined
  return (
    <Rise
      p={scroll ? seg(at, 0, 0.2) : undefined}
      className={cn(card, "w-full max-w-[560px] p-5 max-md:p-4")}
    >
      <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-neutral-100 px-4 py-2.5 text-[14px] max-md:max-w-[85%]">
        {t("question")}
      </p>
      <motion.div
        {...(scroll
          ? { initial: false, style: { opacity: seg(at, 0.25, 0.45) } }
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.45 },
            })}
        className="mt-4 flex items-start gap-3"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#3b82f6] text-white">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-[14px] leading-relaxed">
            {t.rich("answer", {
              b: (chunks) => (
                <span className="font-medium text-[#047857]">{chunks}</span>
              ),
            })}
          </p>
          <div className="mt-3 flex h-16 items-end gap-1.5 max-md:h-12">
            {[30, 38, 36, 50, 58, 70, 100].map((h, i) => {
              const background = i === 6 ? "#3b82f6" : "#bfdbfe"
              if (scroll)
                return (
                  <span
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      background,
                      height: `${h * seg(at, 0.4 + i * 0.06, 0.64 + i * 0.06)}%`,
                    }}
                  />
                )
              return (
                <motion.span
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, ease, delay: 0.6 + i * 0.05 }}
                />
              )
            })}
          </div>
          <span
            style={scroll ? { opacity: seg(at, 0.8, 1) } : undefined}
            className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/[0.06] px-2.5 py-1 text-[11px] text-[#2563eb]"
          >
            <FileText className="size-3" /> monthly-report.pdf
          </span>
        </div>
      </motion.div>
    </Rise>
  )
}

const scenes: ((props: SceneProps) => React.ReactNode)[] = [
  SourcesScene,
  LakeScene,
  LlmopsScene,
  ClawScene,
  AgentsScene,
]

/* ------------------------------------------------------------------ */
/*  The route: five stops on a line, with the request travelling it    */
/* ------------------------------------------------------------------ */

function Route({
  active,
  progress,
  onPick,
}: Readonly<{
  active: number
  progress?: MotionValue<number>
  onPick: (i: number) => void
}>) {
  const t = useTranslations("platform.journey")
  const n = stops.length
  // The line fills with the scroll itself and reaches stop i exactly when
  // stop i becomes active (at progress i / n).
  const fallback = useMotionValue(0)
  const fill = useTransform(progress ?? fallback, (v) =>
    progress ? Math.min(1, Math.max(0, (v * n) / (n - 1))) : active / (n - 1)
  )
  const tip = useTransform(fill, (f) => `${10 + f * 80}%`)
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* Track, and the part already travelled */}
      <div className="absolute top-6 right-[10%] left-[10%] h-px bg-neutral-200 max-md:top-5" />
      <motion.div
        className="absolute top-6 left-[10%] h-px w-[80%] origin-left bg-neutral-900 max-md:top-5"
        style={{ scaleX: fill }}
      />
      {/* The request travelling along the line; tiles sit above it */}
      {progress && (
        <motion.span
          className="absolute top-6 -mt-[5px] -ml-[5px] size-2.5 rounded-full bg-neutral-900 shadow-[0_0_0_4px_rgb(255_255_255)] max-md:top-5"
          style={{ left: tip }}
        />
      )}
      <ol className="relative z-10 grid grid-cols-5">
        {stops.map((s, i) => {
          const on = i <= active
          const now = i === active
          return (
            <li key={s.id} className="flex justify-center">
              <button
                type="button"
                onClick={() => onPick(i)}
                className="group flex flex-col items-center gap-3 max-md:gap-2"
              >
                <span className="relative">
                  <motion.span
                    key={now ? `${s.id}-now` : s.id}
                    className={cn(
                      "relative grid size-12 place-items-center rounded-[14px] text-white ring-[3px] ring-white transition-shadow duration-500 max-md:size-10 max-md:rounded-xl",
                      // Reached stops lift off the line; the ones still
                      // ahead stay flat, with just a hairline.
                      now
                        ? "shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_6px_16px_rgba(0,0,0,0.16)]"
                        : on
                          ? "shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                          : "shadow-[0_0_0_1px_rgb(0_0_0/0.07)]"
                    )}
                    style={{ background: "#ffffff", color: "#525252" }}
                    initial={false}
                    animate={{ scale: now ? 1.06 : 1 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {/* The tile stays solid; only its mark fades until reached */}
                    <span
                      className="grid place-items-center transition-[opacity,filter] duration-300"
                      style={{
                        opacity: on ? 1 : 0.45,
                        filter: on ? "none" : "grayscale(0.6)",
                      }}
                    >
                      {s.logo ? (
                        <Image
                          src={s.logo.src}
                          alt=""
                          width={28}
                          height={28}
                          className="h-6 w-auto max-md:h-5"
                        />
                      ) : (
                        <s.icon
                          className="size-6 max-md:size-5"
                          strokeWidth={2}
                        />
                      )}
                    </span>
                  </motion.span>
                </span>
                <span
                  className={cn(
                    "text-[13px] font-medium whitespace-nowrap transition-colors max-md:text-[11px]",
                    now
                      ? "text-neutral-950"
                      : "text-neutral-500 group-hover:text-neutral-800"
                  )}
                >
                  {/* Phones: without "RantAI", so five names fit */}
                  <span className="max-md:hidden">
                    {t(`stops.${s.id}.name`)}
                  </span>
                  <span className="md:hidden">
                    {t(`stops.${s.id}.name`).replace(/^RantAI\s+/, "")}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Header() {
  const t = useTranslations("platform.journey")
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
      <SplitReveal
        id="journey-heading"
        text={t("title")}
        className="mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
      />
    </div>
  )
}

/** Desktop: pinned, scroll moves the request from stop to stop. */
function PinnedJourney() {
  const t = useTranslations("platform.journey")
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // JS copy: native scroll timelines mis-measure sticky content.
  const progress = useMotionValue(0)
  useEffect(
    () => scrollYProgress.on("change", (v) => progress.set(v)),
    [scrollYProgress, progress]
  )
  const [active, setActive] = useState(0)
  useEffect(
    () =>
      progress.on("change", (v) =>
        setActive(Math.min(stops.length - 1, Math.floor(v * stops.length)))
      ),
    [progress]
  )

  const pick = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    smoothScrollTo(top + span * ((i + 0.5) / stops.length))
  }

  const Scene = scenes[active]
  const stop = stops[active]
  return (
    <div ref={ref} className="relative h-[420svh]">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center gap-[min(3rem,5svh)] px-14">
        <Header />
        <Route active={active} progress={progress} onPick={pick} />
        <div
          className="relative mx-auto flex h-[min(360px,40svh)] w-full max-w-4xl items-center justify-center overflow-hidden rounded-[28px] transition-colors duration-700"
          style={{ background: `${stop.tone}12` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stop.id}
              className="flex w-full flex-col items-center gap-6 px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[72px] flex-col items-center gap-3"
          >
            <p className="text-center text-[clamp(1.1rem,1.6vw,1.4rem)] font-medium tracking-[-0.015em] text-neutral-900">
              {t(`stops.${stop.id}.line`)}
            </p>
            <OpenApp stop={stop} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Phones: the heading scrolls by, then the stops pin and play one at a
 * time, each scene driven by the scroll (as the home page's sequences).
 */
function PhoneJourney() {
  const t = useTranslations("platform.journey")
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const progress = useMotionValue(0)
  const [active, setActive] = useState(0)
  // Where the current stop's scene is (0–1). It finishes three quarters of
  // the way through the stop, so each one is seen complete.
  const [at, setAt] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.set(v)
    const n = stops.length
    const i = Math.min(n - 1, Math.floor(v * n))
    setActive(i)
    setAt(Math.min(1, Math.max(0, (v * n - i) / 0.75)))
  })
  const stop = stops[active]
  const Scene = scenes[active]

  // Tapping a stop in the route scrolls to the middle of its stretch.
  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    smoothScrollTo(top + span * ((i + 0.5) / stops.length), 1.1)
  }

  return (
    <div className="pt-16">
      <div className="px-5">
        <Header />
      </div>
      <div ref={ref} className="relative h-[450svh]">
        {/* Top-aligned, with the heading's height fixed, so nothing moves
            from one stop to the next */}
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col px-5 pt-[min(2.5rem,5svh)] pb-4">
          <div className="mb-6">
            <Route active={active} progress={progress} onPick={jump} />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
            >
              <h3 className="min-h-[2.4em] text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-balance text-neutral-950">
                {t(`stops.${stop.id}.line`)}
              </h3>
              <div
                aria-hidden="true"
                className="mt-5 flex h-[min(18.5rem,46svh)] items-center justify-center rounded-[24px] px-4"
                style={{ background: `${stop.tone}12` }}
              >
                <Scene at={at} />
              </div>
              <div className="mt-4 h-11">
                <OpenApp stop={stop} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/** Tablets and reduced motion: the stops as a list. */
function StackedJourney() {
  const t = useTranslations("platform.journey")
  return (
    <div className="px-5 py-16 sm:px-10 sm:py-24">
      <Header />
      <ol className="mx-auto mt-10 max-w-2xl space-y-12 sm:mt-14">
        {stops.map((s, i) => {
          const Scene = scenes[i]
          return (
            <li key={s.id}>
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-xl text-white"
                  style={{ background: s.tone }}
                >
                  <s.icon className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
                    <span className="max-md:hidden">
                      {String(i + 1).padStart(2, "0")} ·{" "}
                    </span>
                    {t(`stops.${s.id}.name`)}
                  </span>
                  <span className="block text-[17px] font-medium text-neutral-900">
                    {t(`stops.${s.id}.line`)}
                  </span>
                </span>
              </div>
              <div
                className="mt-5 flex justify-center rounded-[24px] p-4 sm:p-8"
                style={{ background: `${s.tone}12` }}
              >
                <Scene />
              </div>
              <div className="mt-4">
                <OpenApp stop={s} />
              </div>
            </li>
          )
        })}
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

export function DataJourney() {
  const layout = useLayout()
  const reduce = useReducedMotion()
  return (
    <section
      aria-labelledby="journey-heading"
      id="how-it-fits"
      className="lg:pt-24"
    >
      {reduce ? (
        <StackedJourney />
      ) : layout === "desktop" ? (
        <PinnedJourney />
      ) : layout === "phone" ? (
        <PhoneJourney />
      ) : (
        <StackedJourney />
      )}
    </section>
  )
}
