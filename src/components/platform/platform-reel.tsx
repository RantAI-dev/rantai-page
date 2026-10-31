"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { ArrowUpRight } from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { smoothScrollTo } from "@/components/smooth-scroll"
import { SplitReveal } from "@/components/split-reveal"
import { ProductLogo, productIdFrom } from "@/components/product-logo"
import { cn } from "@/lib/utils"

import { demos } from "@/components/platform/demos"
import { Media, products, type Product } from "@/components/platform/products"
import { PanelScene } from "@/components/platform/scenes"

/** In-page anchors other sections link to, by product. */
const anchors: Record<string, string> = {
  agents: "rantai-agents",
  claw: "rantaiclaw",
  llmops: "rantai-llmops",
  lake: "rantai-lakehouse",
}

type Intro = { eyebrow: string; title: string }
const defaultIntro: Intro = {
  eyebrow: "Platform",
  title: "Products built to run in production.",
}

function PlatformIntro({ intro }: Readonly<{ intro: Intro }>) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <Eyebrow className="text-white/50">{intro.eyebrow}</Eyebrow>
      <SplitReveal
        id="platform-heading"
        text={intro.title}
        className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
      />
    </div>
  )
}

function Features({
  product,
  className,
}: Readonly<{ product: Product; className?: string }>) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {product.features.map((f) => (
        <li
          key={f}
          className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/70"
        >
          {f}
        </li>
      ))}
    </ul>
  )
}

/** Scroll progress of `ref`, copied into a JS motion value (sticky-safe). */
function useStickyProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const progress = useMotionValue(0)
  useEffect(
    () => scrollYProgress.on("change", (v) => progress.set(v)),
    [scrollYProgress, progress]
  )
  return progress
}

/* ------------------------------------------------------------------ */
/*  H · Reel: vertical scroll drives a horizontal reel of full panels  */
/* ------------------------------------------------------------------ */

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    // Below 1280px the media column is too narrow for the demos to read, so
    // those screens get the stacked list instead.
    const q = window.matchMedia("(min-width: 1280px)")
    const update = () => setDesktop(q.matches)
    update()
    q.addEventListener("change", update)
    return () => q.removeEventListener("change", update)
  }, [])
  return desktop
}

/** Primary pill to the product site, with a light sweep on hover. */
function VisitButton({ product }: Readonly<{ product: Product }>) {
  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-white pr-1.5 pl-5 text-[15px] font-medium text-black transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-linear-to-r before:from-transparent before:via-black/10 before:to-transparent before:transition-transform before:duration-700 hover:bg-white/90 hover:before:translate-x-[300%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1 motion-reduce:before:hidden"
    >
      Visit {product.name}
      <span className="grid size-9 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
    </a>
  )
}

/** The name comes into focus: blurred and widely spaced off-centre,
 *  sharp and tight when its panel is in the middle. */
function FocusName({
  name,
  d,
}: Readonly<{ name: string; d: MotionValue<number> }>) {
  // Sharp for the whole middle stretch of the panel; it only blurs and
  // loosens on the way in and out.
  const stops = [-0.6, -0.25, 0.25, 0.6]
  const blur = useTransform(d, stops, [14, 0, 0, 14])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  const letterSpacing = useTransform(d, stops, [
    "0.1em",
    "-0.06em",
    "-0.06em",
    "0.1em",
  ])
  const opacity = useTransform(d, stops, [0, 1, 1, 0])
  return (
    <motion.span
      className="inline-block"
      style={{ filter, letterSpacing, opacity }}
    >
      {name}
    </motion.span>
  )
}

function PanelText({
  product,
  d,
}: Readonly<{ product: Product; d?: MotionValue<number> }>) {
  const name = product.name.replace("RantAI ", "").replace("RantAI", "")
  const id = productIdFrom(product.name)
  return (
    <>
      {id && (
        <span className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pr-4 pl-1.5 ring-1 ring-white/10">
          <span className="grid size-8 place-items-center rounded-full bg-white">
            <ProductLogo id={id} className="h-4" />
          </span>
          <span className="text-sm text-white/70">{product.name}</span>
        </span>
      )}
      <h3
        aria-label={name}
        className={cn(
          "pb-[0.08em] leading-[0.86] font-medium tracking-[-0.06em] whitespace-nowrap",
          // Longer names step down so they never reach the demo beside them.
          name.length > 6
            ? "text-[clamp(2.75rem,5vw,5.75rem)]"
            : "text-[clamp(3rem,7vw,7.5rem)]"
        )}
      >
        {d ? <FocusName name={name} d={d} /> : name}
      </h3>
      <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/60">
        {product.tagline}
      </p>
      <Features product={product} className="mt-6" />
      <div className="mt-9">
        <VisitButton product={product} />
      </div>
    </>
  )
}

