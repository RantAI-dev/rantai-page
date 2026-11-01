"use client"

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { ArrowRight, Check, Hash, Loader2, Sparkles } from "lucide-react"

import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"

// "Need more? Bring our engineers." Three services, each told by a small
// piece of UI that keeps playing while it is on screen. Cards tilt toward
// the cursor with a soft light under it, and hovering a card nudges its
// scene along. Content is illustrative.

const ease = [0.22, 1, 0.36, 1] as const

type SceneProps = { playing: boolean; hover: boolean }

/**
 * Steps 0..n-1 on a loop while `playing`; each entry in `ms` is how long
 * that step holds. Hover can ask to skip ahead.
 */
function useLoop(ms: number[], playing: boolean) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setStep((s) => (s + 1) % ms.length), ms[step])
    return () => clearTimeout(t)
  }, [step, playing, ms])
  return step
}

/* FDE: our engineers join the client's own channel and ship ---------- */
const fdeMs = [700, 700, 900, 1300, 2600]
function FdeVisual({ playing, hover }: Readonly<SceneProps>) {
  const t = useTranslations("products.overview.fde")
  const step = useLoop(fdeMs, playing)
  const joiners = [
    { initials: "RA", tone: "#3b82f6", name: "Raffy" },
    { initials: "MC", tone: "#8b5cf6", name: "Michael" },
  ]
  return (
    <div className="w-[82%] rounded-xl border border-black/[0.07] bg-white p-3.5 text-neutral-900 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-medium">
          <Hash className="size-3.5 text-neutral-400" /> finance-ops
        </p>
        {/* Avatars of everyone in the channel; ours spread out on hover */}
        <div className="flex">
          {[{ initials: "YT", tone: "#a3a3a3" }, ...joiners].map((p, i) => (
            <motion.span
              key={p.initials}
              className="grid size-5 place-items-center rounded-full border-2 border-white text-[7.5px] font-semibold text-white"
              style={{ background: p.tone }}
              animate={{
                marginLeft: i === 0 ? 0 : hover ? 3 : -6,
                opacity: i === 0 || step > i - 1 ? 1 : 0.25,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            >
              {p.initials}
            </motion.span>
          ))}
        </div>
      </div>
      <ul className="mt-3 min-h-[92px] space-y-2">
        <AnimatePresence initial={false}>
          {joiners.map(
            (j, i) =>
              step > i && (
                <motion.li
                  key={j.initials}
                  className="flex items-center gap-2 text-[12px]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <span
                    className="grid size-6 place-items-center rounded-full text-[9.5px] font-semibold text-white"
                    style={{ background: j.tone }}
                  >
                    {j.initials}
                  </span>
                  <span className="text-neutral-500">
                    {t.rich("joined", {
                      name: j.name,
                      b: (chunks) => (
                        <span className="font-medium text-neutral-900">
                          {chunks}
                        </span>
                      ),
                    })}
                  </span>
                </motion.li>
              )
          )}
          {step === 3 && (
            <motion.li
              key="typing"
              className="ml-8 flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-neutral-100 px-3 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="size-1.5 rounded-full bg-neutral-400"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: d * 0.12,
                  }}
                />
              ))}
            </motion.li>
          )}
          {step === 4 && (
            <motion.li
              key="live"
              className="ml-8 w-fit rounded-xl rounded-tl-sm bg-[#3b82f6]/10 px-3 py-1.5 text-[12px] text-[#1d4ed8]"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              {t("pilotLive")}
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  )
}

/* Software: code types itself, then a deploy runs and goes green ----- */
const code = [
  ["export", " async function handler() {"],
  ["  const", " data = await db.query()"],
  ["  return", " render(data)"],
]
const swMs = [1500, 1200, 2400]
function SoftwareVisual({ playing, hover }: Readonly<SceneProps>) {
  const t = useTranslations("products.overview.software")
  const step = useLoop(swMs, playing) // 0 typing, 1 deploying, 2 deployed
  const full = code.map((l) => l.join("")).join("\n")
  const [n, setN] = useState(full.length)
  useEffect(() => {
    if (!playing || step !== 0) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      setN(Math.min(full.length, Math.floor((now - start) / 18)))
      if (now - start < full.length * 18) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [step, playing, full.length])

  // Where each line starts in the typed-out text.
  const starts = code.map((_, i) =>
    code.slice(0, i).reduce((sum, l) => sum + l.join("").length + 1, 0)
  )
  return (
    <div className="w-[82%] overflow-hidden rounded-xl bg-[#0d0f12] text-white shadow-[0_18px_40px_-26px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        {["#f87171", "#fbbf24", "#34d399"].map((c) => (
          <span
            key={c}
            className="size-2 rounded-full transition-colors duration-300"
            style={{ background: hover ? c : "rgb(255 255 255 / 0.15)" }}
          />
        ))}
        <span className="ml-2 text-[10.5px] text-white/40">app/page.tsx</span>
      </div>
      <div className="h-[66px] space-y-1 p-3 [font-family:ui-monospace,monospace] text-[11px] whitespace-pre">
        {code.map((line, i) => {
          const len = line.join("").length
          const shown = Math.max(0, Math.min(len, n - starts[i]))
          const kw = line[0].slice(0, shown)
          const rest = line[1].slice(0, Math.max(0, shown - line[0].length))
          const caret = shown > 0 && shown < len
          return (
            <p key={i} className="text-white/70">
              <span className="text-[#c4b5fd]">{kw}</span>
              {rest}
              {caret && (
                <span className="ml-px inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-white/70" />
              )}
            </p>
          )
        })}
      </div>
      <div className="mx-3 mb-3 h-7">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="deploying"
              className="relative flex h-full items-center gap-2 overflow-hidden rounded-lg bg-white/[0.06] px-2.5 text-[11px] text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="size-3.5 animate-spin" /> {t("deploying")}
              <motion.span
                className="absolute inset-y-0 left-0 bg-[#10b981]/20"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="deployed"
              className="flex h-full items-center gap-2 rounded-lg bg-[#10b981]/15 px-2.5 text-[11px] text-[#6ee7b7]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              <Check className="size-3.5" strokeWidth={3} /> {t("deployed")}
              <span className="ml-auto text-white/40 tabular-nums">42s</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* AI: each training run climbs higher; hover runs it again ---------- */
