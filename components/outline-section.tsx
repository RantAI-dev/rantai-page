import { cn } from "@/lib/utils"

export function OutlineSection({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="grid w-full grid-cols-[1fr_min(100%,var(--container-7xl))_1fr]">
      <div className="shrink-0 border-t border-r border-b" />
      <div className={cn("relative block border", className)}>
        <span className="absolute -top-0.75 -left-0.75 hidden size-1.5 bg-foreground/50 md:block" />
        <span className="absolute -bottom-0.75 -left-0.75 hidden size-1.5 bg-foreground/50 md:block" />
        {children}
      </div>
      <div className="relative shrink-0 border-t border-b border-l">
        <span className="absolute -top-0.75 -left-0.75 hidden size-1.5 bg-foreground/50 md:block" />
        <span className="absolute -bottom-0.75 -left-0.75 hidden size-1.5 bg-foreground/50 md:block" />
      </div>
    </div>
  )
}
