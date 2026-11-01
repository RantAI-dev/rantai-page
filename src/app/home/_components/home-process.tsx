"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { ArrowRight } from "lucide-react"

import { DarkPanel } from "@/components/dark-panel"
import { Eyebrow } from "@/components/eyebrow"
import { FooterAscii } from "@/components/footer-ascii"
import { PillLink } from "@/components/pill-link"
import { SplitReveal } from "@/components/split-reveal"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

import { visuals } from "./process-visuals"

// "How we work": three steps in order. On desktop the section pins and
// scroll plays the steps one by one, then shows all three in focus.

const steps = [
  { title: "Define the use case", body: "Pick one workflow worth changing." },
  {
    title: "Build in your environment",
    body: "Our engineers work inside your infrastructure.",
  },
  {
    title: "Run and improve",
    body: "Monitor, evaluate, and retrain in production.",
  },
]

/** On the services page the section is already about engineering, so the
 *  links back to it are dropped. */
type Links = { links: boolean; eyebrow?: string }

function Header({ links, eyebrow = "How we work" }: Readonly<Links>) {
  return (
    <div className="mb-[min(2.5rem,4dvh)] max-w-3xl">
      <Eyebrow className="text-white/50">{eyebrow}</Eyebrow>
      <SplitReveal
        id="process-heading"
        text="We build it with you."
        className="mt-5 text-[clamp(2.25rem,min(5.6vw,8dvh),5rem)] leading-[0.98] font-medium tracking-[-0.045em]"
      />
      <div className="mt-[min(2rem,3dvh)] flex flex-col gap-3 sm:flex-row">
        {links && (
          <PillLink href="/services#forward-deployed-engineering" size="lg">
            Forward Deployed Engineering
          </PillLink>
        )}
        <PillLink
          href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Forward Deployed Engineering")}`}
          size="lg"
          variant={links ? "outline" : "solid"}
          icon="external"
        >
          Talk to our team
        </PillLink>
      </div>
    </div>
  )
}

function Footnote({ links }: Readonly<Links>) {
  if (!links) return null
  return (
    <p className="mt-[min(2rem,3dvh)] text-sm text-white/50">
      Also available as{" "}
      <Link
        href="/services"
        className="group inline-flex items-center gap-1 text-white/80 hover:text-white"
      >
        software and AI engineering
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </p>
  )
}

/** Tilts toward the cursor and lets a soft glare follow it (in focus only). */
function TiltCard({
  on,
  className,
  children,
}: Readonly<{ on: boolean; className?: string; children: React.ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 0, hover: false })
  return (
    <div
      ref={ref}
      className="h-full [perspective:1200px]"
      onPointerMove={(e) => {
        if (!on || reduce || e.pointerType !== "mouse") return
        const r = ref.current!.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        setTilt({
          x: (0.5 - py) * 7,
          y: (px - 0.5) * 9,
          gx: px * 100,
          gy: py * 100,
          hover: true,
        })
      }}
      onPointerLeave={() =>
        setTilt({ x: 0, y: 0, gx: 50, gy: 0, hover: false })
      }
    >
      <div
        className={cn(
          "relative h-full transition-transform duration-300 ease-out [transform-style:preserve-3d]",
          className
        )}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-300"
          style={{
            opacity: on && tilt.hover ? 1 : 0,
            background: `radial-gradient(420px circle at ${tilt.gx}% ${tilt.gy}%, rgb(255 255 255 / 0.08), transparent 45%)`,
          }}
        />
      </div>
    </div>
  )
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
/** Opacity of a border at rest (same as the card's normal border). */
const REST = 0.3
/** 0 → 1 between a and b, eased at both ends. */
const ease01 = (v: number, a: number, b: number) => {
  const k = clamp01((v - a) / (b - a))
  return k * k * k * (k * (k * 6 - 15) + 10)
}

// Share of each step spent on the connector that leads into its card.
const LEAD = 0.14

/**
 * A horizontal connector at the cards' mid-line. `fill` maps scroll progress
 * to how much of it is drawn (0 to 1, left to right).
 */
function Connector({
  progress,
  fill,
  className,
}: Readonly<{
  progress: MotionValue<number>
  fill: (p: number) => { drawn: number; line: number }
  className?: string
}>) {
  // No visible line: only a small light travels across the gap.
  const left = useTransform(progress, (p) => `${fill(p).drawn * 100}%`)
  const opacity = useTransform(progress, (p) => {
    const d = fill(p).drawn
    // Fades in as it leaves and out before it arrives, so it never
    // lingers against a card's edge when scrolling stops.
    return ease01(d, 0, 0.15) * (1 - ease01(d, 0.7, 0.95))
  })
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 h-4 -translate-y-1/2 overflow-hidden",
        className
      )}
    >
      <motion.span
        className="absolute top-1/2 h-1.5 w-6 -translate-x-full -translate-y-1/2 rounded-full bg-white blur-[4px]"
        style={{ left, opacity }}
      />
      <motion.span
        className="absolute top-1/2 h-px w-4 -translate-x-full -translate-y-1/2 bg-linear-to-r from-transparent to-white"
        style={{ left, opacity }}
      />
    </span>
  )
}

