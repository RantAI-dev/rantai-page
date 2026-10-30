import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

type PillLinkProps = Readonly<{
  href: string
  children: React.ReactNode
  variant?: "solid" | "outline"
  size?: "md" | "lg"
  icon?: "arrow" | "external" | "none"
  newTab?: boolean
  className?: string
}>

export function PillLink({
  href,
  children,
  variant = "solid",
  size = "md",
  icon = "arrow",
  newTab = false,
  className,
}: PillLinkProps) {
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight

  return (
    <Link
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1",
        size === "md" ? "h-11 px-5 text-sm" : "h-12 px-7 text-[15px]",
        variant === "solid"
          ? "bg-foreground text-background hover:bg-foreground/85"
          : "border border-foreground/25 text-foreground hover:border-foreground/70",
        className
      )}
    >
      {children}
      {icon !== "none" && (
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform motion-reduce:transition-none",
            icon === "external"
              ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              : "group-hover:translate-x-0.5"
          )}
        />
      )}
    </Link>
  )
}
