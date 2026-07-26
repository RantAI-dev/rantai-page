"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ShinyText from "@/components/ShinyText"
import { fadeInUp, fadeInLeft, defaultTransition as transition } from "@/lib/motion-variants"

const ColorBends = dynamic(() => import("@/components/ColorBends"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
})

export function HeroSection() {
  return (
    <section className="relative h-dvh px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
      {/* Background — ColorBends canvas */}
      <div className="absolute inset-0 z-0 h-[150%] w-full opacity-50">
        <ColorBends
          colors={["#055794", "#5EB6FA"]}
          rotation={-40}
          speed={0.56}
          scale={1}
          frequency={1}
          warpStrength={1}
          noise={1}
          transparent
          autoRotate={0}
        />
        {/* Gradient fade to black at the bottom for a smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center">
        <motion.div {...fadeInLeft} transition={{ ...transition, delay: 0.8 }}>
          <Badge
            variant="outline"
            className="mb-4 max-w-full gap-1 px-2 sm:gap-2 sm:px-2.5"
          >
            <div className="size-1.5 shrink-0 rounded-full border border-accent-foreground sm:size-2" />
            <ShinyText
              text="INDONESIA'S ENTERPRISE AI COMPANY"
              speed={3}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground sm:text-sm sm:tracking-wide"
            />
            <div className="size-1.5 shrink-0 rounded-full border border-accent-foreground sm:size-2" />
          </Badge>
        </motion.div>

        <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1]">
          <motion.span
            className="block"
            {...fadeInUp}
            transition={{ ...transition, delay: 0.12 }}
          >
            The AI Platform
          </motion.span>
          <motion.span
            className="block"
            {...fadeInUp}
            transition={{ ...transition, delay: 0.24 }}
          >
            Built for Production
          </motion.span>
        </h1>
        <motion.p
          className="mt-6 max-w-3xl font-mono leading-relaxed text-muted-foreground sm:text-lg"
          {...fadeInUp}
          transition={{ ...transition, delay: 0.36 }}
        >
          Builds enterprise-grade agentic AI, intelligent analytics, and
          zero-code automation — deployed in real government and enterprise
          environments.
        </motion.p>
        <motion.div
          className="mt-8 flex w-full flex-col items-stretch gap-3 min-[360px]:mt-32 min-[360px]:w-auto min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-center min-[360px]:gap-4"
          {...fadeInUp}
          transition={{ ...transition, delay: 0.48 }}
        >
          <Button className="h-11 w-full px-6 font-mono min-[360px]:w-auto min-[360px]:px-8" asChild>
            <Link href="/products">GET STARTED</Link>
          </Button>
          <Button
            className="h-11 w-full px-6 font-mono min-[360px]:w-auto min-[360px]:px-8"
            variant="outline"
            asChild
          >
            <Link href="#contact">BOOK A DEMO</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
