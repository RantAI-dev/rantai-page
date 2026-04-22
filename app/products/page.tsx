"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BotIcon,
  BarChart3Icon,
  CodeIcon,
  CheckIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  ServerIcon,
  UsersIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Navbar } from "@/components/navbar"
import { MotionInView } from "@/components/motion-in-view"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/footer"
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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const products = [
  {
    id: "agents",
    icon: BotIcon,
    name: "RantAI Agents",
    tagline: "AI Agent Platform",
    value: "Deploy AI agents that handle real work, not just demos.",
    benefits: [
      "Cut support ticket volume with autonomous resolution",
      "Deploy across web, app, and platform from one configuration",
      "Stay in control with human-in-the-loop escalation",
    ],
    tech: ["RAG", "Multi-agent", "Human-in-the-loop"],
  },
  {
    id: "analytics",
    icon: BarChart3Icon,
    name: "RantAI Analytics",
    tagline: "Analytics Platform",
    value: "Get answers from your data without writing SQL.",
    benefits: [
      "Any team member can query production databases in plain English",
      "Consistent metrics across teams via a shared semantic layer",
      "Connect to 40+ data sources in minutes",
    ],
    tech: ["NL→SQL", "Semantic layer", "100+ LLMs"],
  },
  {
    id: "zerocode",
    icon: CodeIcon,
    name: "RantAI ZeroCode",
    tagline: "Autonomous Coding Platform",
    value:
      "Ship production software faster with AI that writes and manages code.",
    benefits: [
      "AI handles the full SDLC from requirements to deployment",
      "Transparent step-by-step code generation you can audit",
      "Powered by Claude, OpenCode, and leading models",
    ],
    tech: ["Autonomous agents", "Multi-model", "Full SDLC"],
  },
]

const differentiators = [
  {
    icon: ServerIcon,
    title: "Production-grade reliability",
    description:
      "Built for enterprise uptime. Every platform is designed for real deployments, not prototypes.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Human control at every layer",
    description:
      "Overrides, audit logs, and escalation paths are built in — not bolted on.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Model-agnostic",
    description:
      "Swap LLMs without rewriting your stack. Switch between OpenAI, Claude, or local models effortlessly.",
  },
  {
    icon: UsersIcon,
    title: "Scales with your team",
    description:
      "From a single agent to enterprise multi-tenant deployment, the architecture grows with you.",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
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
              Three AI platforms — agents, analytics, and autonomous code —
              built for engineering teams that ship.
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
                <Link href="/#contact">View Demo</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Products Grid ─────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Our Platforms
              </p>
              <h2 className="mb-12 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Three tools, one platform.
              </h2>
            </MotionInView>

            <div className="flex flex-col">
              {products.map((product, idx) => {
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
                    <div className="group cursor-pointer rounded-xl border-b bg-transparent transition-colors hover:border-foreground/20 hover:bg-muted/20">
                      <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
                        {/* Left: product info */}
                        <div className="flex flex-col gap-5">
                          {/* Icon + tagline */}
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0 text-primary" />
                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                              {product.tagline}
                            </span>
                          </div>

                          {/* Name + value */}
                          <div>
                            <h3 className="text-xl font-medium text-foreground sm:text-2xl">
                              {product.name}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {product.value}
                            </p>
                          </div>

                          {/* Benefits */}
                          <ul className="flex flex-col gap-2.5">
                            {product.benefits.map((benefit) => (
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
                          <div className="flex flex-wrap gap-2">
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

                        {/* Right: CTAs */}
                        <div className="flex flex-row items-start gap-3 lg:flex-col lg:items-end lg:justify-start lg:pt-1">
                          <Button size="sm" asChild>
                            <Link href="/#contact">
                              Get Started
                              <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
                  Deploy faster with AI systems that actually work.
                </h2>
                <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                  Talk to the team and get your first product live in under two
                  weeks.
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
