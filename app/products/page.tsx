"use client"

import Link from "next/link"
import { ArrowRightIcon, CheckIcon, PlayIcon } from "lucide-react"
import { motion } from "motion/react"

import { Navbar } from "@/components/navbar"
import { MotionInView } from "@/components/motion-in-view"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import ShinyText from "@/components/ShinyText"
import { fadeInUp, fadeInLeft, defaultTransition as transition } from "@/lib/motion-variants"
import { agentsProduct, comingSoonProducts, differentiators } from "./data"

export default function ProductsPage() {
  const AgentIcon = agentsProduct.icon

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <motion.div
              {...fadeInLeft}
              transition={{ ...transition, delay: 0.8 }}
            >
              <Badge variant="outline" className="mb-4 uppercase">
                <ShinyText
                  text="RantAI Platform"
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
              </Badge>
            </motion.div>
            <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              <motion.span
                className="block"
                {...fadeInUp}
                transition={{ ...transition, delay: 0.12 }}
              >
                Build production-ready AI systems in days.
              </motion.span>
            </h1>
            <motion.p
              className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground"
              {...fadeInUp}
              transition={{ ...transition, delay: 0.36 }}
            >
              RantAI Agents is live and ready to deploy — with Analytics and
              ZeroCode coming next.
            </motion.p>
            <motion.div
              className="mt-10 flex items-center gap-4"
              {...fadeInUp}
              transition={{ ...transition, delay: 0.48 }}
            >
              <Button className="group h-11 px-8 font-mono uppercase" asChild>
                <Link href="/#contact">
                  Get Started
                  <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant={"outline"}
                className="group h-11 px-8 font-mono uppercase"
                asChild
              >
                <Link href="/#contact">Request Demo</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Featured: RantAI Agents ───────────────────────────────── */}
        <section className="border-b border-border px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Agents — featured full-width card */}
            <MotionInView transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="rounded-2xl border border-border bg-muted/10 p-6 lg:p-10">
                {/* Header row */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AgentIcon className="size-4 text-primary" />
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {agentsProduct.tagline}
                    </span>
                  </div>
                </div>

                {/* Name + value */}
                <h3 className="text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">
                  {agentsProduct.name}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {agentsProduct.value}
                </p>

                {/* Video placeholder */}
                <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/20">
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="flex size-14 items-center justify-center rounded-full border border-border bg-background">
                      <PlayIcon className="size-6 translate-x-0.5" />
                    </div>
                    <p className="font-mono text-xs tracking-wider uppercase">
                      Demo video coming soon
                    </p>
                  </div>
                </div>

                {/* Benefits grid */}
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {agentsProduct.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Tech badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {agentsProduct.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-border bg-muted/40 px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-8 flex items-center gap-4">
                  <Button
                    className="group h-10 px-6 font-mono uppercase"
                    asChild
                  >
                    <Link href="/#contact">
                      Get Started
                      <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>
            </MotionInView>

            {/* Analytics + ZeroCode — dimmed 2-col grid */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {comingSoonProducts.map((product, idx) => {
                const Icon = product.icon
                return (
                  <MotionInView
                    key={product.id}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl border border-border p-6">
                      {/* Dimmed overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-background/60" />

                      <div className="relative opacity-50">
                        {/* Status badge */}
                        <div className="mb-4 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                            {product.statusLabel}
                          </span>
                          <Icon className="size-4 text-muted-foreground" />
                          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                            {product.tagline}
                          </span>
                        </div>

                        <h3 className="text-lg font-medium text-foreground">
                          {product.name}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {product.value}
                        </p>

                        <ul className="mt-4 flex flex-col gap-2">
                          {product.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <CheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                              {benefit}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.tech.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-border bg-muted/40 px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Notify link — outside the dimmed area so it's interactive */}
                      <div className="relative mt-5">
                        <Link
                          href="/#contact"
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                        >
                          Notify me when available
                          <ArrowRightIcon className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </MotionInView>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Differentiation ───────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Why RantAI
              </p>
              <h2 className="mb-12 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Built to run in production.
              </h2>
            </MotionInView>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {differentiators.map((item, idx) => {
                const Icon = item.icon
                return (
                  <MotionInView
                    key={item.title}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex h-full flex-col gap-4 bg-background p-6">
                      <Icon className="size-5 text-primary" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </MotionInView>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="flex flex-col items-center gap-5 text-center">
                <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Start with RantAI Agents today.
                </h2>
                <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                  Deploy your first AI agent in under two weeks.
                </p>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Request a Demo
                    <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </MotionInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
