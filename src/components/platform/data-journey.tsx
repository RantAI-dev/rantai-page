"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
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

type Stop = {
  id: string
  name: string
  icon: LucideIcon
  tone: string
  line: string
  /** The product's own logo, on its own tile colour, where one exists. */
  logo?: { src: string; bg: string }
}

const stops: Stop[] = [
  {
    id: "sources",
    name: "Your data",
    icon: Server,
    tone: "#737373",
    line: "Visitor data sits in three different systems.",
  },
  {
    id: "lake",
    name: "RantAI Lakehouse",
    icon: Database,
    tone: "#14b8a6",
    logo: { src: logoSrc("lake"), bg: "#ffffff" },
    line: "Lakehouse brings it into one clean table.",
  },
  {
    id: "llmops",
    name: "RantAI LLMOps",
    icon: BrainCircuit,
    tone: "#8b5cf6",
    logo: { src: logoSrc("llmops"), bg: "#ffffff" },
    line: "LLMOps tunes a model on your numbers.",
  },
  {
    id: "claw",
    name: "RantAI Claw",
    icon: Terminal,
    tone: "#f97316",
    logo: { src: logoSrc("claw"), bg: "#ffffff" },
    line: "Claw runs the report every month.",
  },
  {
    id: "agents",
    name: "RantAI Agents",
    icon: Bot,
    tone: "#3b82f6",
    logo: { src: logoSrc("agents"), bg: "#ffffff" },
    line: "Agents answers your team in seconds.",
  },
]

/** Where each product lives, from the shared product list. */
const appHref = Object.fromEntries(products.map((p) => [p.id, p.href]))

function OpenApp({ stop }: Readonly<{ stop: Stop }>) {
  const href = appHref[stop.id]
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white py-1.5 pr-3 pl-2 text-[13px] font-medium text-neutral-700 transition-colors hover:text-neutral-950"
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
      Open {stop.name}
      <ArrowUpRight className="size-3.5 text-neutral-400 transition-colors group-hover:text-neutral-900" />
    </a>
  )
}

const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.04)]"

/* ------------------------------------------------------------------ */
/*  One small scene per stop                                           */
/* ------------------------------------------------------------------ */

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

function SourcesScene() {
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
    { icon: Globe, label: "Hotel bookings", meta: "REST API", tone: "#f59e0b" },
  ]
  return (
    <div className="grid w-full max-w-[520px] gap-3">
      {items.map((it, i) => (
        <Rise
          key={it.label}
          delay={i * 0.08}
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
            </span>
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">
            Not connected
          </span>
        </Rise>
      ))}
    </div>
  )
}

function LakeScene() {
  const rows = [
    ["Malaysia", "1.61M", 100],
    ["Singapore", "1.48M", 92],
    ["Australia", "1.19M", 74],
    ["China", "0.98M", 61],
  ] as const
  return (
    <Rise className={cn(card, "w-full max-w-[560px] overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3">
        <span className="text-[13px] font-medium">visitors_clean</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#0f766e]">
          <Check className="size-3.5" strokeWidth={3} /> 3 sources merged
        </span>
      </div>
      <ul className="divide-y divide-black/[0.05]">
        {rows.map(([country, value, w], i) => (
          <li
            key={country}
            className="grid grid-cols-[110px_1fr_56px] items-center gap-4 px-5 py-3 text-[13px]"
          >
            <span>{country}</span>
            <span className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <motion.span
                className="block h-full rounded-full bg-[#14b8a6]"
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.08 }}
              />
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

function LlmopsScene() {
  return (
    <div className="grid w-full max-w-[560px] grid-cols-[1.4fr_1fr] gap-3">
      <Rise className={cn(card, "p-5")}>
        <p className="text-[12px] text-neutral-500">Training loss</p>
        <svg
          viewBox="0 0 200 90"
          className="mt-3 h-[130px] w-full overflow-visible"
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
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </svg>
      </Rise>
      <Rise
        delay={0.15}
        className={cn(card, "flex flex-col justify-between p-5")}
      >
        <p className="text-[12px] text-neutral-500">Accuracy</p>
        <div>
          <p className="text-[13px] text-neutral-400 tabular-nums line-through">
            71%
          </p>
          <p className="text-[40px] leading-none font-medium tracking-[-0.03em] text-[#7c3aed] tabular-nums">
            89%
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">on your test set</p>
        </div>
      </Rise>
    </div>
  )
}

function ClawScene() {
  const lines = [
    "query visitors_clean",
    "summarise with tourism-model",
    "build monthly-report.pdf",
    "post to #tourism-office",
  ]
  return (
    <Rise className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#0d0f12] text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2.5 rounded-full bg-white/15" />
          ))}
        </span>
        <span className="rounded-full bg-[#f97316]/15 px-2.5 py-0.5 text-[11px] text-[#fdba74]">
          Every 1st · 07:00
        </span>
      </div>
      <div className="space-y-2 p-5 [font-family:ui-monospace,monospace] text-[13px]">
        <p>
          <span className="text-[#5cb6f9]">$</span> rantaiclaw run
          monthly-report
        </p>
        {lines.map((l, i) => (
          <motion.p
            key={l}
            className="text-white/75"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.28 }}
          >
            <span className="text-[#34d399]">✓</span> {l}
          </motion.p>
        ))}
      </div>
    </Rise>
  )
}

