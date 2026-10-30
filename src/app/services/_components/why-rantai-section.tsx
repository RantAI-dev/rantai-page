"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"
import { cn } from "@/lib/utils"
import type { WhyItem } from "../types"
import { whyRantAIIllustrations } from "./why-rantai-illustrations"

export function WhyRantAISection({ items }: { items: WhyItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = items[selectedIdx]
  const SelectedIllustration = whyRantAIIllustrations[selectedIdx]

  return (
    <section
      aria-labelledby="why-heading"
      className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
    >
      <MotionInView className="border-t border-border pt-16 lg:pt-24">
        <Eyebrow className="text-muted-foreground">Why RantAI</Eyebrow>
        <h2
          id="why-heading"
          className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em]"
        >
          What you get with us.
        </h2>
      </MotionInView>

      <MotionInView className="mt-14 grid gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ul className="flex flex-col gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon
            const isActive = idx === selectedIdx
            return (
              <li key={item.title}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedIdx(idx)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1",
                    isActive ? "bg-muted" : "hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      item.iconBg,
                      "flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "text-lg tracking-[-0.01em] transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col overflow-hidden rounded-2xl bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx + "-header"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-7 sm:p-9"
            >
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                {selected.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                {selected.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative mx-3 mb-3 flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-background p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx + "-illustration"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex h-full max-h-[340px] w-full max-w-2xl items-center justify-center"
              >
                <SelectedIllustration />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </MotionInView>
    </section>
  )
}
