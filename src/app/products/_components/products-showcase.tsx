import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function ProductInfoPanel({
  logo,
  logoAlt,
  title,
  subtitle,
  className,
  children,
}: {
  logo: string
  logoAlt: string
  title: string
  subtitle: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex min-h-[520px] flex-col", className)}>
      <div className="flex items-center gap-4 p-8 lg:p-10">
        <Image
          src={logo}
          alt={logoAlt}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-[8px] object-contain"
        />
        <div className="min-w-0">
          <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
          <p className="mt-1 text-base font-light text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  )
}

export function ProductMediaPanel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-105 items-center justify-center overflow-hidden p-2 sm:p-4 lg:min-h-130",
        className,
      )}
    >
      <div className="relative aspect-video w-full max-w-3xl">{children}</div>
    </div>
  )
}

export function ProductLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-13 w-full items-center justify-center gap-2 border px-6 py-3 text-base font-normal transition-colors hover:bg-foreground hover:text-background"
    >
      {children}
      <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}
