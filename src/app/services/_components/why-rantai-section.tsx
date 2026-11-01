"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { cn } from "@/lib/utils"
import type { WhyItem } from "../types"
import { whyRantAIVisuals } from "./why-rantai-visuals"

const ease = [0.22, 1, 0.36, 1] as const

// Tile sizes for the bento: two wide tiles, four regular ones.
const spans = ["lg:col-span-2", "", "", "", "", "lg:col-span-2"]

/**
 * Why RantAI as a bento: every point shows its own small piece of product
 * at once, with just its title. No tabs to click through.
 */
export function WhyRantAISection({
  items,
  eyebrow = "Why RantAI",
}: Readonly<{ items: WhyItem[]; eyebrow?: string }>) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)
  return (
    <section
      id="why-rantai"
      aria-labelledby="why-heading"
      className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
    >
      <Eyebrow className="text-muted-foreground">{eyebrow}</Eyebrow>
      <SplitReveal
        id="why-heading"
        text={"What you\nget with us."}
        className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
      />

      <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Visual = whyRantAIVisuals[i]
          const tone = /#[0-9a-f]{6}/i.exec(item.iconBg)?.[0] ?? "#517fbb"
          return (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              className={cn(
                "flex flex-col rounded-2xl bg-neutral-100 p-3",
                spans[i]
              )}
            >
              <div
                className="flex h-[260px] items-center justify-center overflow-hidden rounded-xl p-5"
                style={{
                  backgroundColor: `${tone}10`,
                  backgroundImage: `radial-gradient(${tone}2e 1.1px, transparent 1.3px)`,
                  backgroundSize: "16px 16px",
                }}
              >
                {Visual && <Visual hover={hover === i} />}
              </div>
              <div className="flex items-center gap-3 px-3 pt-4 pb-2">
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-white"
                  style={{ background: tone }}
                >
                  <item.icon className="size-3.5" />
                </span>
                <h3 className="text-[17px] font-medium tracking-[-0.015em] text-neutral-950">
                  {item.title}
                </h3>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