/** One panel. `pos` is the reel position in panels (0 … n-1). */
function ReelPanel({
  product,
  index,
  pos,
  width,
}: Readonly<{
  product: Product
  index: number
  pos: MotionValue<number>
  width: string
}>) {
  const d = useTransform(pos, (p) => Math.max(-1, Math.min(1, p - index)))
  // Text drifts against the reel (parallax) and fades away from centre;
  // the screen settles in with a slight zoom.
  const textX = useTransform(d, [-1, 0, 1], [-160, 0, 160])
  const textOpacity = useTransform(
    d,
    [-1, -0.5, 0, 0.5, 1],
    [0, 0.3, 1, 0.3, 0]
  )
  const mediaScale = useTransform(d, [-1, 0, 1], [0.86, 1, 0.86])
  const mediaOpacity = useTransform(d, [-1, 0, 1], [0.35, 1, 0.35])
  const numberX = useTransform(d, [-1, 0, 1], [-120, 0, 120])
  const numberOpacity = useTransform(d, [-0.6, 0, 0.6], [0, 1, 0])
  const sceneOpacity = useTransform(d, [-0.7, 0, 0.7], [0, 1, 0])
  const [live, setLive] = useState(false)
  useEffect(() => {
    const update = (p: number) => setLive(Math.abs(p - index) < 1.2)
    update(pos.get())
    return pos.on("change", update)
  }, [pos, index])

  return (
    <section
      className="relative isolate grid h-full grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] items-center gap-12 px-14"
      style={{ width }}
    >
      <PanelScene id={product.id} opacity={sceneOpacity} live={live} />
      {/* Huge index number behind the panel */}
      <motion.span
        aria-hidden="true"
        style={{ x: numberX, opacity: numberOpacity }}
        className="pointer-events-none absolute right-6 -bottom-[0.18em] text-[clamp(10rem,24vw,22rem)] leading-none font-semibold tracking-[-0.06em] text-white/[0.04] select-none"
      >
        0{index + 1}
      </motion.span>
      <motion.div
        style={{ x: textX, opacity: textOpacity }}
        className="relative"
      >
        <PanelText product={product} d={d} />
      </motion.div>
      <motion.div
        data-glow
        style={{ scale: mediaScale, opacity: mediaOpacity }}
        className="relative aspect-[16/10] max-h-[68svh] w-full rounded-3xl bg-white/10 p-px shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
      >
        {/* Cursor light on the 1px edge: it sits behind the screen, so only
            the rim shows it */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(260px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.85),transparent_70%)] opacity-(--glow,0) transition-opacity duration-500" />
        <div className="relative size-full overflow-hidden rounded-[23px] bg-neutral-950">
          {demos[product.id] ? (
            (() => {
              const Demo = demos[product.id]
              return <Demo active={live} />
            })()
          ) : (
            <Media product={product} />
          )}
        </div>
      </motion.div>
    </section>
  )
}

/** The bright part of a rail segment. It follows raw scroll progress, so it
 *  keeps filling while its product holds still: the visitor always sees
 *  that scrolling is doing something. A segment covers its product's hold
 *  and the move to the next one. */
function RailFill({
  progress,
  index,
  count,
}: Readonly<{ progress: MotionValue<number>; index: number; count: number }>) {
  const width = useTransform(progress, (p) => {
    const total = count * HOLD + (count - 1) * MOVE
    const start = (index * (HOLD + MOVE)) / total
    const length = (index === count - 1 ? HOLD : HOLD + MOVE) / total
    return `${Math.max(0, Math.min(1, (p - start) / length)) * 100}%`
  })
  return (
    <motion.span
      className="absolute top-0 left-0 h-px bg-white"
      style={{ width }}
    />
  )
}

const HOLD = 1.8 // scroll length a panel holds still, relative to…
const MOVE = 0.8 // …the scroll length of a move between two panels

/** Scroll progress (0–1) → reel position (0 … n-1), with holds. */
function reelPosition(p: number, n: number) {
  const total = n * HOLD + (n - 1) * MOVE
  let t = Math.min(1, Math.max(0, p)) * total
  for (let i = 0; i < n; i++) {
    if (t <= HOLD) return i
    t -= HOLD
    if (i === n - 1) return i
    if (t <= MOVE) {
      const k = t / MOVE
      return i + k * k * (3 - 2 * k)
    }
    t -= MOVE
  }
  return n - 1
}

