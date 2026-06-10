"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { BotIcon, HammerIcon, Maximize2Icon, RocketIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { OutlineSection } from "@/components/outline-section"
import { cn } from "@/lib/utils"

const actionBadges = [
  {
    label: "Build",
    icon: HammerIcon,
    className: "bg-emerald-950 text-emerald-300",
  },
  {
    label: "Deploy",
    icon: RocketIcon,
    className: "bg-sky-950 text-sky-300",
  },
  {
    label: "Scale",
    icon: Maximize2Icon,
    className: "bg-red-950 text-red-200",
  },
]

function AnimatedActionBadge() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeBadge = actionBadges[activeIndex]
  const Icon = activeBadge.icon

  useEffect(() => {
    const interval = globalThis.setInterval(() => {
      setActiveIndex((current) => (current + 1) % actionBadges.length)
    }, 3000)

    return () => globalThis.clearInterval(interval)
  }, [])

  return (
    <span className="inline-grid place-items-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={activeBadge.label}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <Badge
            className={cn(
              "h-10 rounded-full pl-4! pr-5 text-2xl font-normal [&>svg]:size-6!",
              activeBadge.className,
            )}
          >
            <Icon data-icon="inline-start" className="shrink-0" />
            {activeBadge.label}
          </Badge>
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function ProductIntro() {
  return (
    <OutlineSection className="p-16 flex flex-col items-center gap-4 text-3xl leading-tight tracking-tight sm:text-4xl">
      <div className="flex items-center gap-3">
        Explore our agents <BotIcon className="size-10" />
      </div>
      <div className="flex items-center gap-3">
        <span>to help organizations</span>
        <AnimatedActionBadge />
        <span>applications.</span>
      </div>
    </OutlineSection>
  )
}
