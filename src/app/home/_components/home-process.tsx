"use client"

import Link from "next/link"
import { ArrowRight, Hammer, RefreshCw, Target, type LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { DarkPanel } from "@/components/dark-panel"
import { Eyebrow } from "@/components/eyebrow"
import { PillLink } from "@/components/pill-link"
import { SplitReveal } from "@/components/split-reveal"
import { siteConfig } from "@/lib/config"

const ease = [0.22, 1, 0.36, 1] as const

const steps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Target, title: "Define the use case", body: "Pick one workflow worth changing" },
  { icon: Hammer, title: "Build in your environment", body: "Our engineers work inside your infrastructure" },
  { icon: RefreshCw, title: "Run and improve", body: "Monitor, evaluate, and retrain in production" },
]

export function HomeProcess() {
  const reduce = Boolean(useReducedMotion())

  return (
    <DarkPanel id="how-we-work" aria-labelledby="process-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="max-w-3xl">
          <Eyebrow className="text-white/50">How we work</Eyebrow>
          <SplitReveal
            id="process-heading"
            text="We build it with you."
            className="mt-5 text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.98] font-medium tracking-[-0.045em]"
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PillLink href="/services#forward-deployed-engineering" size="lg">
              Forward Deployed Engineering
            </PillLink>
            <PillLink
              href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Forward Deployed Engineering")}`}
              size="lg"
              variant="outline"
              icon="external"
            >
              Talk to our team
            </PillLink>
          </div>
        </div>

        <ol className="mt-16 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.li
                key={step.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease, delay: index * 0.12 }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-6xl font-medium tracking-[-0.05em] text-white/15 tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Icon aria-hidden="true" className="size-5 text-brand-1" strokeWidth={1.75} />
                  </span>
                </div>
                <div className="mt-16">
                  <h3 className="text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 text-base text-white/60">{step.body}</p>
                </div>
              </motion.li>
            )
          })}
        </ol>

        <p className="mt-10 text-sm text-white/50">
          Also available as{" "}
          <Link href="/services" className="group inline-flex items-center gap-1 text-white/80 hover:text-white">
            software and AI engineering
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </p>
      </div>
    </DarkPanel>
  )
}
