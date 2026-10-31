"use client"

import { motion, useReducedMotion } from "motion/react"

import { Eyebrow } from "@/components/eyebrow"
import DotGrid from "@/components/react-bits/dot-grid"
import { SplitReveal } from "@/components/split-reveal"

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Each page has its own desk colour, like the product demos. The dots are
 * React Bits' Dot Grid: they part around the cursor and ripple on click.
 */
const desks = {
  blue: { bg: "#edf3fd", dot: "#bcd2f5", active: "#3b82f6" },
  peach: { bg: "#fbf0e8", dot: "#efc8ab", active: "#f97316" },
  violet: { bg: "#f2eefc", dot: "#d6cbf4", active: "#8b5cf6" },
  teal: { bg: "#e9f5f3", dot: "#b6dcd5", active: "#14b8a6" },
  sand: { bg: "#f4f3ee", dot: "#d9d6cb", active: "#57534e" },
  white: { bg: "#ffffff", dot: "#e7e5e0", active: "#a3a3a3" },
  rose: { bg: "#fcf0f1", dot: "#f1c6cc", active: "#e11d48" },
  // White at the top deepening to violet: no dots, it blends into the page.
  violetFade: {
    bg: "linear-gradient(to bottom, #ffffff 0%, #f4f0fd 45%, #e4dafa 100%)",
    dot: "",
    active: "",
  },
} as const
export type DeskTone = keyof typeof desks

/**
 * Hero for the inner pages. The copy sits on white; each page brings its own
 * visual (product screens, books, people) on a tinted desk, so the pages
 * feel related but distinct.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  visual,
  tone = "sand",
}: Readonly<{
  eyebrow: string
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
  visual?: React.ReactNode
  tone?: DeskTone
}>) {
  const reduce = Boolean(useReducedMotion())
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease, delay },
        }

  const copy = (
    <div>
      <motion.div {...rise(0)}>
        <Eyebrow className="text-muted-foreground">{eyebrow}</Eyebrow>
      </motion.div>
      <SplitReveal
        id="page-heading"
        as="h1"
        text={title}
        trigger="mount"
        delay={0.1}
        className="mt-5 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
      />
      {description && (
        <motion.p
          {...rise(0.45)}
          className="mt-6 max-w-[27rem] text-base leading-relaxed text-balance text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>
      )}
      {children && (
        <motion.div
          {...rise(0.6)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          {children}
        </motion.div>
      )}
    </div>
  )

  const desk = visual && (
    <motion.div
      {...rise(0.25)}
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]"
      style={{ background: desks[tone].bg }}
    >
      {/* A white desk blends into the page, so it goes without dots */}
      {desks[tone].dot && (
        <DotGrid
          dotSize={3}
          gap={20}
          baseColor={desks[tone].dot}
          activeColor={desks[tone].active}
          proximity={140}
          glow={0.3}
        />
      )}
      <div className="absolute inset-6 sm:inset-10">{visual}</div>
    </motion.div>
  )

  // Copy on white on the left, the visual on a tinted desk on the right.
  return (
    <section
      aria-labelledby="page-heading"
      className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pt-10 pb-6 sm:px-10 sm:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:px-14 lg:pt-16"
    >
      {copy}
      {desk}
    </section>
  )
}
