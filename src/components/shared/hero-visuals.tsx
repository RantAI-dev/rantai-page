"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, ShieldCheck, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

// Visuals for the inner-page heroes: a few product fragments floating on the
// dark card, in the same card style as the platform demos. Content is
// illustrative.

const ease = [0.22, 1, 0.36, 1] as const
const W = 560
const H = 480

/** Lays the visual out at a fixed design size and scales it to fit. */
/**
 * Lays the visual out at a fixed design size and scales it to fit. With a
 * `zoom` above 1 the cards grow past the desk and get cropped at its edges;
 * layouts keep each card's header inside the middle of the canvas so the
 * product names stay visible.
 */
function Canvas({
  zoom = 1,
  children,
}: Readonly<{ zoom?: number; children: React.ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setScale(
        Math.min(e.contentRect.width / W, e.contentRect.height / H) * zoom
      )
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [zoom])
  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 origin-center"
        style={{
          width: W,
          height: H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** A card that drops in at its own angle, then drifts slowly. */
function Float({
  className,
  style,
  rotate = 0,
  delay = 0,
  children,
}: Readonly<{
  className?: string
  style?: React.CSSProperties
  rotate?: number
  delay?: number
  children: React.ReactNode
}>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ ...style, rotate }}
      initial={reduce ? false : { opacity: 0, y: 24, rotate: rotate * 2.5 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.9, ease, delay: 0.5 + delay }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{
          duration: 6 + delay * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5 + delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const card =
  "rounded-2xl border border-black/[0.07] bg-white text-neutral-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.04)]"

/* ------------------------------------------------------------------ */
/*  Products: one fragment from each product                           */
/* ------------------------------------------------------------------ */

const stages = ["Build", "Test", "Security scan", "Deploy"]

/** Lifts on hover, so every card answers the cursor. */
function Lift({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      {children}
    </motion.div>
  )
}

/** Counts up to `to` quickly whenever `run` changes. */
function useCount(to: number, run: number, ms = 900) {
  const [n, setN] = useState(to)
  useEffect(() => {
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms)
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, run, ms])
  return n
}

/**
 * "Ship better software, faster": a release pipeline that races through
 * its stages and flashes "Shipped", a deploy count that ticks up, and a
 * quality score for the "better". Speed streaks cross the desk, cards lift
 * on hover and the desk leans toward the cursor.
 */
export function ServicesVisual() {
  const reduce = useReducedMotion()
  // 0..stages.length = stages done; a run loops every few seconds.
  const [done, setDone] = useState(reduce ? stages.length : 0)
  const [run, setRun] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduce) return
    if (done < stages.length) {
      const t = setTimeout(() => setDone((d) => d + 1), 420)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setDone(0)
      setRun((r) => r + 1)
    }, 2600)
    return () => clearTimeout(t)
  }, [done, reduce])

  const shipped = done >= stages.length
  const seconds = useCount(228, run, 420 * stages.length)
  const deploys = useCount(27, run)
  const score = useCount(98, run, 1200)
  const clock = `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  return (
    <div
      className="absolute inset-0"
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* Speed streaks crossing the desk */}
      {!reduce && (
        <div className="pointer-events-none absolute -inset-10 overflow-hidden">
          {[18, 34, 52, 68, 84].map((top, i) => (
            <motion.span
              key={top}
              className="absolute h-px w-40 bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent"
              style={{ top: `${top}%` }}
              initial={{ left: "-20%" }}
              animate={{ left: "120%" }}
              transition={{
                duration: 1.4 + (i % 3) * 0.35,
                repeat: Infinity,
                ease: "easeIn",
                delay: i * 0.45,
                repeatDelay: 1.2 + (i % 2),
              }}
            />
          ))}
        </div>
      )}

      <Canvas zoom={1.35}>
        <motion.div
          className="absolute inset-0"
          animate={{ x: tilt.x * 8, y: tilt.y * 6 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {/* Release pipeline */}
          <Float
            className="w-[310px]"
            style={{ left: 72, top: 104 }}
            rotate={-2}
            delay={0}
          >
            <Lift>
              <div className={cn(card, "relative overflow-hidden p-5")}>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-neutral-500">
                    Release pipeline
                  </p>
                  <span className="text-[11px] text-neutral-500 tabular-nums">
                    {clock}
                  </span>
                </div>
                {/* Progress with a light sweep running across it */}
                <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    className="h-full rounded-full bg-[#10b981]"
                    animate={{ width: `${(done / stages.length) * 100}%` }}
                    transition={{ duration: 0.38, ease }}
                  />
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
                  {stages.map((label, i) => {
                    const state =
                      i < done ? "done" : i === done ? "now" : "next"
                    return (
                      <li
                        key={label}
                        className="flex items-center gap-2 text-[13px]"
                      >
                        <span
                          className={cn(
                            "grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-200",
                            state === "done" &&
                              "border-[#10b981] bg-[#10b981] text-white",
                            state === "now" && "border-[#f97316]",
                            state === "next" && "border-neutral-300"
                          )}
                        >
                          {state === "done" && (
                            <motion.span
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 18,
                              }}
                            >
                              <Check className="size-3" strokeWidth={3} />
                            </motion.span>
                          )}
                          {state === "now" && (
                            <span className="size-2 animate-ping rounded-full bg-[#f97316]" />
                          )}
                        </span>
                        <span
                          className={cn(
                            "transition-colors",
                            state === "next"
                              ? "text-neutral-400"
                              : "text-neutral-800"
                          )}
                        >
                          {label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <div className="relative mt-4 h-9">
                  <AnimatePresence mode="wait">
                    {shipped ? (
                      <motion.div
                        key="shipped"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 24,
                        }}
                        className="absolute inset-0 flex items-center gap-2 rounded-xl bg-[#10b981] px-3 text-[12.5px] font-medium text-white"
                      >
                        <Zap className="size-3.5 fill-current" />
                        Shipped to production
                        <span className="ml-auto text-white/80 tabular-nums">
                          {clock}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="running"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 text-[12.5px] text-neutral-500"
                      >
                        <span className="size-1.5 animate-pulse rounded-full bg-[#f97316]" />
                        Running {stages[Math.min(done, stages.length - 1)]}…
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* A flash across the card the moment it ships */}
                  <AnimatePresence>
                    {shipped && !reduce && (
                      <motion.span
                        key={`flash-${run}`}
                        className="pointer-events-none absolute -inset-x-6 -top-40 -bottom-6 bg-[#10b981]/15"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Lift>
          </Float>

          {/* Deploys this week */}
          <Float
            className="w-[220px]"
            style={{ left: 404, top: 62 }}
            rotate={3}
            delay={0.2}
          >
            <Lift>
              <div className={cn(card, "p-4")}>
                <p className="text-[12px] text-neutral-500">
                  Deploys this week
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[30px] leading-none font-medium tracking-[-0.03em] tabular-nums">
                    {deploys}
                  </span>
                  <span className="text-[11px] font-medium text-[#059669]">
                    ↑ 4× faster
                  </span>
                </div>
                <div className="mt-3 flex h-10 items-end gap-1.5">
                  {[30, 42, 38, 55, 64, 78, 100].map((h, i) => (
                    <motion.span
                      key={`${run}-${i}`}
                      className="flex-1 rounded-sm bg-[#f97316]"
                      style={{ opacity: 0.35 + i * 0.1 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </Lift>
          </Float>

          {/* Quality: the "better" half */}
          <Float
            className="w-[250px]"
            style={{ left: 270, top: 340 }}
            rotate={-1.5}
            delay={0.4}
          >
            <Lift>
              <div className={cn(card, "flex items-center gap-4 p-4")}>
                <span className="relative grid size-14 shrink-0 place-items-center">
                  <svg
                    viewBox="0 0 36 36"
                    className="absolute inset-0 -rotate-90"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="3"
                    />
                    <motion.circle
                      key={run}
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.98 }}
                      transition={{ duration: 1.2, ease }}
                    />
                  </svg>
                  <span className="text-[15px] font-medium tabular-nums">
                    {score}
                  </span>
                </span>
                <span>
                  <span className="block text-[13px] font-medium">
                    Quality score
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-neutral-500">
                    <ShieldCheck className="size-3.5 text-[#0d9488]" />0
                    incidents this month
                  </span>
                </span>
              </div>
            </Lift>
          </Float>
        </motion.div>
      </Canvas>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Academy, Insights, Team: real covers, posts and people             */
/* ------------------------------------------------------------------ */

type ShelfBook = { cover: string; name: string }

/** A cover drawn as a physical book: spine crease, page block, soft gloss. */
function Book({ src }: Readonly<{ src: string }>) {
  const pages =
    "repeating-linear-gradient(var(--dir), #ffffff 0 1.5px, #dcdad3 1.5px 2.5px)"
  return (
    <div className="relative aspect-[2/3]">
      {/* Page block peeking out on the right and bottom */}
      <div
        className="absolute top-[5px] -right-[7px] bottom-[2px] w-[9px] rounded-r-[3px] shadow-[2px_0_4px_rgba(0,0,0,0.12)]"
        style={{ background: pages, ["--dir" as string]: "90deg" }}
      />
      <div
        className="absolute right-[-5px] -bottom-[7px] left-[6px] h-[9px] rounded-b-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
        style={{ background: pages, ["--dir" as string]: "180deg" }}
      />
      <div className="relative size-full overflow-hidden rounded-l-[3px] rounded-r-[7px] shadow-[0_30px_50px_-24px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.15)]">
        <Image src={src} alt="" fill sizes="300px" className="object-cover" />
        {/* Spine: a shaded hinge with a crease */}
        <span className="absolute inset-y-0 left-0 w-[18px] bg-gradient-to-r from-black/40 via-white/20 to-transparent" />
        <span className="absolute inset-y-0 left-[13px] w-px bg-black/25" />
        {/* Gloss across the cover */}
        <span className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.22),transparent_38%,transparent_70%,rgb(0_0_0/0.08))]" />
      </div>
    </div>
  )
}

export function BooksVisual({ books }: Readonly<{ books: ShelfBook[] }>) {
  // The front book sits whole at the top; the two behind fan out and run
  // off the bottom of the desk.
  const fan = [
    { x: 40, y: 150, r: -9, z: 1 },
    { x: 172, y: 62, r: 0, z: 2 },
    { x: 318, y: 190, r: 9, z: 1 },
  ]
  return (
    <Canvas zoom={1.35}>
      {books.slice(0, 3).map((b, i) => (
        <Float
          key={b.cover}
          className="w-[215px]"
          style={{ left: fan[i].x, top: fan[i].y, zIndex: fan[i].z }}
          rotate={fan[i].r}
          delay={i * 0.15}
        >
          <Book src={b.cover} />
        </Float>
      ))}
    </Canvas>
  )
}

/**
 * The latest posts as pages in a folder (after React Bits' Folder). The
 * front flap drops open on load and the pages rise and fan out; a hovered
 * page lifts further and opens the post. Clicking the folder closes it.
 */
export function PostsVisual({
  posts,
}: Readonly<{
  posts: {
    slug: string
    title: string
    tag: string
    thumbnail?: string | null
  }[]
}>) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(Boolean(reduce))
  const [lift, setLift] = useState<number | null>(null)
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(t)
  }, [reduce])

  const pages = posts.slice(0, 3)
  // Fanned positions once the folder is open: left, centre, right.
  const fan = [
    { x: -118, y: -118, r: -9 },
    { x: 0, y: -150, r: 0 },
    { x: 118, y: -118, r: 9 },
  ]
  const spring = { type: "spring", stiffness: 170, damping: 20 } as const

  return (
    <Canvas zoom={1.15}>
      <div className="absolute top-[40%] left-1/2 h-[260px] w-[400px] -translate-x-1/2 [perspective:1100px]">
        {/* Back of the folder, with its tab */}
        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-[#0f9e8f] to-[#0b8276] shadow-[0_30px_60px_-30px_rgba(13,148,136,0.7)]">
          <span className="absolute -top-6 left-8 h-10 w-28 rounded-t-[16px] bg-[#0f9e8f]" />
        </div>

        {/* Pages */}
        {pages.map((post, i) => {
          const f = fan[i]
          const up = open && lift === i
          return (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              tabIndex={-1}
              onPointerEnter={() => setLift(i)}
              onPointerLeave={() => setLift(null)}
              className="absolute top-5 left-1/2 -ml-[105px] block w-[210px] rounded-2xl bg-white p-2.5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)]"
              style={{ zIndex: up ? 5 : i === 1 ? 3 : 2 }}
              initial={false}
              animate={
                open
                  ? {
                      x: f.x,
                      y: f.y - (up ? 26 : 0),
                      rotate: f.r,
                      scale: up ? 1.04 : 1,
                    }
                  : {
                      x: (i - 1) * 46,
                      y: -14 + Math.abs(i - 1) * 8,
                      rotate: (i - 1) * 3,
                      scale: 0.94,
                    }
              }
              transition={{
                ...spring,
                delay: open && lift === null ? 0.12 + i * 0.07 : 0,
              }}
            >
              <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
                {post.thumbnail && (
                  <Image
                    src={post.thumbnail}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="mt-2 block px-1 text-[9.5px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
                {post.tag}
              </span>
              <span className="mx-1 mt-0.5 mb-1 line-clamp-2 block text-[12.5px] leading-snug font-medium text-neutral-900">
                {post.title}
              </span>
            </motion.a>
          )
        })}

        {/* Front flap: drops open toward the viewer */}
        <motion.button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close folder" : "Open folder"}
          onClick={() => setOpen((v) => !v)}
          className="absolute inset-x-0 bottom-0 z-10 h-[78%] origin-bottom cursor-pointer rounded-[22px] bg-gradient-to-b from-[#2dd4bf] to-[#14b8a6] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]"
          initial={false}
          animate={{ rotateX: open ? -32 : 0, y: open ? 6 : 0 }}
          transition={spring}
        >
          <span className="absolute inset-x-6 top-4 h-px bg-white/30" />
          <span className="absolute bottom-6 left-7 text-left">
            <span className="block text-[22px] font-medium tracking-[-0.02em] text-white">
              Insights
            </span>
            <span className="block text-[12px] text-white/80">
              Latest from the team
            </span>
          </span>
        </motion.button>
      </div>
    </Canvas>
  )
}

type Person = { photo: string; name: string; role: string }

/**
 * The team as a masonry wall (after React Bits' Masonry): three columns of
 * photos at mixed heights that spring into place, run off the bottom of the
 * desk, and show a name on hover.
 */
const shapes = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[5/7]", "aspect-[1/1]"]

export function PeopleVisual({ people }: Readonly<{ people: Person[] }>) {
  const reduce = useReducedMotion()
  const cols: (Person & { shape: string; order: number })[][] = [[], [], []]
  people.slice(0, 12).forEach((p, i) => {
    cols[i % 3].push({
      ...p,
      shape: shapes[(i * 5 + (i % 3)) % shapes.length],
      order: i,
    })
  })
  const card = (p: (typeof cols)[number][number], copy: number) => (
    <motion.figure
      key={`${p.photo}-${copy}`}
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 20,
        delay: 0.4 + p.order * 0.06,
      }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-2xl bg-[#222] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.6)]",
        p.shape
      )}
    >
      <Image
        src={p.photo}
        alt=""
        fill
        sizes="(min-width: 1024px) 15vw, 40vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3.5 pt-10 pb-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="block text-[14px] font-medium">{p.name}</span>
        <span className="block text-[10.5px] tracking-[0.06em] text-white/70 uppercase">
          {p.role}
        </span>
      </figcaption>
    </motion.figure>
  )

  // Each column holds its photos twice and slides by half its height, so
  // the loop never shows a seam. Outer columns rise, the middle one falls;
  // the wall pauses while the cursor is on it.
  return (
    <div className="group/wall absolute inset-x-0 -inset-y-6 flex gap-3 [mask-image:linear-gradient(to_bottom,transparent,rgb(0_0_0/0.35)_5%,rgb(0_0_0/0.8)_10%,black_14%,black_86%,rgb(0_0_0/0.8)_90%,rgb(0_0_0/0.35)_95%,transparent)] sm:-inset-y-10">
      {cols.map((col, c) => (
        <div key={c} className={cn("flex-1", c === 2 && "hidden sm:block")}>
          <div
            className={cn(
              "flex flex-col group-hover/wall:[animation-play-state:paused] motion-reduce:animate-none",
              [
                "animate-masonry-up",
                "animate-masonry-down",
                "animate-masonry-slow",
              ][c]
            )}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex flex-col gap-3 pb-3">
                {col.map((p) => card(p, copy))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
