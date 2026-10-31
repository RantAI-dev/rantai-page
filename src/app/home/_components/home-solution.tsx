"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  FileType2,
  Lock,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useRef, useState } from "react"

import { Eyebrow } from "@/components/eyebrow"
import { cn } from "@/lib/utils"

type InlineKind = "files" | "data" | "agents" | "infra"
type CardKind = "answer" | "write" | "act"
type Token = {
  text: string
  inline?: InlineKind
  card?: CardKind
  mark?: boolean
  dwell?: number
}

const tokens: Token[] = [
  { text: "RantAI" },
  { text: "turns" },
  { text: "your" },
  { text: "documents,", inline: "files", dwell: 1 },
  { text: "policies," },
  { text: "and" },
  { text: "data", inline: "data" },
  { text: "into" },
  { text: "agents", inline: "agents", dwell: 1 },
  { text: "that" },
  { text: "answer,", card: "answer", dwell: 3 },
  { text: "write,", card: "write", dwell: 3 },
  { text: "and" },
  { text: "act,", card: "act", dwell: 3 },
  { text: "inside" },
  { text: "your", mark: true },
  { text: "own", mark: true },
  { text: "infrastructure.", inline: "infra", mark: true, dwell: 4 },
]

const SPAN = 0.9
const units = tokens.reduce((sum, token) => sum + 1 + (token.dwell ?? 0), 0)
const UNIT = SPAN / units

const timeline = (() => {
  let cursor = 0
  return tokens.map((token) => {
    const start = cursor * UNIT
    const lit = start + UNIT
    const holdEnd = lit + (token.dwell ?? 0) * UNIT
    cursor += 1 + (token.dwell ?? 0)
    return { start, lit, holdEnd }
  })
})()

const finaleIndex = tokens.length - 1
const FINALE = timeline[finaleIndex].lit

const sentence = tokens.map((token) => token.text).join(" ")

type TileSpec = {
  className: string
  icon?: LucideIcon
  logo?: string
  rotate: number
  iconClass?: string
}

const inlineTiles: Record<InlineKind, TileSpec[]> = {
  files: [
    { className: "bg-rose-500", icon: FileType2, rotate: -6 },
    { className: "bg-sky-500", icon: FileText, rotate: 3 },
    { className: "bg-emerald-500", icon: FileSpreadsheet, rotate: -2 },
  ],
  data: [
    {
      className: "bg-amber-400",
      icon: Database,
      rotate: 3,
      iconClass: "text-amber-950",
    },
  ],
  agents: [
    {
      // Light version of the logo on a white tile, with a hairline so it
      // still reads against the white page.
      className: "bg-white ring-1 ring-black/10",
      logo: "/logo/RantAI Agents Light.svg",
      rotate: -3,
    },
  ],
  infra: [
    { className: "bg-emerald-400", icon: Lock, rotate: -5 },
    { className: "bg-sky-400", icon: Server, rotate: 4 },
    { className: "bg-violet-400", icon: ShieldCheck, rotate: -2 },
  ],
}

const TILE = 0.92
const OVERLAP = 0.3
const GAP = 0.2

const links = [
  { label: "RantAI Agents", href: "#rantai-agents" },
  { label: "RantAIClaw", href: "#rantaiclaw" },
  { label: "Our engineers", href: "#how-we-work" },
] as const

const spring = { stiffness: 380, damping: 20 }

