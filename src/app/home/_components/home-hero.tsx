"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useCallback, useRef, useState } from "react"

import { HeroPanorama } from "@/components/hero-panorama"
import { PillLink } from "@/components/pill-link"
import { SplitReveal } from "@/components/split-reveal"
import { PageIntro } from "./page-intro"
import { siteConfig } from "@/lib/config"

const ease = [0.22, 1, 0.36, 1] as const

const partners = [
  { name: "NQRust", logo: "/partners/nqrust.png" },
  { name: "QVentures", logo: "/partners/ventures.png" },
  { name: "Bohrlabs", logo: "/partners/bohrlabs.png" },
] as const

export function HomeHero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [introDone, setIntroDone] = useState(false)
  const [ready, setReady] = useState(false)
  const reveal = useCallback(() => setReady(true), [])
  const finishIntro = useCallback(() => setIntroDone(true), [])
  // The scroll cue fades out as soon as the page starts to move.
  const { scrollY } = useScroll()
  const cueOpacity = useTransform(scrollY, [0, 80], [1, 0])

  return (
    <section aria-label="Introduction" className="relative">
      {!introDone && (
        <PageIntro target={cardRef} onReveal={reveal} onDone={finishIntro} />
      )}
      <div className="h-[calc(100svh-6.5rem)] min-h-[600px] px-3 sm:px-4">
        <div
          ref={cardRef}
          className="dark relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-black text-white"
        >
          {/* Product screens turn behind an ASCII Earth: our AI systems
              around real-world operations */}
          {/* Visible from the start: the intro window looks onto it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <HeroPanorama />
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-8 text-center sm:px-8 sm:pb-10">
            <SplitReveal
              id="hero-heading"
              as="h1"
              text="AI systems for real‑world operations."
              trigger="mount"
              play={ready}
              delay={0.3}
              className="text-[clamp(2.75rem,7.6vw,7rem)] leading-[0.94] font-medium tracking-[-0.05em] text-balance"
            />
            <motion.p
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease, delay: 0.7 }}
            >
              Agents, data platforms, and engineering teams for enterprise and
              government, built to run in production.
            </motion.p>

            <motion.div
              className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease, delay: 0.9 }}
            >
              <PillLink
                href={`mailto:${siteConfig.links.email}`}
                size="lg"
                icon="external"
                className="w-full sm:w-auto"
              >
                Talk to our team
              </PillLink>
              <PillLink
                href="#platform"
                size="lg"
                variant="outline"
                className="w-full backdrop-blur-sm sm:w-auto"
              >
                Explore products
              </PillLink>
            </motion.div>

            <motion.div
              className="mt-12 flex w-full flex-col items-center gap-2 border-t border-white/10 pt-4 sm:mt-14 sm:flex-row sm:justify-center sm:gap-10"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease, delay: 1.1 }}
            >
              <span className="text-xs font-medium tracking-[0.08em] text-white/45 uppercase">
                Partners
              </span>
              <ul className="flex items-center gap-6 sm:gap-10">
                {partners.map((partner) => (
                  <li key={partner.name}>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={210}
                      height={140}
                      className="h-14 w-auto opacity-75 brightness-0 invert transition-opacity hover:opacity-100 sm:h-[72px]"
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {!reduce && (
            <motion.p
              aria-hidden="true"
              style={{ opacity: cueOpacity }}
              className="absolute top-6 right-6 hidden items-center gap-2 text-xs font-medium tracking-[0.08em] text-white/50 uppercase sm:flex"
            >
              Scroll to explore
              <motion.span
                className="block h-6 w-px origin-top bg-white/50"
                animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
