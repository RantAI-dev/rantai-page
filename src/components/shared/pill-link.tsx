import { Link } from "@/i18n/navigation"
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
          : // Hover: the edge stays soft; the pill fills with a faint glass
            // tint and a thin highlight along its top edge.
            "border border-foreground/20 text-foreground transition-[background-color,border-color,box-shadow] duration-300 hover:border-foreground/30 hover:bg-foreground/[0.07] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]",
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