function Tile({
  spec,
  index,
  appearAt,
  progress,
  reduce,
}: Readonly<{
  spec: TileSpec
  index: number
  appearAt: number
  progress: MotionValue<number>
  reduce: boolean
}>) {
  const from = appearAt + UNIT * 0.25 + index * UNIT * 0.45
  const target = useTransform(progress, [from, from + UNIT * 0.35], [0, 1])
  const pop = useSpring(target, spring)
  const rotate = useTransform(pop, [0, 1], [spec.rotate - 30, spec.rotate])
  const Icon = spec.icon

  return (
    <motion.span
      className={cn(
        "relative inline-flex size-[0.92em] shrink-0 items-center justify-center rounded-[0.24em] shadow-[0_0.08em_0.2em_rgba(0,0,0,0.18)] ring-[0.04em] ring-white",
        index > 0 && "-ml-[0.3em]",
        spec.className
      )}
      style={
        reduce ? { rotate: spec.rotate } : { scale: pop, opacity: pop, rotate }
      }
    >
      {Icon && (
        <Icon
          className={cn("size-[0.5em]", spec.iconClass ?? "text-white")}
          strokeWidth={2}
        />
      )}
      {spec.logo && (
        <Image
          src={spec.logo}
          alt=""
          width={40}
          height={40}
          className="h-[0.5em] w-auto"
        />
      )}
    </motion.span>
  )
}

function InlineGroup({
  kind,
  appearAt,
  progress,
  reduce,
}: Readonly<{
  kind: InlineKind
  appearAt: number
  progress: MotionValue<number>
  reduce: boolean
}>) {
  const tiles = inlineTiles[kind]
  const fullWidth = GAP + TILE * tiles.length - OVERLAP * (tiles.length - 1)
  const growTarget = useTransform(
    progress,
    [appearAt - UNIT * 0.1, appearAt + UNIT * 0.25],
    [0, 1]
  )
  const grow = useSpring(growTarget, { stiffness: 260, damping: 30 })
  const width = useTransform(
    grow,
    (value) => `${Math.max(0, value) * fullWidth}em`
  )

  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex justify-end align-[-0.12em]"
      style={{ width: reduce ? `${fullWidth}em` : width }}
    >
      {tiles.map((spec, index) => (
        <Tile
          key={index}
          spec={spec}
          index={index}
          appearAt={appearAt}
          progress={progress}
          reduce={reduce}
        />
      ))}
    </motion.span>
  )
}

