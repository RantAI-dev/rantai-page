"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useTranslations } from "next-intl"
import { Fragment, useCallback, useRef, useState } from "react"

import { HeroPanorama } from "./hero-panorama"
import { PillLink } from "@/components/shared/pill-link"
import { SplitReveal } from "@/components/shared/split-reveal"
import { PageIntro } from "./page-intro"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

const headline =
  "text-[clamp(3rem,7.6vw,7rem)] leading-[0.94] font-medium tracking-[-0.05em] text-balance"

// A streak of light sweeps across the button on hover.
const buttonSheen =
  "relative overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-linear-to-r before:from-transparent before:via-black/10 before:to-transparent before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[300%] motion-reduce:before:hidden"

const partners = [
  { name: "NQRust", logo: "/partners/nqrust.png" },
  { name: "QVentures", logo: "/partners/ventures.png" },
  { name: "Bohrlabs", logo: "/partners/bohrlabs.png" },
] as const

export function HomeHero() {
  const t = useTranslations("home.hero")
  const title = t("title")
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
    <section aria-label={t("label")} className="relative">
      {!introDone && (
        <PageIntro target={cardRef} onReveal={reveal} onDone={finishIntro} />
      )}
      <div className="h-[calc(100svh-6.5rem)] min-h-[520px] px-3 sm:min-h-[600px] sm:px-4">
        <div
          ref={cardRef}
          className="dark relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-black text-white"
        >
          {/* Product screens turn behind an ASCII Earth: our AI systems
              around real-world operations */}
          {/* Visible from the start: the intro window looks onto it */}
          {/* Phones: the visual gets the top of the card to itself and fades
              into the text below it, instead of sitting behind the text. */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative isolate min-h-[220px] flex-1 sm:absolute sm:inset-0 sm:-z-10"
          >
            <HeroPanorama />
            <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black to-transparent sm:hidden" />
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start px-5 pb-5 text-left sm:items-center sm:px-8 sm:pb-10 sm:text-center">
            <div className="relative">
              <SplitReveal
                id="hero-heading"
                as="h1"
                text={title}
                trigger="mount"
                play={ready}
                delay={0.15}
                className={headline}
              />
              {/* One pass of light across the headline once it has landed */}
              {!reduce && (
                <motion.p
                  aria-hidden="true"
                  className={cn(
                    headline,
                    "pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgb(255_255_255/0.95)_50%,transparent_60%)] bg-[length:250%_100%] bg-clip-text text-transparent"
                  )}
                  initial={{ backgroundPosition: "120% 0", opacity: 0 }}
                  animate={
                    ready
                      ? { backgroundPosition: "-20% 0", opacity: [0, 1, 1, 0] }
                      : undefined
                  }
                  transition={{ duration: 1.6, delay: 1.1, ease: "easeInOut" }}
                >
                  {/* Same line breaks as the headline it sweeps across */}
                  {title.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && (
                        <>
                          {" "}
                          <br className="hidden sm:block" />
                        </>
                      )}
                      {line}
                    </Fragment>
                  ))}
                </motion.p>
              )}
            </div>
            <motion.p
              // The largest text on phones, the one load speed (LCP) is
              // measured by. It fades in from 1%, not 0: browsers skip fully
              // transparent text, which would delay LCP until the fade ends.
              className="mt-4 max-w-[310px] text-base leading-relaxed text-white/70 sm:mt-6 sm:max-w-2xl sm:text-xl"
              initial={reduce ? false : { opacity: 0.01, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
            >
              {/* Phones get a shorter line: the headline already says
                  "real-world operations". */}
              <span className="sm:hidden">{t("descriptionShort")}</span>
              <span className="hidden sm:inline">{t("description")}</span>
            </motion.p>

            <motion.div
              className="mt-5 flex w-full flex-wrap items-center gap-3 sm:mt-9 sm:w-auto sm:flex-nowrap sm:justify-center sm:gap-x-3 sm:gap-y-3"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
            >
              <PillLink
                href={`mailto:${siteConfig.links.email}`}
                size="lg"
                icon="external"
                className={buttonSheen}
              >
                {t("talk")}
              </PillLink>
              <PillLink
                href="#platform"
                size="lg"
                variant="outline"
                className="backdrop-blur-sm"
              >
                {t("explore")}
              </PillLink>
            </motion.div>

            <motion.div
              className="mt-6 flex w-full items-center justify-between gap-4 sm:mt-14 sm:justify-center sm:gap-10 sm:border-t sm:border-white/10 sm:pt-4"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease, delay: 0.7 }}
            >
              <span className="text-[11px] font-medium tracking-[0.08em] text-white/60 uppercase sm:text-xs">
                {t("partners")}
              </span>
              <ul className="flex items-center gap-4 sm:gap-10">
                {partners.map((partner) => (
                  <li key={partner.name}>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={210}
                      height={140}
                      className="h-9 w-auto opacity-75 brightness-0 invert transition-opacity hover:opacity-100 sm:h-[72px]"
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
              {t("scroll")}
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
