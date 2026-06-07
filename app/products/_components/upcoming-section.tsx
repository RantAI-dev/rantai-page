"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { cn } from "@/lib/utils"
import type { Product } from "../types"

type Accent = {
  mockup: string
  badgeBg: string
  color: string
}

const accents: Record<string, Accent> = {
  analytics: { mockup: "#21366F", badgeBg: "#021038", color: "#0A67FF" },
  zerocode: { mockup: "#20986C", badgeBg: "#051912", color: "#20986C" },
}

function UpcomingCard({
  product,
  image,
  className,
}: {
  product: Product
  image: { src: string; width: number; height: number }
  className?: string
}) {
  const accent = accents[product.id]

  return (
    <div className={cn("flex w-full flex-col gap-4 sm:w-1/2", className)}>
      {/* Mockup — locked to 16/9 so both cards share the same height */}
      <div
        className="overflow-hidden p-6"
        style={{ backgroundColor: accent.mockup }}
      >
        <AspectRatio ratio={16 / 9}>
          <Image
            src={image.src}
            alt={`${product.name} interface`}
            fill
            className="object-cover object-top"
          />
        </AspectRatio>
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-medium tracking-tight lg:text-[32px]">
              {product.name}
            </h3>
            <span
              className="shrink-0 rounded border px-3 py-0.5 font-mono text-xs font-medium tracking-wider uppercase"
              style={{
                borderColor: accent.color,
                color: accent.color,
                backgroundColor: accent.badgeBg,
              }}
            >
              In Progress
            </span>
          </div>
          <p className="text-base leading-relaxed font-light text-muted-foreground">
            {product.value}
          </p>
        </div>

        {/* Notify link */}
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

export function UpcomingSection({
  analytics,
  zerocode,
}: {
  analytics: Product
  zerocode: Product
}) {
  return (
    <MotionInView>
      <OutlineSection className="flex flex-col sm:flex-row">
        <UpcomingCard
          product={analytics}
          image={{
            src: "/products/analytics-screenshot.png",
            width: 2365,
            height: 1240,
          }}
        />
        <UpcomingCard
          product={zerocode}
          image={{
            src: "/products/zerocode-screenshot.png",
            width: 954,
            height: 688,
          }}
          className="border-t border-border sm:border-t-0 sm:border-l"
        />
      </OutlineSection>
    </MotionInView>
  )
}