/** Lead-in for card i: draws during the first part of its step. */
function leadFill(i: number) {
  return (p: number) => {
    if (p >= PLAY) return { drawn: 1, line: 1 }
    const local = (p - (i * PLAY) / 3) / (PLAY / 3)
    if (local <= 0) return { drawn: 0, line: 1 }
    return { drawn: clamp01(local / LEAD), line: 1 }
  }
}

/** Tail after the last card: runs out to the edge as the finale starts. */
function tailFill(p: number) {
  if (p < PLAY) return { drawn: 0, line: 1 }
  return { drawn: clamp01((p - PLAY) / (1 - PLAY) / 0.25), line: 1 }
}

/**
 * The card's own border as a progress line. While a step plays, the line
 * starts at the middle of the left edge and splits in two: one half runs
 * over the top, the other along the bottom, and they meet on the right.
 * The closed border then glows, dims, and the next card takes over. Finished
 * borders stay drawn; in the finale all three simply light up together.
 */
function BorderProgress({
  progress,
  index,
}: Readonly<{ progress: MotionValue<number>; index: number }>) {
  const ref = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const state = useTransform(progress, (p) => {
    if (p >= PLAY) {
      const f = (p - PLAY) / (1 - PLAY)
      // A brief flare: rises, holds a moment, then settles back to rest.
      const g = ease01(f, 0.1, 0.35) * (1 - ease01(f, 0.55, 0.85))
      return { drawn: 1, line: REST + (1 - REST) * g, glow: g * 0.75, tip: 0 }
    }
    const local = (p - (index * PLAY) / 3) / (PLAY / 3)
    if (local < LEAD) return { drawn: 0, line: 0, glow: 0, tip: 0 }
    if (local > 1) return { drawn: 1, line: REST, glow: 0, tip: 0 } // finished: normal border
    const drawn = clamp01((local - LEAD) / (0.65 - LEAD))
    // A light rides the tip while the line draws, then fades once it closes.
    const tip =
      ease01(local, LEAD, LEAD + 0.05) * (1 - ease01(local, 0.62, 0.78))
    // Bright while the light runs, then settles to a normal border.
    const line = 1 - (1 - REST) * ease01(local, 0.62, 0.85)
    return { drawn, line, glow: 0, tip }
  })
  const dash = useTransform(state, (st) => `${st.drawn} 1`)
  const glow = useTransform(state, (st) => st.glow)
  const line = useTransform(state, (st) => st.line)
  const tip = useTransform(state, (st) => st.tip)
  // Only the last stretch of the drawn line, so the light sits on its tip.
  // One short dash shifted to end at the tip. (A zero-length leading dash
  // would draw a stray round dot at the start of the path.)
  const TIP = 0.12
  const tipDash = useTransform(state, (st) => `${Math.min(TIP, st.drawn)} 3`)
  const tipOffset = useTransform(state, (st) => -Math.max(0, st.drawn - TIP))

  const { w, h } = size
  const r = Math.min(24, h / 2)
  const e = 0.5
  const top = `M${e},${h / 2} L${e},${r} A${r - e},${r - e} 0 0 1 ${r},${e} L${w - r},${e} A${r - e},${r - e} 0 0 1 ${w - e},${r} L${w - e},${h / 2}`
  const bottom = `M${e},${h / 2} L${e},${h - r} A${r - e},${r - e} 0 0 0 ${r},${h - e} L${w - r},${h - e} A${r - e},${r - e} 0 0 0 ${w - e},${h - r} L${w - e},${h / 2}`
  const id = `bp-glow-${index}`

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {w > 0 &&
        [top, bottom].map((d) => (
          <g key={d.slice(0, 12) + (d === top ? "t" : "b")}>
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="6"
              filter={`url(#${id})`}
              pathLength={1}
              style={{ strokeDasharray: dash, opacity: glow }}
            />
            {/* Light riding the tip of the line while it draws */}
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              filter={`url(#${id})`}
              pathLength={1}
              style={{
                strokeDasharray: tipDash,
                strokeDashoffset: tipOffset,
                opacity: tip,
              }}
            />
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: dash, opacity: line }}
            />
          </g>
        ))}
    </svg>
  )
}

