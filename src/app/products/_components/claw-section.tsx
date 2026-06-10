"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import type { Product } from "../types"

export function ClawSection({ product }: { readonly product: Product }) {
  return (
    <MotionInView>
      <OutlineSection className="flex flex-col lg:flex-row">
        {/* Info panel */}
        <div className="flex w-full flex-col justify-center gap-4 p-8 lg:w-1/2 lg:p-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/RantAIClaw Dark.svg"
              alt="RantAI Claw logo"
              width={28}
              height={28}
              className="size-7 shrink-0 object-contain"
            />
            <h3 className="text-2xl font-medium tracking-tight lg:text-[32px]">
              {product.name}
            </h3>
          </div>
          <p className="text-base leading-relaxed font-light text-muted-foreground">
            {product.description}
          </p>

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

          {product.link && (
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 border border-border px-4 py-2.5 font-mono text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Visit RantAI Claw
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Visual panel */}
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="relative h-full w-full overflow-hidden bg-[#A83838]">
            {product.video ? (
              <video
                src={product.video}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/products/claw-screenshot.png"
                alt="RantAI Claw interface"
                width={1364}
                height={1106}
                className="absolute h-auto w-[150%]"
              />
            )}
          </div>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