function AgentsScene() {
  return (
    <Rise className={cn(card, "w-full max-w-[560px] p-5")}>
      <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-neutral-100 px-4 py-2.5 text-[14px]">
        How did visitors change this month?
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-4 flex items-start gap-3"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#3b82f6] text-white">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-[14px] leading-relaxed">
            Up <span className="font-medium text-[#047857]">12%</span> on last
            month, led by Malaysia and Singapore.
          </p>
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {[30, 38, 36, 50, 58, 70, 100].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: i === 6 ? "#3b82f6" : "#bfdbfe" }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, ease, delay: 0.6 + i * 0.05 }}
              />
            ))}
          </div>
          <span className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/[0.06] px-2.5 py-1 text-[11px] text-[#2563eb]">
            <FileText className="size-3" /> monthly-report.pdf
          </span>
        </div>
      </motion.div>
    </Rise>
  )
}

const scenes = [SourcesScene, LakeScene, LlmopsScene, ClawScene, AgentsScene]

/* ------------------------------------------------------------------ */
/*  The route: five stops on a line, with the request travelling it    */
/* ------------------------------------------------------------------ */

// Each node sits at its own slight angle, like the inline tiles on the
// homepage.
const tilts = [-6, 4, -3, 5, -4]

function Route({
  active,
  progress,
  onPick,
}: Readonly<{
  active: number
  progress?: MotionValue<number>
  onPick: (i: number) => void
}>) {
  const reduce = useReducedMotion()
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
      <div className="absolute top-6 right-[10%] left-[10%] h-px bg-neutral-200" />
      <motion.div
        className="absolute top-6 left-[10%] h-px w-[80%] origin-left bg-neutral-900"
        style={{ scaleX: fill }}
      />
      {/* The request travelling along the line; tiles sit above it */}
      {progress && (
        <motion.span
          className="absolute top-6 -mt-[5px] -ml-[5px] size-2.5 rounded-full bg-neutral-900 shadow-[0_0_0_4px_rgb(255_255_255)]"
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
                className="group flex flex-col items-center gap-3"
              >
                <span className="relative">
                  {/* Rings ripple out from the active stop, at the
                      tile's own angle, one after another without a gap */}
                  {now && !reduce && (
                    <span
                      className="absolute inset-0"
                      style={{ transform: `rotate(${tilts[i]}deg)` }}
                    >
                      {[0, 1, 2].map((r) => (
                        <motion.span
                          key={`${s.id}-${r}`}
                          className="absolute inset-0 rounded-[14px] border-[1.5px]"
                          style={{
                            borderColor:
                              s.logo?.bg === "#ffffff" ? "#5cb6f9" : s.tone,
                          }}
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: [1, 1.9], opacity: [0, 0.6, 0] }}
                          transition={{
                            duration: 2.4,
                            times: [0, 0.15, 1],
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: r * 0.8,
                          }}
                        />
                      ))}
                    </span>
                  )}
                  <motion.span
                    key={now ? `${s.id}-now` : s.id}
                    className="relative grid size-12 place-items-center rounded-[14px] text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] ring-[3px] ring-white"
                    style={{ background: "#ffffff", color: "#525252" }}
                    initial={false}
                    animate={{
                      rotate: tilts[i],
                      scale: now && !reduce ? [1, 1.22, 1.08] : now ? 1.08 : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: now ? 0.25 : 0,
                      rotate: { duration: 0 },
                    }}
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
                          className="h-6 w-auto"
                        />
                      ) : (
                        <s.icon className="size-6" strokeWidth={2} />
                      )}
                    </span>
                  </motion.span>
                </span>
                <span
                  className={cn(
                    "text-[13px] font-medium whitespace-nowrap transition-colors",
                    now
                      ? "text-neutral-950"
                      : "text-neutral-500 group-hover:text-neutral-800"
                  )}
                >
                  {s.name}
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
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow className="text-neutral-500">How it fits together</Eyebrow>
      <SplitReveal
        id="journey-heading"
        text="One request, four products."
        className="mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
      />
    </div>
  )
}

/** Desktop: pinned, scroll moves the request from stop to stop. */
function PinnedJourney() {
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
              {stop.line}
            </p>
            <OpenApp stop={stop} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Phones, tablets and reduced motion: the stops as a list. */
function StackedJourney() {
  return (
    <div className="px-5 py-24 sm:px-10">
      <Header />
      <ol className="mx-auto mt-14 max-w-2xl space-y-12">
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
                    {String(i + 1).padStart(2, "0")} · {s.name}
                  </span>
                  <span className="block text-[17px] font-medium text-neutral-900">
                    {s.line}
                  </span>
                </span>
              </div>
              <div
                className="mt-5 flex justify-center rounded-[24px] p-5 sm:p-8"
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

export function DataJourney() {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  return (
    <section
      aria-labelledby="journey-heading"
      id="how-it-fits"
      className="lg:pt-24"
    >
      {desktop && !reduce ? <PinnedJourney /> : <StackedJourney />}
    </section>
  )
}
