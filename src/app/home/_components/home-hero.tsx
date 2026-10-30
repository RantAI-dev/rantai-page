"use client"

import Image from "next/image"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useCallback, useRef, useState } from "react"

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

const statements = [
  {
    title: "AI systems for real‑world operations.",
    body: "Agents, data platforms, and engineering teams for enterprise and government, built to run in production.",
  },
  {
    title: "Built for enterprise and government teams.",
    body: "RantAI makes AI agents, the runtime that runs them, and the engineering team that installs them in your environment.",
  },
] as const

function AgentsShot() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl">
      <Image
        src="/products/rantai-agents-chat.png"
        alt=""
        width={1920}
        height={1080}
        sizes="(max-width: 640px) 80vw, 50vw"
        priority
        className="h-auto w-full"
      />
    </div>
  )
}

// The source capture has a light-blue window frame and black margin; crop to the app area.
function ClawShot() {
  return (
    <div className="relative aspect-[1450/960] overflow-hidden rounded-xl border border-white/15 bg-[#0b0d10] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl">
      <Image
        src="/products/rantai-claw-console.png"
        alt=""
        width={1600}
        height={1110}
        sizes="(max-width: 640px) 80vw, 50vw"
        priority
        className="absolute h-auto max-w-none"
        style={{ width: "110.35%", left: "-5.17%", top: "-5.73%" }}
      />
    </div>
  )
}

export function HomeHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [phase, setPhase] = useState<0 | 1>(0)
  const [introDone, setIntroDone] = useState(false)
  const [ready, setReady] = useState(false)
  const reveal = useCallback(() => setReady(true), [])
  const finishIntro = useCallback(() => setIntroDone(true), [])
  const { scrollYProgress: scrollProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  // A JS-driven copy keeps motion from mapping opacity onto a native ScrollTimeline,
  // which mis-measures this sticky section.
  const scrollYProgress = useMotionValue(0)

  useMotionValueEvent(scrollProgress, "change", (value) => {
    scrollYProgress.set(value)
    setPhase(value > 0.4 ? 1 : 0)
  })

  const tiltY = useTransform(scrollYProgress, [0, 0.85], [20, 0])
  const tiltYReverse = useTransform(tiltY, (value) => -value)
  const tiltX = useTransform(scrollYProgress, [0, 0.85], [8, 0])
  const tiltZ = useTransform(scrollYProgress, [0, 0.85], [2, 0])
  const tiltZReverse = useTransform(tiltZ, (value) => -value)
  const leftX = useTransform(scrollYProgress, [0, 0.85], ["0%", "14%"])
  const rightX = useTransform(scrollYProgress, [0, 0.85], ["0%", "-14%"])
  const shotsScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.92])
  const agentsOpacity = useTransform(scrollYProgress, [0, 0.85], [0.55, 1])
  const clawOpacity = useTransform(scrollYProgress, [0, 0.85], [0.8, 1])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  const statement = statements[phase]

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative h-[200svh]"
    >
      {!introDone && <PageIntro onReveal={reveal} onDone={finishIntro} />}
      <div className="sticky top-16 h-[calc(100svh-6.5rem)] min-h-[600px] px-3 sm:px-4">
        <div className="dark relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-black text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-[78%] [perspective:2000px]"
              style={reduce ? undefined : { scale: shotsScale }}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 60 },
                    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 },
                    transition: { duration: 1.4, ease, delay: 0.1 },
                  })}
            >
              <motion.div
                className="absolute top-[7%] left-[-14%] w-[86%] sm:top-[9%] sm:left-[-4%] sm:w-[54%]"
                style={
                  reduce
                    ? { opacity: 0.55, transform: "rotateY(20deg) rotateX(8deg) rotateZ(-2deg)" }
                    : {
                        x: leftX,
                        opacity: agentsOpacity,
                        rotateY: tiltY,
                        rotateX: tiltX,
                        rotateZ: tiltZReverse,
                      }
                }
              >
                <AgentsShot />
              </motion.div>
              <motion.div
                className="absolute top-[1%] right-[-16%] w-[88%] sm:top-[4%] sm:right-[-5%] sm:w-[56%]"
                style={
                  reduce
                    ? { opacity: 0.8, transform: "rotateY(-20deg) rotateX(8deg) rotateZ(2deg)" }
                    : {
                        x: rightX,
                        opacity: clawOpacity,
                        rotateY: tiltYReverse,
                        rotateX: tiltX,
                        rotateZ: tiltZ,
                      }
                }
              >
                <ClawShot />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-[18%] left-1/2 h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-brand-1/25 blur-[120px]"
              style={reduce ? undefined : { opacity: glowOpacity }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.8)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black via-black/90 to-transparent" />
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-8 text-center sm:px-8 sm:pb-10">
            <div className="grid min-h-[15rem] w-full items-end sm:min-h-[19rem]">
              <AnimatePresence initial={false}>
                <div key={phase} className="col-start-1 row-start-1 flex w-full flex-col items-center">
                  <SplitReveal
                    id={phase === 0 ? "hero-heading" : undefined}
                    as={phase === 0 ? "h1" : "p"}
                    text={statement.title}
                    trigger="mount"
                    play={ready}
                    delay={phase === 0 ? 0.3 : 0}
                    className="text-[clamp(2.75rem,7.6vw,7rem)] leading-[0.94] font-medium tracking-[-0.05em] text-balance"
                  />
                  <motion.p
                    className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={ready ? { opacity: 1, y: 0 } : undefined}
                    exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.6, ease, delay: phase === 0 ? 0.7 : 0.35 }}
                  >
                    {statement.body}
                  </motion.p>
                </div>
              </AnimatePresence>
            </div>

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
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