/** The scroll progress at the middle of panel i's hold. */
function holdCentre(i: number, n: number) {
  const total = n * HOLD + (n - 1) * MOVE
  return (i * (HOLD + MOVE) + HOLD / 2) / total
}

function DesktopReel({ intro }: Readonly<{ intro: Intro }>) {
  const ref = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progress = useStickyProgress(ref)
  const n = products.length

  // Light the edge of each screen nearest the cursor, as in the footer.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return
    const frames = () => stage.querySelectorAll<HTMLElement>("[data-glow]")
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      frames().forEach((f) => {
        const r = f.getBoundingClientRect()
        f.style.setProperty("--mx", `${e.clientX - r.left}px`)
        f.style.setProperty("--my", `${e.clientY - r.top}px`)
        f.style.setProperty("--glow", "1")
      })
    }
    const leave = () =>
      frames().forEach((f) => f.style.setProperty("--glow", "0"))
    stage.addEventListener("pointermove", move)
    stage.addEventListener("pointerleave", leave)
    return () => {
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerleave", leave)
    }
  }, [])
  // Each product holds still for a while, then the reel eases to the next.
  const pos = useTransform(progress, (p) => reelPosition(p, n))
  const x = useTransform(pos, (p) => `${(-p / n) * 100}%`)
  const [index, setIndex] = useState(0)
  useEffect(() => pos.on("change", (p) => setIndex(Math.round(p))), [pos])

  const targetY = useCallback(
    (i: number) => {
      const el = ref.current
      if (!el) return null
      const top = el.getBoundingClientRect().top + window.scrollY
      const span = el.offsetHeight - window.innerHeight
      return top + span * holdCentre(i, n)
    },
    [n]
  )

  const jump = (i: number) => {
    const y = targetY(i)
    if (y !== null) smoothScrollTo(y, 1.1)
  }

  return (
    <div className="pt-20">
      <div className="px-14">
        <PlatformIntro intro={intro} />
      </div>
      <div ref={ref} style={{ height: `${n * 170}svh` }} className="relative">
        {/* Anchors land in the middle of a product's hold */}
        {products.map((p, i) =>
          anchors[p.id] ? (
            <span
              key={p.id}
              id={anchors[p.id]}
              aria-hidden="true"
              className="absolute left-0 h-px w-px"
              style={{
                top: `calc((${n * 170}svh - 100svh + 4rem) * ${holdCentre(i, n)})`,
              }}
            />
          ) : null
        )}
        <div
          ref={stageRef}
          className="sticky top-16 isolate flex h-[calc(100svh-4rem)] flex-col overflow-hidden"
        >
          {/* Product rail: where you are, and a shortcut to each panel */}
          <nav
            aria-label="Products"
            className="flex items-center gap-1 px-14 pt-2 pb-4"
          >
            {products.map((p, i) => {
              const on = i === index
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={on}
                  className="group relative flex-1 pt-3 pb-2 text-left"
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-white/15" />
                  <RailFill progress={progress} index={i} count={n} />
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      on
                        ? "text-white"
                        : "text-white/40 group-hover:text-white/70"
                    )}
                  >
                    <span className="mr-2 text-xs tabular-nums">0{i + 1}</span>
                    {p.name}
                  </span>
                </button>
              )
            })}
          </nav>
          <div className="relative min-h-0 flex-1">
            <motion.div
              className="absolute inset-y-0 left-0 flex"
              style={{ x, width: `${n * 100}%` }}
            >
              {products.map((p, i) => (
                <ReelPanel
                  key={p.id}
                  product={p}
                  index={i}
                  pos={pos}
                  width={`${100 / n}%`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Phones, tablets and reduced motion get a plain vertical list. */
function StackedReel({ intro }: Readonly<{ intro: Intro }>) {
  return (
    <div className="px-5 py-20 sm:px-10">
      <PlatformIntro intro={intro} />
      <div className="space-y-16">
        {products.map((p) => (
          <section key={p.id} id={anchors[p.id]} className="scroll-mt-24">
            <PanelText product={p} />
            <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-2xl border border-white/12 bg-neutral-950 md:aspect-[16/10]">
              {demos[p.id] ? (
                (() => {
                  const Demo = demos[p.id]
                  return <Demo />
                })()
              ) : (
                <Media product={p} />
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

/**
 * Homepage platform section: the four products on a horizontal reel driven
 * by vertical scroll (desktop), or stacked (phones, reduced motion).
 */
export function PlatformReel({
  intro = defaultIntro,
}: Readonly<{ intro?: Intro }>) {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  return desktop && !reduce ? (
    <DesktopReel intro={intro} />
  ) : (
    <StackedReel intro={intro} />
  )
}
