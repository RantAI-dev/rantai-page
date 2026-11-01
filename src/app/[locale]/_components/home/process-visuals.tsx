"use client"

import { useEffect, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react"
import { Check, Database, FileText, Inbox, Lock, Users } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

// Pictures for the "How we work" steps: realistic UI fragments for each step of "How we work".
// Small type, 1px lines, monospace for system output, quiet motion.
// Content is illustrative: no real customers, numbers or results.

type VisualProps = Readonly<{ active?: boolean; done?: boolean }>

const mono = "[font-family:ui-monospace,SFMono-Regular,Menlo,monospace]"

/** Counts 0 → total, one tick every `ms`, then holds and loops. */
function useTicker(total: number, ms: number, active: boolean, hold = 6) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active || reduce) return
    let k = 0
    const t = setInterval(() => {
      k = (k + 1) % (total + hold + 1)
      setN(Math.min(total, k))
    }, ms)
    return () => clearInterval(t)
  }, [active, reduce, total, ms, hold])
  return reduce ? total : n
}

/* 01 · Define: an impact/effort matrix; workflows land on it, then the
   high-impact, low-effort one is picked as the place to start */

const GREEN = "#5fc29a"

const options = [
  { id: "invoice", x: 0.22, y: 0.2, pick: true, color: "#5cb6f9" },
  { id: "tender", x: 0.72, y: 0.28, color: "#a99be6" },
  { id: "hr", x: 0.38, y: 0.58, color: "#d99a6c" },
  { id: "support", x: 0.62, y: 0.52, color: "#4fb3c9" },
  { id: "reporting", x: 0.2, y: 0.78, color: "#7aa2e3" },
  { id: "contract", x: 0.82, y: 0.72, color: "#d9868a" },
]

