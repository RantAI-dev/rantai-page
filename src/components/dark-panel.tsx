import { cn } from "@/lib/utils"

type DarkPanelProps = Readonly<{
  children: React.ReactNode
  className?: string
  innerClassName?: string
}> &
  Omit<React.ComponentProps<"section">, "children">

export function DarkPanel({
  children,
  className,
  innerClassName,
  ...rest
}: DarkPanelProps) {
  return (
    <section className={cn("px-3 sm:px-4", className)} {...rest}>
      <div
        className={cn(
          "dark overflow-hidden rounded-[28px] bg-black text-white",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
