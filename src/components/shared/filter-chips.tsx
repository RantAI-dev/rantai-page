"use client"

import { motion, useReducedMotion } from "motion/react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type FilterOption = {
  value: string
  label?: string
  count?: number
  /** Optional colour dot, matching the tags on the cards. */
  tone?: string
  /** Optional icon, shown in place of the dot (tinted with `tone`). */
  icon?: LucideIcon
}

/**
 * Pill filters shared by the library pages. On phones they scroll sideways
 * in one row instead of stacking into a tall list: chips snap to the edge
 * padding, the row fades out on the right to show there is more, and a
 * tapped chip scrolls fully into view.
 */
export function FilterChips({
  options,
  value,
  onChange,
  label,
  className,
}: Readonly<{
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  label: string
  className?: string
}>) {
  const reduce = useReducedMotion()
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={(e) => {
              onChange(o.value)
              e.currentTarget.scrollIntoView({
                behavior: reduce ? "auto" : "smooth",
                block: "nearest",
                inline: "nearest",
              })
            }}
            className={cn(
              "relative isolate inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-200",
              active
                ? "border-transparent text-background"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={`${label}-chip`}
                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {o.icon ? (
              <o.icon
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
                style={{ color: active ? undefined : o.tone }}
              />
            ) : (
              o.tone && (
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ background: o.tone }}
                />
              )
            )}
            {o.label ?? o.value}
            {o.count !== undefined && (
              <span
                className={cn(
                  "text-xs tabular-nums",
                  active ? "text-background/60" : "text-muted-foreground/70"
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