const runs = [
  [38, 44, 49, 55, 61, 66, 72],
  [40, 49, 57, 66, 74, 83, 91],
]
const aiMs = [2600, 2600]
function AiVisual({ playing, hover }: Readonly<SceneProps>) {
  const t = useTranslations("products.overview.ai")
  const step = useLoop(aiMs, playing)
  const bars = runs[hover ? 1 : step]
  const top = bars[bars.length - 1]
  const [shown, setShown] = useState(top)
  useEffect(() => {
    const from = shown
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 700)
      setShown(Math.round(from + (top - from) * (1 - (1 - k) ** 3)))
      if (k < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from the last shown value
  }, [top])
  return (
    <div className="w-[82%] rounded-xl border border-black/[0.07] bg-white p-3.5 text-neutral-900 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-medium">
          <Sparkles className="size-3.5 text-[#8b5cf6]" /> {t("accuracy")}
        </span>
        <span className="text-[12px] font-medium text-[#7c3aed] tabular-nums">
          {shown}%
        </span>
      </div>
      <div className="relative mt-3 flex h-20 items-end gap-1.5">
        {/* Target line */}
        <span className="absolute inset-x-0 top-[9%] border-t border-dashed border-[#8b5cf6]/40" />
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm"
            animate={{
              height: `${h}%`,
              backgroundColor: i === bars.length - 1 ? "#8b5cf6" : "#ddd6fe",
            }}
            transition={{ duration: 0.6, ease, delay: i * 0.05 }}
          />
        ))}
      </div>
      <p className="mt-2 text-[10.5px] text-neutral-500">
        {top >= 90 ? t("reached") : t("training")}
      </p>
    </div>
  )
}

// Titles are service names and stay in English; the rest comes from messages.
const services = [
  {
    key: "fde",
    href: "/services#forward-deployed-engineering",
    tone: "#3b82f6",
    title: "Forward Deployed Engineering",
    Visual: FdeVisual,
    badge: true,
  },
  {
    key: "software",
    href: "/services#what-we-do",
    tone: "#10b981",
    title: "Software Engineering",
    Visual: SoftwareVisual,
    badge: false,
  },
  {
    key: "ai",
    href: "/services#what-we-do",
    tone: "#8b5cf6",
    title: "AI Engineering",
    Visual: AiVisual,
    badge: false,
  },
] as const

/** A card that tilts slightly toward the cursor. */
function ServiceCard({
  s,
  index,
}: Readonly<{ s: (typeof services)[number]; index: number }>) {
  const t = useTranslations(`products.overview.${s.key}`)
  const details = t.raw("details") as string[]
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const seen = useInView(ref, { amount: 0.4 })
  const [hover, setHover] = useState(false)
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    ry.set((x - 0.5) * 7)
    rx.set(-(y - 0.5) * 7)
  }
  const onLeave = () => {
    setHover(false)
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="[perspective:1200px]"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="h-full">
        <Link
          ref={ref}
          href={s.href}
          onPointerMove={onMove}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={onLeave}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-100 p-3"
        >
          <div
            className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-xl"
            style={{
              backgroundColor: `${s.tone}10`,
              backgroundImage: `radial-gradient(${s.tone}30 1.1px, transparent 1.3px)`,
              backgroundSize: "16px 16px",
            }}
          >
            <div aria-hidden="true" className="flex w-full justify-center">
              <s.Visual playing={seen && !reduce} hover={hover} />
            </div>
          </div>
          <div className="relative flex flex-1 flex-col px-3 pt-5 pb-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-medium tracking-[-0.02em] text-neutral-950">
                {s.title}
              </h3>
              {s.badge ? (
                <span
                  className="relative shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] text-neutral-900 uppercase"
                  style={{ background: `${s.tone}24` }}
                >
                  <span className="relative flex items-center gap-1.5">
                    <span
                      className="size-1.5 animate-pulse rounded-full"
                      style={{ background: s.tone }}
                    />
                    {t("badge")}
                  </span>
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 mb-6 text-[15px] text-neutral-600">
              {t("line")}
            </p>
            {/* Details as one quiet line, the arrow beside it */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
              <p className="truncate text-[13px] text-neutral-600">
                {details.join("  ·  ")}
              </p>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-neutral-500 transition-colors duration-200 group-hover:bg-neutral-950 group-hover:text-white">
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function ServicesOverview() {
  const t = useTranslations("products.overview")
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
      <SplitReveal
        id="services-heading"
        text={t("title")}
        className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
      />

      <div className="mt-14 grid gap-3 md:grid-cols-3">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} index={i} />
        ))}
      </div>
    </section>
  )
}
