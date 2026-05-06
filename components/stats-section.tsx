"use client"

import { memo, useRef } from "react"
import { useInView } from "motion/react"
import CountUp from "@/components/CountUp"
import { Separator } from "@/components/ui/separator"

export const StatsSection = memo(function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex w-full justify-center bg-transparent px-4 py-2"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-12 md:flex-row md:gap-0">
        {/* Stat 1 */}
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 text-center md:w-75">
          <p className="text-5xl font-medium tracking-tight text-white md:text-[56px]">
            <CountUp to={3} duration={0.8} startWhen={isInView} />
          </p>
          <p className="font-mono text-base font-light text-muted-foreground">
            Enterprise AI Platforms
          </p>
        </div>

        {/* Divider */}
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator className="block max-w-32 md:hidden" />

        {/* Stat 2 */}
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 text-center md:w-75">
          <p className="text-5xl font-medium tracking-tight text-white md:text-[56px]">
            <CountUp to={100} duration={0.5} startWhen={isInView} />+
          </p>
          <p className="font-mono text-base font-light text-muted-foreground">
            LLM Models Supported
          </p>
        </div>

        {/* Divider */}
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator className="block max-w-32 md:hidden" />

        {/* Stat 3 */}
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 text-center md:w-75">
          <p className="text-5xl font-medium tracking-tight text-white md:text-[56px]">
            <CountUp to={10} duration={1.2} startWhen={isInView} />
          </p>
          <p className="font-mono text-base font-light text-muted-foreground">
            Published AI Books
          </p>
        </div>
      </div>
    </section>
  )
})