/** active: 0–2 = that step is playing, 3 = all steps done (all in focus). */
function SequenceRow({
  active,
  progress,
}: Readonly<{ active: number; progress: MotionValue<number> }>) {
  const all = active === 3
  return (
    <ol className="grid gap-6 md:grid-cols-3 md:gap-5 xl:gap-6">
      {steps.map((s, i) => {
        const Visual = visuals[i]
        const done = i < active
        // Finished steps stay fully lit; only upcoming ones wait in the dark.
        const on = i <= active || all
        return (
          <li key={s.title} className="relative flex flex-col">
            {/* Line into this card: from the panel edge for the first card,
                across the gap for the others */}
            <Connector
              progress={progress}
              fill={leadFill(i)}
              className={cn(
                "right-full hidden md:block",
                i === 0 ? "w-10 lg:w-14" : "w-5 xl:w-6"
              )}
            />
            {i === steps.length - 1 && (
              <Connector
                progress={progress}
                fill={tailFill}
                className="left-full hidden w-10 md:block lg:w-14"
              />
            )}
            <div className="relative flex-1">
              {/* Soft light behind the card in focus */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgb(255_255_255/0.09),transparent)] transition-opacity duration-700",
                  on ? "opacity-100" : "opacity-0"
                )}
              />
              <TiltCard on={i === active || all}>
                <div
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[24px] border transition-[border-color,background-color,opacity,transform,box-shadow,filter] duration-700",
                    on
                      ? "border-transparent bg-[#0d0d0f]/95 shadow-[0_30px_80px_-40px_rgb(255_255_255/0.25),inset_0_1px_0_rgb(255_255_255/0.12)]"
                      : done
                        ? "border-transparent bg-transparent opacity-50"
                        : "border-transparent bg-transparent opacity-30 blur-[1px]"
                  )}
                >
                  <div
                    className={cn(
                      "relative h-[clamp(11rem,30dvh,17rem)] min-h-0 overflow-hidden border-b transition-colors duration-700",
                      on
                        ? "border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255/0.07),transparent_70%)]"
                        : "border-transparent"
                    )}
                  >
                    <div className="relative size-full">
                      <Visual
                        active={on && !all ? true : i === active}
                        done={done || all}
                      />
                    </div>
                  </div>
                  <div className="px-8 pt-5 pb-[min(2rem,3dvh)]">
                    <h3 className="text-2xl font-medium tracking-[-0.03em]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-white/60">{s.body}</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <BorderProgress progress={progress} index={i} />
                </div>
              </TiltCard>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** B1 · the sequence follows scroll (the section pins while it plays). */
// Share of the scroll used by the three steps; the rest is the finale
// where all three stay in focus.
const PLAY = 0.78

function PinnedSequence({ links, eyebrow }: Readonly<Links>) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const progress = useMotionValue(0)
  useEffect(
    () => scrollYProgress.on("change", (v) => progress.set(v)),
    [scrollYProgress, progress]
  )
  const [active, setActive] = useState(0)
  useEffect(
    () =>
      progress.on("change", (v) =>
        setActive(v >= PLAY ? 3 : Math.min(2, Math.floor((v / PLAY) * 3)))
      ),
    [progress]
  )
  return (
    // The pinned frame is the dark card itself, sized to the screen below
    // the navbar with a small white gutter above and below, so its rounded
    // corners always show while it is pinned.
    <div ref={ref} className="relative h-[300dvh]">
      <div className="dark sticky top-[calc(4rem+0.75rem)] isolate flex h-[calc(100dvh-5.5rem)] flex-col justify-center overflow-hidden rounded-[28px] bg-black px-10 text-white lg:px-14">
        {/* ASCII wave behind, faded away from the heading */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_40%,#000_80%,transparent_100%)] opacity-70"
        >
          <FooterAscii />
        </div>
        <Header links={links} eyebrow={eyebrow} />
        <SequenceRow active={active} progress={progress} />
        <Footnote links={links} />
      </div>
    </div>
  )
}

/** Phones, tablets and reduced motion: the three cards, all in focus. */
function StaticSequence({ links, eyebrow }: Readonly<Links>) {
  const progress = useMotionValue(1)
  return (
    <div className="px-5 py-24 sm:px-10">
      <Header links={links} eyebrow={eyebrow} />
      <SequenceRow active={3} progress={progress} />
      <Footnote links={links} />
    </div>
  )
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const q = window.matchMedia("(min-width: 768px)")
    const update = () => setDesktop(q.matches)
    update()
    q.addEventListener("change", update)
    return () => q.removeEventListener("change", update)
  }, [])
  return desktop
}

export function HomeProcess({
  links = true,
  eyebrow,
}: Readonly<Partial<Links>>) {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  if (desktop && !reduce) {
    return (
      <section
        id="how-we-work"
        aria-labelledby="process-heading"
        className="scroll-mt-20 px-3 sm:px-4"
      >
        <PinnedSequence links={links} eyebrow={eyebrow} />
      </section>
    )
  }
  return (
    <DarkPanel
      id="how-we-work"
      aria-labelledby="process-heading"
      className="scroll-mt-20"
    >
      <StaticSequence links={links} eyebrow={eyebrow} />
    </DarkPanel>
  )
}
