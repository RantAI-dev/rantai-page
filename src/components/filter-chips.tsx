"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type FilterOption = {
  value: string
  label?: string
  count?: number
  /** Optional colour dot, matching the tags on the cards. */
  tone?: string
}

/**
 * Pill filters shared by the library pages. On phones they scroll sideways
 * in one row instead of stacking into a tall list.
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
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden",
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
            onClick={() => onChange(o.value)}
            className={cn(
              "relative isolate inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-200",
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
            {o.tone && (
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ background: o.tone }}
              />
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
