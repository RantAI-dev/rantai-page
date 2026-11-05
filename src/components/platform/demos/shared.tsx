"use client"

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react"
import { Check, Loader2 } from "lucide-react"
import { useEdgeFade } from "@/hooks/use-edge-fade"
import { cn } from "@/lib/utils"

/**
 * Where a demo's prompt chips go on phones: a spot below the demo's frame
 * (set by the reel). Outside the frame they read as a button group you can
 * tap, instead of a strip inside the mockup.
 */
export const DemoChipSlot = createContext<HTMLElement | null>(null)

// Interactive product demos for the platform reel: each one plays a short,
// scripted session of the product on a light "desk", and visitors can pick
// another prompt to replay it. Content is illustrative.

export const ease = [0.22, 1, 0.36, 1] as const
export const W = 880
export const H = 550
// Narrow screens get a portrait canvas with only the main cards, so the
// text stays readable instead of shrinking the desktop layout.
// Sized close to a phone's frame (about 326px wide), so it scales by ~1 and
// the text keeps its real size.
export const CW = 320
export const CH = 400
export const COMPACT_BELOW = 640

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

// Each product sits on its own desk: a tint and a pattern (grid or dots).
export const desks = {
  agents: { bg: "#edf3fd", line: "rgb(59 130 246 / 0.10)", pattern: "grid" },
  claw: { bg: "#fbf0e8", line: "rgb(234 88 12 / 0.16)", pattern: "dots" },
  llmops: { bg: "#f2eefc", line: "rgb(139 92 246 / 0.11)", pattern: "grid" },
  lake: { bg: "#e9f5f3", line: "rgb(13 148 136 / 0.18)", pattern: "dots" },
} as const

/** Lays the demo out at a fixed design size and scales it to fit. */
export function Stage({
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

export function Card({
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
export function Typed({
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
export function useScript(
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
export function usePlaying(active: boolean) {
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

export function Chips({
  options,
  value,
  onPick,
  compact,
}: Readonly<{
  options: string[]
  value: number
  onPick: (i: number) => void
  compact?: boolean
}>) {
  // Fade each edge while more chips sit beyond it.
  const { ref: row, style: fade } = useEdgeFade<HTMLDivElement>("3rem")
  const slot = useContext(DemoChipSlot)
  const pill = useId()
  if (compact && slot) {
    return createPortal(
      <div
        role="group"
        className="flex gap-1 rounded-full bg-white/[0.07] p-1 ring-1 ring-white/10"
      >
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-pressed={i === value}
            onClick={() => onPick(i)}
            className={cn(
              "relative h-10 min-w-0 flex-1 rounded-full px-2 text-[13px] font-medium transition-colors duration-300",
              i === value ? "text-neutral-950" : "text-white/70"
            )}
          >
            {i === value && (
              <motion.span
                layoutId={pill}
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative block truncate">{o}</span>
          </button>
        ))}
      </div>,
      slot
    )
  }
  const buttons = options.map((o, i) => (
    <button
      key={o}
      type="button"
      onClick={() => onPick(i)}
      className={cn(
        "rounded-full border whitespace-nowrap transition-colors",
        compact
          ? "h-10 shrink-0 px-4 text-[13px]"
          : "px-3.5 py-1.5 text-[12px]",
        i === value
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-black/10 bg-white/80 text-neutral-600 hover:border-black/25 hover:text-neutral-900"
      )}
    >
      {o}
    </button>
  ))
  // On phones the row may be wider than the screen: it scrolls sideways
  // (centred when it fits) instead of shrinking the chips.
  return compact ? (
    <div
      ref={row}
      style={fade}
      className="absolute inset-x-0 bottom-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="mx-auto flex w-max gap-2 px-3">{buttons}</div>
    </div>
  ) : (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
      {buttons}
    </div>
  )
}

export function Step({
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
