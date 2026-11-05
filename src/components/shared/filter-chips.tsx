"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, ChevronDown, type LucideIcon } from "lucide-react"

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
 * Pill filters shared by the library pages (Academy, Insights, Team). On
 * phones they become one field that opens a menu.
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
    <>
      {/* Phones: one field that opens a menu, instead of a row of pills */}
      <FilterMenu
        options={options}
        value={value}
        onChange={onChange}
        label={label}
        className={cn("sm:hidden", className)}
      />
      <div
        role="group"
        aria-label={label}
        className={cn("flex gap-2 max-sm:hidden sm:flex-wrap", className)}
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
    </>
  )
}

/** An option's mark: its icon, else its colour dot. */
function Mark({
  o,
  size = "md",
}: Readonly<{ o: FilterOption; size?: "md" | "lg" }>) {
  if (o.icon)
    return (
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center rounded-lg",
          size === "lg" ? "size-8" : "size-7"
        )}
        style={{
          background: o.tone ? `${o.tone}14` : "#f5f5f5",
          color: o.tone,
        }}
      >
        <o.icon className="size-4" strokeWidth={2} />
      </span>
    )
  if (o.tone)
    return (
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center rounded-lg",
          size === "lg" ? "size-8" : "size-7"
        )}
        style={{ background: `${o.tone}14` }}
      >
        <span className="size-2 rounded-full" style={{ background: o.tone }} />
      </span>
    )
  return null
}

/** Phones: the current choice in a field; tapping it opens a small menu. */
function FilterMenu({
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
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const id = useId()
  const current = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("pointerdown", away)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("pointerdown", away)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center gap-3 rounded-full border border-border bg-background pr-4 pl-2 text-left text-[15px] text-foreground transition-colors focus-visible:border-foreground/40 focus-visible:outline-none"
      >
        {current && <Mark o={current} />}
        <span
          className={cn(
            "flex-1 truncate",
            !current?.icon && !current?.tone && "pl-3"
          )}
        >
          {current?.label ?? current?.value}
        </span>
        {current?.count !== undefined && (
          <span className="text-[13px] text-muted-foreground tabular-nums">
            {current.count}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 origin-top rounded-2xl bg-background p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]"
          >
            {options.map((o) => {
              const on = o.value === value
              return (
                <li key={o.value} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-[15px] transition-colors",
                      on
                        ? "bg-muted text-foreground"
                        : "text-foreground/80 active:bg-muted"
                    )}
                  >
                    <Mark o={o} />
                    <span
                      className={cn(
                        "flex-1 truncate",
                        !o.icon && !o.tone && "pl-2"
                      )}
                    >
                      {o.label ?? o.value}
                    </span>
                    {o.count !== undefined && (
                      <span className="text-[13px] text-muted-foreground tabular-nums">
                        {o.count}
                      </span>
                    )}
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "size-4 text-foreground",
                        on ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
