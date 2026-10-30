"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

import { PillLink } from "@/components/pill-link"
import { siteConfig } from "@/lib/config"

const ease = [0.22, 1, 0.36, 1] as const

const partners = [
  { name: "NQRust", logo: "/partners/nqrust.png" },
  { name: "QVentures", logo: "/partners/ventures.png" },
  { name: "Bohrlabs", logo: "/partners/bohrlabs.png" },
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease, delay },
        }

  return (
    <section ref={ref} aria-labelledby="hero-heading" className="px-3 sm:px-4">
      <div className="dark relative isolate flex min-h-[680px] flex-col justify-end overflow-hidden rounded-[28px] bg-black text-white sm:min-h-[calc(100svh-6.5rem)]">
        <motion.div
          aria-hidden="true"
          style={reduce ? undefined : { y: visualY, scale: visualScale }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-x-0 top-0 h-[78%] [perspective:2000px]">
            <motion.div
              className="absolute top-[7%] left-[-14%] w-[86%] sm:top-[9%] sm:left-[-4%] sm:w-[54%]"
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 60 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 1.4, ease, delay: 0.1 },
                  })}
            >
              <div
                className="opacity-55"
                style={{ transform: "rotateY(20deg) rotateX(8deg) rotateZ(-2deg)" }}
              >
                <AgentsShot />
              </div>
            </motion.div>
            <motion.div
              className="absolute top-[1%] right-[-16%] w-[88%] sm:top-[4%] sm:right-[-5%] sm:w-[56%]"
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 80 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 1.4, ease, delay: 0.25 },
                  })}
            >
              <div
                className="opacity-80"
                style={{ transform: "rotateY(-20deg) rotateX(8deg) rotateZ(2deg)" }}
              >
                <ClawShot />
              </div>
            </motion.div>
          </div>

          <div className="absolute top-[18%] left-1/2 h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-brand-1/25 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-[300px] pb-8 text-center sm:px-8 sm:pt-[36vh] sm:pb-10">
          <motion.h1
            id="hero-heading"
            className="text-[clamp(2.75rem,8.2vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-balance"
            {...reveal(0.35)}
          >
            AI systems for real&#8209;world operations.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl"
            {...reveal(0.5)}
          >
            Agents, data platforms, and engineering teams for enterprise and
            government, built to run in production.
          </motion.p>
          <motion.div
            className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            {...reveal(0.65)}
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
            className="mt-14 flex w-full flex-col items-center gap-2 border-t border-white/10 pt-4 sm:mt-16 sm:flex-row sm:justify-center sm:gap-10"
            {...reveal(0.85)}
          >
            <span className="font-label text-[11px] tracking-[0.18em] text-white/45 uppercase">
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
      </div>
    </section>
  )
}
