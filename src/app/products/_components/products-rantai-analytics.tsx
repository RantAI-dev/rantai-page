import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ProductsRantAIAnalytics({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-4 sm:w-1/2", className)}>
      <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-medium tracking-tight lg:text-[32px]">
              RantAI Analytics
            </h3>
            <Badge
              variant="outline"
              className="shrink-0 font-mono tracking-wider uppercase bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
              
            >
              In Progress
            </Badge>
          </div>
          <p className="text-base leading-relaxed font-light text-muted-foreground">
            Get answers from your data without writing SQL.
          </p>
        </div>

        <Link
          href="/#contact"
          className="group mt-auto flex items-center justify-between text-base font-light text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Notify me when available
          <ArrowUpRightIcon className="size-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  )
}
