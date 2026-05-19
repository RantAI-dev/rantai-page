"use client"

import Image from "next/image"
import { CheckIcon } from "lucide-react"

import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import type { Product } from "../types"

export function ClawSection({ product }: { product: Product }) {
  return (
    <MotionInView>
      <OutlineSection className="flex flex-col lg:flex-row">
        {/* Info panel */}
        <div className="flex w-1/2 flex-col justify-center gap-4 p-8 lg:p-12">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-medium tracking-tight lg:text-[32px]">
              {product.name}
            </h3>
            <p className="text-base leading-relaxed font-light text-muted-foreground">
              {product.description}
            </p>
          </div>

          <ul className="flex flex-col gap-1.5">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <CheckIcon className="size-5 shrink-0 text-foreground" />
                <span className="text-base font-light text-muted-foreground">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual panel */}
        <div className="flex w-1/2 items-center justify-center">
          <div className="relative h-full w-full overflow-hidden bg-[#A83838]">
            <Image
              src="/products/claw-screenshot.png"
              alt="RantAI Claw interface"
              width={1364}
              height={1106}
              className="absolute h-auto w-[150%]"
            />
          </div>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
