import { cn } from "@/lib/utils"

export function Eyebrow({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 10 10"
        className="size-2.5 shrink-0 text-brand-1"
      >
        <path d="M0 0h10v10z" fill="currentColor" />
      </svg>
      {children}
    </p>
  )
}
