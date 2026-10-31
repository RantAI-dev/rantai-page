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

function Header() {
  return (
    <div className="mb-[min(2.5rem,4dvh)] max-w-3xl">
      <Eyebrow className="text-white/50">How we work</Eyebrow>
      <SplitReveal
        id="process-heading"
        text="We build it with you."
        className="mt-5 text-[clamp(2.25rem,min(5.6vw,8dvh),5rem)] leading-[0.98] font-medium tracking-[-0.045em]"
      />
      <div className="mt-[min(2rem,3dvh)] flex flex-col gap-3 sm:flex-row">
        <PillLink href="/services#forward-deployed-engineering" size="lg">
          Forward Deployed Engineering
        </PillLink>
        <PillLink
          href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Forward Deployed Engineering")}`}
          size="lg"
          variant="outline"
          icon="external"
        >
          Talk to our team
        </PillLink>
      </div>
    </div>
  )
}

function Footnote() {
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

const short = ["Define", "Build", "Run"]

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
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: on && tilt.hover ? 1 : 0,
            background: `radial-gradient(420px circle at ${tilt.gx}% ${tilt.gy}%, rgb(255 255 255 / 0.08), transparent 45%)`,
          }}
        />
      </div>
    </div>
  )
}

/** Progress segment for one step: fills while that step plays. */
function Segment({
  progress,
  index,
}: Readonly<{ progress: MotionValue<number>; index: number }>) {
  const width = useTransform(progress, (p) => {
    const start = (index * PLAY) / 3
    return `${Math.max(0, Math.min(1, (p - start) / (PLAY / 3))) * 100}%`
  })
  return (
    <motion.span
      className="absolute top-0 left-0 h-px bg-white"
      style={{ width }}
    />
  )
}

/** active: 0–2 = that step is playing, 3 = all steps done (all in focus). */
function SequenceRow({
  active,
  progress,
}: Readonly<{ active: number; progress: MotionValue<number> }>) {
  const all = active === 3
  return (
    <ol className="grid gap-6 md:grid-cols-3 md:gap-8 xl:gap-12">
      {steps.map((s, i) => {
        const Visual = visuals[i]
        const done = i < active
        const on = i === active || all
        return (
          <li key={s.title} className="flex flex-col">
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
                    "relative flex h-full flex-col overflow-hidden rounded-3xl border transition-[border-color,background-color,opacity,transform,box-shadow,filter] duration-700",
                    on
                      ? "scale-[1.02] border-white/30 bg-[#0d0d0f]/95 shadow-[0_30px_80px_-40px_rgb(255_255_255/0.25),inset_0_1px_0_rgb(255_255_255/0.12)]"
                      : done
                        ? "border-transparent bg-transparent opacity-50"
                        : "border-transparent bg-transparent opacity-30 blur-[1px]"
                  )}
                >
                  {/* Progress rail, inside the card: label and line on one row */}
                  <div className="hidden items-center gap-3 px-6 pt-5 md:flex">
                    <span
                      className={cn(
                        "shrink-0 text-[13px] transition-colors duration-500",
                        on
                          ? "text-white"
                          : done
                            ? "text-white/55"
                            : "text-white/30"
                      )}
                    >
                      <span className="mr-1.5 text-[11px] tabular-nums">
                        0{i + 1}
                      </span>
                      {short[i]}
                    </span>
                    <span className="relative h-px flex-1 bg-white/12">
                      <Segment progress={progress} index={i} />
                    </span>
                  </div>
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

function PinnedSequence() {
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
        <Header />
        <SequenceRow active={active} progress={progress} />
        <Footnote />
      </div>
    </div>
  )
}

/** Phones, tablets and reduced motion: the three cards, all in focus. */
function StaticSequence() {
  const progress = useMotionValue(1)
  return (
    <div className="px-5 py-24 sm:px-10">
      <Header />
      <SequenceRow active={3} progress={progress} />
      <Footnote />
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

export function HomeProcess() {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  if (desktop && !reduce) {
    return (
      <section
        id="how-we-work"
        aria-labelledby="process-heading"
        className="scroll-mt-20 px-3 sm:px-4"
      >
        <PinnedSequence />
      </section>
    )
  }
  return (
    <DarkPanel
      id="how-we-work"
      aria-labelledby="process-heading"
      className="scroll-mt-20"
    >
      <StaticSequence />
    </DarkPanel>
  )
}