export function DefineVisual({ active = true, done = false }: VisualProps) {
  // 1-6: dots land, 7: crosshair moves in, 8: picked
  const t = useTranslations("home.process.visuals.define")
  const n = useTicker(8, 380, active, 8)
  const step = done ? 8 : n
  const aiming = step >= 7
  const picked = step >= 8
  const target = options[0]
  return (
    <div className="flex size-full items-center justify-center p-5 sm:p-6">
      <div className="relative w-full max-w-md">
        {/* Axis labels */}
        <span className="absolute top-1/2 -left-1 origin-left -translate-y-1/2 -rotate-90 text-[9px] tracking-[0.14em] text-white/35 uppercase max-md:-left-2 max-md:text-[11px] max-md:tracking-[0.1em]">
          {t("impact")}
        </span>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.14em] text-white/35 uppercase max-md:-bottom-5 max-md:text-[11px] max-md:tracking-[0.1em]">
          {t("effort")}
        </span>

        <div className="relative ml-4 aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
          {/* Quadrants, with the quick-win corner lit */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div
              className="border-r border-b border-white/8 transition-[background-color] duration-700"
              style={{
                background: picked
                  ? `radial-gradient(circle at 0% 0%, ${GREEN}2e, ${GREEN}0d 70%)`
                  : `radial-gradient(circle at 0% 0%, ${GREEN}14, transparent 70%)`,
              }}
            >
              <span
                className="block p-2 text-[9px] tracking-[0.12em] uppercase transition-colors duration-700 max-md:text-[11px] max-md:tracking-[0.08em]"
                style={{ color: picked ? GREEN : "rgb(255 255 255 / 0.4)" }}
              >
                {t("quickWins")}
              </span>
            </div>
            <div className="border-b border-white/8" />
            <div className="border-r border-white/8" />
            <div />
          </div>

          {/* Crosshair that glides onto the chosen workflow */}
          <motion.span
            className="absolute inset-y-0 w-px bg-white/25"
            initial={false}
            animate={{
              left: aiming ? `${target.x * 100}%` : "50%",
              opacity: aiming && !picked ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />
          <motion.span
            className="absolute inset-x-0 h-px bg-white/25"
            initial={false}
            animate={{
              top: aiming ? `${target.y * 100}%` : "50%",
              opacity: aiming && !picked ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />

          {options.map((o, i) => {
            const shown = i < step
            const chosen = o.pick && picked
            const dim = picked && !o.pick
            return (
              <motion.div
                key={o.id}
                // Anchored at the dot, not the row's centre, so the dot never
                // moves when its label grows into a pill. Labels on the right
                // half sit to the dot's left, so nothing runs off the edge.
                className={cn(
                  "absolute flex -translate-y-1/2 items-center gap-1.5",
                  o.x > 0.6 && "flex-row-reverse"
                )}
                style={
                  o.x > 0.6
                    ? {
                        right: `calc(${(1 - o.x) * 100}% - 4px)`,
                        top: `${o.y * 100}%`,
                      }
                    : {
                        left: `calc(${o.x * 100}% - 4px)`,
                        top: `${o.y * 100}%`,
                      }
                }
                initial={false}
                animate={{
                  opacity: shown ? (dim ? 0.3 : 1) : 0,
                  scale: shown ? 1 : 0.6,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <span className="relative grid place-items-center">
                  {chosen && (
                    // Keeps breathing once picked, so a finished card stays alive
                    <span
                      className="absolute size-6 animate-ping rounded-full motion-reduce:hidden"
                      style={{
                        background: `${o.color}33`,
                        animationDuration: "2.4s",
                      }}
                    />
                  )}
                  {chosen && (
                    <motion.span
                      className="absolute size-6 rounded-full border"
                      style={{
                        borderColor: `${o.color}99`,
                        background: `${o.color}1f`,
                      }}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                    />
                  )}
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: o.color,
                      boxShadow: `0 0 8px ${o.color}66`,
                    }}
                  />
                </span>
                {/* The pick's label turns into a pill: no floating badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full text-[10px] whitespace-nowrap transition-[background-color,color,padding] duration-300 max-md:text-[11px]",
                    // Phones: only the pick is named; the others stay dots,
                    // so the labels never pile up on a narrow matrix.
                    !o.pick && "max-md:hidden",
                    chosen
                      ? "bg-white py-0.5 pr-2 pl-1.5 font-medium text-black shadow-[0_6px_20px_-8px_rgb(255_255_255/0.5)]"
                      : "text-white/55"
                  )}
                >
                  {chosen && (
                    <Check
                      className="size-3"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  )}
                  {t(`options.${o.id}`)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* 02 · Build: an architecture diagram inside your network; links draw in
   one by one, then data flows through */

// Muted colours from the site's feature palette, used only on icon tiles.
const sources = [
  { id: "erp", icon: Database, y: 34, color: "#4fb3c9" },
  { id: "docs", icon: FileText, y: 70, color: "#7aa2e3" },
  { id: "inbox", icon: Inbox, y: 106, color: "#d99a6c" },
]

/** A small rounded tile behind an icon, tinted with the node's colour. */
function IconTile({
  icon: Icon,
  color,
  on,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  color: string
  on: boolean
}>) {
  return (
    <span
      className="grid size-[18px] place-items-center rounded-[5px] transition-colors duration-500"
      style={{
        background: on ? `${color}26` : "rgb(255 255 255 / 0.04)",
        color: on ? color : "rgb(255 255 255 / 0.3)",
      }}
    >
      <Icon className="size-3" aria-hidden="true" />
    </span>
  )
}

function Node({
  x,
  y,
  children,
  on,
  strong = false,
}: Readonly<{
  x: number
  y: number
  children: React.ReactNode
  on: boolean
  strong?: boolean
}>) {
  return (
    <motion.div
      // Always opaque, so lines never show through; "off" is just quieter.
      className={cn(
        "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg border py-1 pr-2 pl-1 text-[10.5px] whitespace-nowrap transition-colors duration-500 max-md:text-[11px]",
        strong && on
          ? "border-white bg-white text-black"
          : on
            ? "border-white/15 bg-[#111113] text-white/90"
            : "border-white/8 bg-[#0c0c0e] text-white/30"
      )}
      style={{ left: `${(x / 320) * 100}%`, top: `${(y / 140) * 100}%` }}
      animate={{ scale: on ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}

export function BuildVisual({ active = true, done = false }: VisualProps) {
  const reduce = useReducedMotion()
  // 0: nothing, 1-3: sources linked, 4: agent → team, 5+: live
  const t = useTranslations("home.process.visuals.build")
  const n = useTicker(5, 650, active, 6)
  const step = done ? 5 : n
  const live = step >= 5
  const paths = sources.map(
    (src) => `M62 ${src.y} C 120 ${src.y}, 120 70, 160 70`
  )
  const out = "M160 70 L 262 70"
  return (
    <div className="flex size-full items-center justify-center p-5 sm:p-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-3 rounded-2xl border border-dashed border-white/15" />
        {/* Boundary label, sitting on the dashed line like a tab */}
        <span className="absolute -top-[calc(0.75rem+8px)] left-3 z-10 inline-flex items-center gap-1.5 bg-[#0d0d0f] px-2 text-[11px] text-white/55">
          <Lock className="size-3" aria-hidden="true" />
          {t("boundary")}
        </span>
        <div className="relative aspect-[320/140]">
          <svg
            viewBox="0 0 320 140"
            className="absolute inset-0 size-full overflow-visible"
          >
            {[...paths, out].map((d, i) => {
              const drawn = i < 3 ? step > i : step >= 4
              return (
                <g key={d}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgb(255 255 255 / 0.3)"
                    strokeWidth="1"
                    initial={false}
                    animate={{ pathLength: drawn ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  {live && !reduce && (
                    <circle r="2" fill="#5cb6f9">
                      <animateMotion
                        dur="1.6s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>
          {sources.map((src, i) => {
            const Icon = src.icon
            return (
              <Node key={src.id} x={38} y={src.y} on={step > i}>
                <IconTile icon={Icon} color={src.color} on={step > i} />
                {t(`sources.${src.id}`)}
              </Node>
            )
          })}
          <Node x={170} y={70} on={step >= 3} strong>
            <span className="size-1.5 rounded-full bg-[#5cb6f9]" />
            {t("agent")}
          </Node>
          <Node x={278} y={70} on={step >= 4}>
            <IconTile icon={Users} color="#5fc29a" on={step >= 4} />
            {t("team")}
          </Node>
        </div>
      </div>
    </div>
  )
}

/* 03 · Run: a quality curve against a release bar; each retrain ships a
   new version (illustrative, no real numbers). The curve draws in smoothly
   and the head glides along it. */

const series = [
  0.82, 0.8, 0.77, 0.74, 0.86, 0.85, 0.83, 0.8, 0.9, 0.89, 0.88, 0.87,
]
const releases = [
  { at: 0, v: "v1" },
  { at: 4, v: "v2" },
  { at: 8, v: "v3" },
]
const CW = 300
const CH = 150
const BASE = CH - 18
const cx = (i: number) => 6 + (i / (series.length - 1)) * (CW - 12)
const cy = (q: number) => BASE - ((q - 0.68) / 0.26) * (BASE - 12)

// Sample a smooth Catmull-Rom curve through the series.
const curve: [number, number][] = (() => {
  const pts = series.map((q, i) => [cx(i), cy(q)] as [number, number])
  const out: [number, number][] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < 16; k++) {
      const t = k / 16
      const t2 = t * t
      const t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b +
          (-a + c) * t +
          (2 * a - 5 * b + 4 * c - d) * t2 +
          (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
})()

function partial(p: number) {
  const n = Math.max(2, Math.round(p * (curve.length - 1)) + 1)
  return curve.slice(0, n)
}

export function RunVisual({ active = true, done = false }: VisualProps) {
  const reduce = useReducedMotion()
  const progress = useMotionValue(done || reduce ? 1 : 0)

  useEffect(() => {
    if (done || reduce) {
      progress.set(1)
      return
    }
    if (!active) return
    let stop = false
    const run = async () => {
      while (!stop) {
        progress.set(0)
        await animate(progress, 1, {
          duration: 4.2,
          ease: [0.45, 0.05, 0.25, 1],
        })
        if (stop) break
        await new Promise((r) => setTimeout(r, 2600))
      }
    }
    run()
    return () => {
      stop = true
      progress.stop()
    }
  }, [active, done, reduce, progress])

  const line = useTransform(progress, (p) =>
    partial(p)
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ")
  )
  const area = useTransform(progress, (p) => {
    const pts = partial(p)
    const d = pts
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ")
    return `${d} L${pts[pts.length - 1][0]},${BASE} L${pts[0][0]},${BASE} Z`
  })
  const headX = useTransform(progress, (p) => partial(p).at(-1)![0])
  const headY = useTransform(progress, (p) => partial(p).at(-1)![1])
  const [reached, setReached] = useState(done || reduce ? 3 : 1)
  useMotionValueEvent(progress, "change", (p) => {
    const x = partial(p).at(-1)![0]
    setReached(releases.filter((r) => cx(r.at) <= x + 0.5).length)
  })
  const bar = cy(0.78)
  const t = useTranslations("home.process.visuals.run")

  return (
    <div className="flex size-full items-center justify-center p-5 sm:p-6">
      <div className="w-full">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-white/80">
            {t("quality")}
          </span>
          <span className="text-[10px] text-white/40 max-md:text-[11px]">
            {t("period")}
          </span>
        </div>
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id="run-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5fc29a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#5fc29a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="run-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7aa2e3" />
              <stop offset="100%" stopColor="#5fc29a" />
            </linearGradient>
          </defs>
          {[0.33, 0.66].map((g) => (
            <line
              key={g}
              x1="0"
              x2={CW}
              y1={BASE * g}
              y2={BASE * g}
              stroke="rgb(255 255 255 / 0.05)"
            />
          ))}
          <line
            x1="0"
            x2={CW}
            y1={BASE}
            y2={BASE}
            stroke="rgb(255 255 255 / 0.1)"
          />
          <line
            x1="0"
            x2={CW}
            y1={bar}
            y2={bar}
            stroke="rgb(255 255 255 / 0.28)"
            strokeDasharray="3 4"
          />
          <text
            x={CW}
            y={bar + 11}
            textAnchor="end"
            fill="rgb(255 255 255 / 0.4)"
            fontSize="8"
            className="max-md:text-[11px]"
          >
            {t("releaseBar")}
          </text>
          {releases.map((r, i) => {
            const on = i < reached
            return (
              <g
                key={r.v}
                style={{ opacity: on ? 1 : 0, transition: "opacity 400ms" }}
              >
                <line
                  x1={cx(r.at)}
                  x2={cx(r.at)}
                  y1="4"
                  y2={BASE}
                  stroke="rgb(255 255 255 / 0.4)"
                  strokeOpacity="0.35"
                  strokeDasharray="2 3"
                />
                <rect
                  x={cx(r.at) - 9}
                  y={BASE + 4}
                  width="18"
                  height="11"
                  rx="3.5"
                  fill="#141416"
                  stroke="rgb(255 255 255 / 0.16)"
                  // Phones: the label alone, at a readable size.
                  className="max-md:hidden"
                />
                <text
                  x={cx(r.at)}
                  y={BASE + 12}
                  textAnchor="middle"
                  fill="rgb(255 255 255 / 0.7)"
                  fontSize="7"
                  className={cn(mono, "max-md:text-[11px]")}
                >
                  {r.v}
                </text>
              </g>
            )
          })}
          <motion.path d={area} fill="url(#run-area)" />
          <motion.path
            d={line}
            fill="none"
            stroke="url(#run-line)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.circle
            cx={headX}
            cy={headY}
            r="7"
            fill="#5fc29a"
            opacity="0.22"
          />
          {/* Live pulse, which keeps going after the line has drawn in */}
          <motion.circle
            cx={headX}
            cy={headY}
            r="4"
            fill="none"
            stroke="#5fc29a"
            strokeWidth="1"
            className="origin-center animate-ping [transform-box:fill-box] motion-reduce:hidden"
            style={{ animationDuration: "2s" }}
          />
          <motion.circle cx={headX} cy={headY} r="3" fill="#5fc29a" />
        </svg>
      </div>
    </div>
  )
}

export const visuals = [DefineVisual, BuildVisual, RunVisual]
