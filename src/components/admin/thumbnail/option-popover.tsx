"use client"

import { useState } from "react"
import { ChevronDown, LayoutGrid, List, Search } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type OptionView = "grid" | "list"

interface OptionPopoverState {
  query: string
  view: OptionView
}

interface OptionPopoverProps {
  /** Section heading shown above the trigger. */
  label: string
  /** Small visual of the active option, rendered inside the trigger. */
  preview: React.ReactNode
  /** Text label of the active option. */
  value: string
  /** Placeholder for the search field. */
  searchPlaceholder?: string
  /** Action controls (e.g. upload / generate) pinned above the options. */
  actions?: React.ReactNode
  /** Grid/list of options, rendered with the current search + view state. */
  children: (state: OptionPopoverState) => React.ReactNode
  /** Controlled open state. Omit to let the popover manage its own. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Compact picker: the trigger shows only the active option, and the full set of
 * choices opens in a popover with search and a grid/list view toggle. Keeps the
 * sidebar short as option lists grow.
 */
export function OptionPopover({
  label,
  preview,
  value,
  searchPlaceholder = "Search…",
  actions,
  children,
  open,
  onOpenChange,
}: OptionPopoverProps) {
  const [query, setQuery] = useState("")
  const [view, setView] = useState<OptionView>("grid")

  function handleOpenChange(next: boolean) {
    if (!next) setQuery("")
    onOpenChange?.(next)
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{label}</p>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-left transition-colors hover:border-foreground/50">
            <span className="flex h-7 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-foreground/5">
              {preview}
            </span>
            <span className="flex-1 truncate text-xs font-medium">{value}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width)"
        >
          <div className="flex items-center gap-1.5">
            <InputGroup className="h-8 flex-1">
              <InputGroupAddon>
                <Search className="size-3.5 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
            <div className="flex shrink-0 items-center rounded-md border border-border p-0.5">
              <ViewButton
                active={view === "grid"}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-3.5" />
              </ViewButton>
              <ViewButton
                active={view === "list"}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List className="size-3.5" />
              </ViewButton>
            </div>
          </div>

          <div className="mt-2.5 max-h-72 overflow-y-auto">
            {children({ query: query.trim().toLowerCase(), view })}
          </div>

          {actions && (
            <>
              <Separator className="my-2.5" />
              {actions}
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ViewButton({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      className={cn(
        "flex size-6 items-center justify-center rounded transition-colors",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** A single option cell inside an OptionPopover, rendered for grid or list view. */
export function OptionTile({
  selected,
  onClick,
  preview,
  label,
  view,
}: {
  selected: boolean
  onClick: () => void
  preview: React.ReactNode
  label: string
  view: OptionView
}) {
  const base =
    "overflow-hidden border transition-colors " +
    (selected
      ? "border-foreground bg-accent text-foreground"
      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground")

  if (view === "list") {
    return (
      <button
        onClick={onClick}
        className={cn(base, "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5")}
      >
        <span className="flex h-6 w-10 shrink-0 items-center justify-center">
          {preview}
        </span>
        <span className="flex-1 truncate text-left text-xs">{label}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(base, "flex flex-col items-center gap-1.5 rounded-md px-2 py-2.5")}
    >
      <span className="flex h-6 w-full items-center justify-center">{preview}</span>
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  )
}
