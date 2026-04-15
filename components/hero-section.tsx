"use client"

import Link from "next/link"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ColorBends from "@/components/ColorBends"
import ShinyText from "@/components/ShinyText"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}
const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}
const transition = { duration: 0.6, ease: "easeOut" as const }

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
          <Badge variant="outline" className="mb-4">
            <div className="size-2 rounded-full border border-accent-foreground" />
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
              className="font-mono text-sm tracking-wide text-muted-foreground"
            />
            <div className="size-2 rounded-full border border-accent-foreground" />
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
          className="mt-32 flex items-center justify-center gap-4"
          {...fadeInUp}
          transition={{ ...transition, delay: 0.48 }}
        >
          <Button className="h-11 px-8 font-mono" asChild>
            <Link href="/get-started">GET STARTED</Link>
          </Button>
          <Button className="h-11 px-8 font-mono" variant="outline" asChild>
            <Link href="/book-demo">BOOK A DEMO</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
