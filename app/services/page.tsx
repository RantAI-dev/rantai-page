"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"
import { motion } from "motion/react"

import { Navbar } from "@/components/navbar"
import { MotionInView } from "@/components/motion-in-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import ShinyText from "@/components/ShinyText"
import { fadeInUp, fadeInLeft, defaultTransition as transition } from "@/lib/motion-variants"
import { services, clients, products, differentiators } from "./data"

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

        {/* ── Client Showcase ───────────────────────────────────────── */}
        <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Our Clients
              </p>
              <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Companies we&apos;ve built with
              </h2>
              <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
                We selectively partner with companies building ambitious
                software. Nexus and Bohr Labs trusted us to ship.
              </p>
            </MotionInView>

            <div className="mt-10 grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
              {clients.map((client, idx) => (
                <MotionInView
                  key={client.id}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={client.href}
                    className="group relative flex h-52 items-center justify-center overflow-hidden bg-background transition-colors duration-300 sm:h-64"
                  >
                    {/* Logo — default state */}
                    <div className="relative h-32 w-40 transition-all duration-300 group-hover:scale-95 group-hover:opacity-0">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        sizes="200px"
                        className="object-contain opacity-50 brightness-0 invert"
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-background/95 p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative h-8 w-28 shrink-0">
                          <Image
                            src={client.logo}
                            alt={client.name}
                            fill
                            sizes="112px"
                            className="object-contain object-left brightness-0 invert"
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 font-mono text-xs uppercase"
                        >
                          {client.category}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          {client.name}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground">
                          {client.tagline}
                        </p>
                        <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                          View Project
                          <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </MotionInView>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product Showcase ──────────────────────────────────────── */}
        <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                What We&apos;ve Shipped
              </p>
              <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Products built by RantAI, running in production
              </h2>
            </MotionInView>

            <div className="mt-10 grid grid-cols-1 gap-px bg-border">
              {products.map((product, idx) => (
                <MotionInView
                  key={product.id}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={product.href}
                    className="group flex h-full flex-col bg-background transition-all duration-300 hover:bg-muted/20 sm:flex-row"
                  >
                    <div className="flex h-52 w-full shrink-0 items-center justify-center border-b border-border bg-gradient-to-br from-muted/40 to-muted/10 sm:h-auto sm:w-80 sm:border-r sm:border-b-0">
                      <span className="font-mono text-xs tracking-widest text-muted-foreground/40 uppercase">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-8 lg:p-10">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                          {product.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="shrink-0 font-mono text-xs uppercase"
                        >
                          Built by RantAI
                        </Badge>
                      </div>
                      <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                        {product.tagline}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                        Explore Product
                        <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </MotionInView>
              ))}
            </div>

            <MotionInView>
              <div className="mt-px border border-t-0 border-border bg-background p-8 text-center">
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Your product could be here. Let&apos;s build it.
                  <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </MotionInView>
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
