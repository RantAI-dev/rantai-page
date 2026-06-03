"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BotIcon,
  DatabaseZapIcon,
  ScrollIcon,
  ZapIcon,
  ArrowRightIcon,
  type LucideIcon,
} from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import type { Product, ProductFeatureIcon } from "../types"

const featureIcons: Record<ProductFeatureIcon, LucideIcon> = {
  rag: DatabaseZapIcon,
  "agent-builder": BotIcon,
  artifacts: ScrollIcon,
  skills: ZapIcon,
}

export function AgentsSection({ product }: { product: Product }) {
  const features = product.features ?? []
  const [activeValue, setActiveValue] = useState(features[0]?.value ?? "")
  const activeCaption = features.find((f) => f.value === activeValue)?.caption

  return (
    <MotionInView>
      <OutlineSection className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-3 p-8 pb-0 lg:p-12 lg:pb-0">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/RantAI Agents Dark.svg"
              alt="RantAI Agents logo"
              width={28}
              height={28}
              className="size-7 shrink-0 object-contain"
            />
            <h3 className="text-2xl font-medium tracking-tight lg:text-[32px]">
              {product.name}
            </h3>
          </div>
          <p className="max-w-2xl text-base leading-relaxed font-light text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Screenshot + tab switcher */}
        {features.length > 0 && (
          <div className="flex flex-col gap-4 px-6 py-8 sm:px-12 lg:px-32">
            <Tabs
              value={activeValue}
              onValueChange={setActiveValue}
              className="w-full gap-4"
            >
              {features.map((feature) => (
                <TabsContent key={feature.value} value={feature.value}>
                  <AspectRatio
                    ratio={16 / 9}
                    className="overflow-hidden rounded-[8px] border-4 border-foreground bg-muted"
                  >
                    {feature.video ? (
                      <video
                        key={feature.video}
                        src={feature.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : feature.image ? (
                      <Image
                        src={feature.image}
                        alt={`${product.name} — ${feature.label}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
                          {feature.label} preview
                        </span>
                      </div>
                    )}
                  </AspectRatio>
                </TabsContent>
              ))}

              <TabsList className="w-full">
                {features.map((feature) => {
                  const Icon = featureIcons[feature.icon]
                  return (
                    <TabsTrigger key={feature.value} value={feature.value}>
                      <Icon className="size-4" />
                      {feature.label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            {activeCaption && (
              <p className="text-center leading-relaxed font-light text-muted-foreground lg:text-2xl">
                {activeCaption}
              </p>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        {product.link && (
          <div className="mb-8 flex items-center justify-center p-8 lg:p-10">
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm tracking-wider text-muted-foreground uppercase underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Explore RantAI Agents
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </OutlineSection>
    </MotionInView>
  )
}
