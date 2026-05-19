"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"

/* SVG grid pattern for CTA background */
function GridPattern() {
  const size = 32
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="grid-products"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-products)" />
    </svg>
  )
}

export function ProductsCta() {
  return (
    <MotionInView>
      <OutlineSection>
        <div className="relative flex items-center justify-center overflow-hidden px-6 py-24 lg:min-h-[500px] lg:py-0">
          {/* Grid pattern backdrop */}
          <GridPattern />

          <div className="relative z-10 flex max-w-[892px] flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl lg:text-[32px]">
                Start building with RantAI today.
              </h2>
              <p className="text-sm text-white/60 lg:text-base">
                Deploy your first AI product in under two weeks — no long
                procurement cycles required.
              </p>
            </div>
            <Link
              href="/#contact"
              className="group flex items-center justify-between border bg-foreground px-4 py-4 text-background transition-colors duration-300"
            >
              <span className="font-mono font-medium tracking-wider uppercase">
                Request a Demo
              </span>
              <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
