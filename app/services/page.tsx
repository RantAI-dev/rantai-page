"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CodeIcon,
  RefreshCwIcon,
  ShieldIcon,
  BrainCircuitIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Navbar } from "@/components/navbar"
import { MotionInView } from "@/components/motion-in-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const services = [
  {
    id: "modernization",
    icon: RefreshCwIcon,
    name: "Legacy App Modernization",
    outcome: "Eliminate technical debt without rewriting from scratch",
    benefits: [
      "Cut maintenance costs by removing brittle, hard-to-change legacy code",
      "Production-ready Rust rewrites in weeks, not months",
      "Zero-downtime migration with AI-guided codebase analysis",
    ],
    proof:
      "We analyze your existing code first — no guesswork, no scope creep.",
    cta: "Audit My Codebase",
  },
  {
    id: "fullstack",
    icon: CodeIcon,
    name: "Full Stack Software Development",
    outcome: "Go from idea to production without the usual overhead",
    benefits: [
      "Design-to-deployment in one team — no handoffs, no delays",
      "Rust-backed backends that handle traffic spikes without new infrastructure",
      "AI-assisted development that ships features significantly faster",
    ],
    proof: "One team owns the full stack. You get velocity, not meetings.",
    cta: "Start Building",
  },
  {
    id: "security",
    icon: ShieldIcon,
    name: "Software Security & Performance",
    outcome: "Find the vulnerabilities slowing you down — before attackers do",
    benefits: [
      "Binary-level analysis catches issues that static tools miss",
      "Performance bottlenecks identified and patched in days",
      "Rust rewrites that cut latency measurably under real load",
    ],
    proof:
      "We work on source code or compiled binaries — no source access required.",
    cta: "Run a Security Audit",
  },
  {
    id: "mlops",
    icon: BrainCircuitIcon,
    name: "ML Engineering & Operations",
    outcome: "Put your ML models in production — and keep them there",
    benefits: [
      "GPU/TPU-optimized inference that reduces serving costs",
      "End-to-end pipeline: training, evaluation, and live deployment",
      "Multi-cloud setup — never locked into a single vendor",
    ],
    proof:
      "We handle the infrastructure so your team stays focused on the model.",
    cta: "Talk to an ML Engineer",
  },
]

const differentiators = [
  {
    number: "01",
    title: "Rust-first performance",
    body: "We build in Rust where it matters — lower latency, fewer runtime errors, smaller attack surface. Not as a trend, but because your production systems demand it.",
  },
  {
    number: "02",
    title: "Human-in-the-loop AI",
    body: "Our AI workflows move fast. Our engineers catch what AI misses. You get both — the speed of automation without the reckless mistakes.",
  },
  {
    number: "03",
    title: "Production focus",
    body: "We optimize for live systems under real load, not sandbox demos. Every recommendation is tested against your actual constraints.",
  },
  {
    number: "04",
    title: "No vendor lock-in",
    body: "Open standards, your infrastructure. We build systems you own and can evolve — not dependencies you'll regret in two years.",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
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
                  text="Technical Consulting"
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
                Ship better software.
              </motion.span>
              <motion.span
                className="block"
                {...fadeInUp}
                transition={{ ...transition, delay: 0.24 }}
              >
                Faster than your team can plan it.
              </motion.span>
            </h1>
            <motion.p
              className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground"
              {...fadeInUp}
              transition={{ ...transition, delay: 0.36 }}
            >
              We rebuild, optimize, and scale your systems — using Rust and
              production-tested AI workflows.
            </motion.p>
            <motion.div
              className="mt-10 flex items-center gap-4"
              {...fadeInUp}
              transition={{ ...transition, delay: 0.48 }}
            >
              <Button className="group h-11 px-8 font-mono uppercase" asChild>
                <Link href="/#contact">
                  Get a Free Technical Audit
                  <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant={"outline"}
                className="group h-11 px-8 font-mono uppercase"
                asChild
              >
                <Link href="#services">See Our Services</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Service Cards ─────────────────────────────────────────── */}
        <section id="services" className="px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="gap-6 sm:flex-row sm:items-end">
                <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  What We Do
                </p>
                <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Every engagement is focused on outcomes you can measure.
                </h2>
              </div>
            </MotionInView>

            <div className="mt-3 grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <MotionInView
                    key={service.id}
                    transition={{
                      delay: idx * 0.08,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href="/#contact"
                      className="group flex h-full flex-col gap-6 bg-background p-8 transition-all duration-300 hover:bg-muted/20 lg:p-10"
                    >
                      {/* Card header */}
                      <div>
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary group-hover:bg-primary">
                            <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-white" />
                          </div>
                          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            {service.name}
                          </span>
                        </div>
                        <p className="text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
                          {service.outcome}
                        </p>
                      </div>

                      {/* Benefits */}
                      <ul className="flex flex-col gap-3">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="text-sm leading-relaxed text-foreground">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Proof + CTA */}
                      <div className="mt-auto flex flex-col gap-4 border-t border-border pt-5">
                        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                          {service.proof}
                        </p>
                        <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                          {service.cta}
                          <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </MotionInView>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Differentiation Block ─────────────────────────────────── */}
        <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Why RantAI
              </p>
              <h2 className="mb-12 max-w-md text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Why teams choose us over a generic dev shop
              </h2>
            </MotionInView>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {differentiators.map((item, idx) => (
                <MotionInView
                  key={item.number}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex h-full flex-col gap-4 bg-background p-8">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                      {item.number}
                    </span>
                    <h3 className="text-base font-medium tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </MotionInView>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="flex flex-col items-center gap-5 text-center">
                <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Stop paying for slow, fragile software.
                </h2>
                <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                  Get a free technical audit. We&apos;ll identify the biggest
                  risk in your stack — no commitment required.
                </p>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Get My Free Audit
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
