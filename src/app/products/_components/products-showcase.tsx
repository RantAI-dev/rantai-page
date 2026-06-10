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
import { cn } from "@/lib/utils"
import type { Product, ProductFeatureIcon } from "../types"

const featureIcons: Record<ProductFeatureIcon, LucideIcon> = {
  rag: DatabaseZapIcon,
  "agent-builder": BotIcon,
  artifacts: ScrollIcon,
  skills: ZapIcon,
}

const productLogos: Record<string, string> = {
  agents: "/logo/RantAI Agents Dark.svg",
  claw: "/logo/RantAIClaw Dark.svg",
}

interface ProductsShowcaseProps {
  agents: Product
  claw: Product
}

export function ProductsShowcase({ agents, claw }: ProductsShowcaseProps) {
  const liveProducts = [agents, claw]
  const [activeProductId, setActiveProductId] = useState<string>(agents.id)
  const activeProduct = liveProducts.find((p) => p.id === activeProductId) ?? agents

  const features = activeProduct.features ?? []
  const [activeFeatureValue, setActiveFeatureValue] = useState(features[0]?.value ?? "")

  function handleProductSelect(productId: string) {
    setActiveProductId(productId)
    const product = liveProducts.find((p) => p.id === productId)
    const firstFeature = product?.features?.[0]?.value ?? ""
    setActiveFeatureValue(firstFeature)
  }

  const activeFeature = features.find((f) => f.value === activeFeatureValue)
  const activeCaption = activeFeature?.caption ?? activeProduct.value

  const ctaLabel =
    activeProduct.id === "agents" ? "Explore RantAI Agents" : "Visit RantAI Claw"

  return (
    <MotionInView>
      <OutlineSection className="flex flex-col">
        {/* Product selector cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {liveProducts.map((product) => {
            const isActive = product.id === activeProductId
            return (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={cn(
                  "group flex w-full items-start gap-4 p-6 text-left transition-colors lg:p-8",
                  isActive ? "bg-transparent" : "bg-muted/40 hover:bg-muted/60",
                )}
              >
                <Image
                  src={productLogos[product.id] ?? ""}
                  alt={`${product.name} logo`}
                  width={36}
                  height={36}
                  className="mt-0.5 size-9 shrink-0 object-contain"
                />
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <span className="text-base font-medium tracking-tight">
                    {product.name}
                  </span>
                  <span className="text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
                    {product.value}
                  </span>
                </div>
                <ArrowRightIcon
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isActive
                      ? "translate-x-0 text-foreground"
                      : "group-hover:translate-x-0.5",
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Content area */}
        <div className="flex flex-col gap-4 border-t border-border px-6 py-8 sm:px-12 lg:px-24">
          {features.length > 0 ? (
            /* Agents: tabbed features */
            <Tabs
              value={activeFeatureValue}
              onValueChange={setActiveFeatureValue}
              className="w-full gap-4"
            >
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
                        alt={`${activeProduct.name} — ${feature.label}`}
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
            </Tabs>
          ) : (
            /* Claw: single video */
            <AspectRatio
              ratio={16 / 9}
              className="overflow-hidden rounded-[8px] border-4 border-foreground bg-muted"
            >
              {activeProduct.video ? (
                <video
                  key={activeProduct.video}
                  src={activeProduct.video}
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
                  fill
                  className="object-cover"
                />
              )}
            </AspectRatio>
          )}

          {activeCaption && (
            <p className="text-center leading-relaxed font-light text-muted-foreground lg:text-xl">
              {activeCaption}
            </p>
          )}
        </div>

        {/* Bottom CTA */}
        {activeProduct.link && (
          <div className="mb-8 flex items-center justify-center p-4 lg:p-6">
            <Link
              href={activeProduct.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 border border-border px-6 py-3.5 font-mono text-sm tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              {ctaLabel}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </OutlineSection>
    </MotionInView>
  )
}
