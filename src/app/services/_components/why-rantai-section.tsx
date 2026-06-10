"use client"

import { useState } from "react"
import { ChevronRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { OutlineSection } from "@/components/outline-section"
import { MotionInView } from "@/components/motion-in-view"
import type { WhyItem } from "../types"
import { whyRantAIIllustrations } from "./why-rantai-illustrations"

export function WhyRantAISection({ items }: { items: WhyItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = items[selectedIdx]
  const SelectedIcon = selected.icon
  const SelectedIllustration = whyRantAIIllustrations[selectedIdx]

  return (
    <MotionInView>
      <OutlineSection className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Left column — title + list */}
        <div className="flex flex-col border-r">
          <div className="border-b p-8 py-16">
            <h3 className="text-2xl font-normal lg:text-4xl">
              WHY
              <br />
              RANTAI
            </h3>
          </div>
          <div className="flex flex-col">
            {items.map((item, idx) => {
              const Icon = item.icon
              const isActive = idx === selectedIdx
              return (
                <button
                  key={item.title}
                  onClick={() => setSelectedIdx(idx)}
                  className={`group flex items-center justify-between gap-3 border-b px-6 py-4 transition-colors ${
                    isActive ? "bg-foreground/5" : "hover:bg-foreground/3"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${item.iconBg} flex size-7 items-center justify-center rounded-md`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span
                      className={`text-base ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <ChevronRightIcon
                    className={`size-4 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Right column — preview */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx + "-header"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 border-b p-8 py-16"
            >
              <div
                className={`${selected.iconBg} flex size-8 shrink-0 items-center justify-center rounded-md`}
              >
                <SelectedIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xl font-normal text-foreground lg:text-2xl">
                  {selected.title}
                </h4>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  {selected.body}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8 lg:max-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx + "-illustration"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex h-full max-h-100 w-full max-w-2xl items-center justify-center"
              >
                <SelectedIllustration />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