function CardContent({ kind }: Readonly<{ kind: CardKind }>) {
  if (kind === "answer") {
    return (
      <>
        <span className="ml-auto block w-fit rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-700">
          What changed in the leave policy?
        </span>
        <span className="mt-2 block text-xs leading-relaxed text-neutral-800">
          Three changes take effect in January. Annual leave rises to 14 days.
        </span>
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">
          <FileText className="size-3" /> Policy.pdf · p.3
        </span>
      </>
    )
  }
  if (kind === "write") {
    return (
      <>
        <span className="block text-xs font-medium text-neutral-900">
          Weekly operations report
        </span>
        <span className="mt-2 block space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-neutral-200" />
          <span className="block h-1.5 w-5/6 rounded-full bg-neutral-200" />
          <span className="block h-1.5 w-2/3 rounded-full bg-neutral-200" />
        </span>
        <span className="mt-3 flex h-10 items-end gap-1">
          {[40, 65, 50, 80, 70].map((height, index) => (
            <span
              key={index}
              className={cn(
                "flex-1 rounded-sm",
                index === 3 ? "bg-violet-500" : "bg-violet-200"
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </span>
      </>
    )
  }
  return (
    <span className="flex items-start gap-2.5">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
      <span className="block">
        <span className="block text-xs font-medium text-neutral-900">
          Ticket #482 resolved
        </span>
        <span className="mt-0.5 block text-[11px] text-neutral-500">
          Access request approved and logged
        </span>
      </span>
    </span>
  )
}

function Word({
  token,
  index,
  progress,
  reduce,
  cardOpen,
  onHover,
}: Readonly<{
  token: Token
  index: number
  progress: MotionValue<number>
  reduce: boolean
  cardOpen: boolean
  onHover: (index: number | null) => void
}>) {
  const { start, lit } = timeline[index]
  const opacity = useTransform(progress, [start, lit], [0.15, 1])
  const markOrder = token.mark
    ? tokens.slice(0, index).filter((item) => item.mark).length
    : 0
  const markFrom = FINALE + markOrder * UNIT * 0.4
  const markTarget = useTransform(
    progress,
    [markFrom, markFrom + UNIT * 0.5],
    [0, 1]
  )
  const mark = useSpring(markTarget, { stiffness: 200, damping: 30 })
  const markOpacity = useTransform(mark, [0, 0.04], [0, 1])
  const inlineAt = token.inline === "infra" ? FINALE + UNIT * 1.4 : lit

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative">
        {token.mark && (
          <motion.span
            aria-hidden="true"
            className={cn(
              "absolute top-[0.14em] bottom-[0.04em] -z-10 origin-left bg-sky-200/80",
              markOrder === 0 ? "-left-[0.08em] rounded-l-[0.14em]" : "left-0",
              token.inline === "infra"
                ? "-right-[0.08em] rounded-r-[0.14em]"
                : "-right-[0.3em]"
            )}
            style={reduce ? undefined : { scaleX: mark, opacity: markOpacity }}
          />
        )}
        <motion.span
          aria-hidden="true"
          style={{ opacity: reduce ? 1 : opacity }}
          className={cn(
            token.card &&
              "cursor-default underline decoration-dotted decoration-[0.06em] underline-offset-[0.14em] transition-colors",
            token.card &&
              (cardOpen ? "decoration-brand-1" : "decoration-neutral-300")
          )}
          {...(token.card
            ? {
                onPointerEnter: () => onHover(index),
                onPointerLeave: () => onHover(null),
                onClick: () => onHover(cardOpen ? null : index),
              }
            : {})}
        >
          {token.text}
        </motion.span>
      </span>
      {token.inline && (
        <InlineGroup
          kind={token.inline}
          appearAt={inlineAt}
          progress={progress}
          reduce={reduce}
        />
      )}
      <AnimatePresence>
        {cardOpen && token.card && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute top-full left-0 z-30 mt-3 block w-56 rounded-2xl border border-neutral-200 bg-white p-3.5 text-left text-base tracking-normal whitespace-normal shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] sm:left-1/2 sm:w-64 sm:-translate-x-1/2"
            initial={{ opacity: 0, y: 10, rotate: -5, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
            exit={{ opacity: 0, y: 6, rotate: 1, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <CardContent kind={token.card} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function HomeSolution() {
  const ref = useRef<HTMLElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [autoCard, setAutoCard] = useState<number | null>(null)
  const [hoverCard, setHoverCard] = useState<number | null>(null)
  const { scrollYProgress: scrollProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // A JS-driven copy keeps motion from mapping opacity onto a native ScrollTimeline,
  // which mis-measures this sticky section.
  const scrollYProgress = useMotionValue(0)

  useMotionValueEvent(scrollProgress, "change", (value) => {
    scrollYProgress.set(value)
    const active = tokens.findIndex(
      (token, index) =>
        token.card &&
        value >= timeline[index].lit &&
        value < timeline[index].holdEnd
    )
    setAutoCard(active === -1 ? null : active)
  })

  const linksOpacity = useTransform(scrollYProgress, [0.92, 0.98], [0, 1])
  const linksY = useTransform(scrollYProgress, [0.92, 0.98], [12, 0])
  const openCard = hoverCard ?? (reduce ? null : autoCard)

  return (
    <section
      ref={ref}
      aria-labelledby="solution-heading"
      className="relative h-[420svh]"
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-14">
          <Eyebrow className="text-neutral-500">How RantAI helps</Eyebrow>
          <h2
            id="solution-heading"
            aria-label={sentence}
            className="relative isolate mt-8 max-w-[24ch] text-[clamp(2.25rem,5.2vw,5rem)] leading-[1.12] font-medium tracking-[-0.04em] text-neutral-950"
          >
            {tokens.map((token, index) => (
              <span key={`${token.text}-${index}`}>
                <Word
                  token={token}
                  index={index}
                  progress={scrollYProgress}
                  reduce={reduce}
                  cardOpen={openCard === index}
                  onHover={setHoverCard}
                />
                {index < tokens.length - 1 && " "}
              </span>
            ))}
          </h2>
          <motion.ul
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3"
            style={reduce ? undefined : { opacity: linksOpacity, y: linksY }}
          >
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-base font-medium text-neutral-900"
                >
                  {link.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
