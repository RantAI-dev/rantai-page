"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

import { LogoLoop, type LogoItem } from "@/components/LogoLoop"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const Grainient = dynamic(() => import("@/components/Grainient"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
})

const typedPhrases = [
  "actual operations.",
  "enterprise teams.",
  "real businesses.",
  "modern workflows.",
  "critical systems.",
  "real work.",
] as const

const DEFAULT_TAGLINE =
  "Deploy AI agents, analytics, and automation systems that work in production."

const productLinks = [
  {
    href: "https://agents.rantai.dev/",
    label: "RantAI Agents",
    role: "Build knowledge-driven agents",
    darkLogo: "/logo/RantAI Agents Dark.svg",
    tagline: "Deploy AI agents that handle real work, not just demos.",
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    href: "https://claw.rantai.dev/",
    label: "RantAIClaw",
    role: "Run autonomous agents",
    darkLogo: "/logo/RantAIClaw Dark.svg",
    tagline:
      "A production multi-agent runtime in 100% Rust — run, control, and extend autonomous agents your way.",
    video: "/videos/rantai-claw/claw-demo.mp4",
  },
] as const

const partners = [
  {
    name: "NQRust",
    logo: "/partners/nqrust.png",
  },
  {
    name: "QVentures",
    logo: "/partners/ventures.png",
  },
  {
    name: "Bohrlabs",
    logo: "/partners/bohrlabs.png",
  },
] as const

const partnerLogoItems: LogoItem[] = partners.map((partner) => ({
  node: (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={220}
      height={88}
      className="h-12 w-auto object-contain opacity-80 brightness-0 transition-opacity duration-300 hover:opacity-100 sm:h-14 dark:invert"
    />
  ),
  ariaLabel: partner.name,
}))

const homeThemeVars = {
  "--home-partner-gradient":
    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.86) 48%, #000000 100%)",
  "--home-scrim":
    "radial-gradient(ellipse at 50% 48%, rgba(3,7,18,0.78) 0%, rgba(3,7,18,0.58) 38%, rgba(3,7,18,0.18) 70%, transparent 82%), linear-gradient(115deg, rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.86) 100%)",
} as CSSProperties

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof globalThis.window === "undefined") {
      return false
    }

    return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(prefers-reduced-motion: reduce)")

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return reducedMotion
}

function useTypingWords(words: readonly string[], enabled: boolean) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [wordIndex, setWordIndex] = useState(() =>
    Math.floor(Math.random() * words.length)
  )
  const [letterCount, setLetterCount] = useState(0)
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing"
  )
  const [completedInitialWord, setCompletedInitialWord] = useState(false)

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      return
    }

    const currentWord = words[wordIndex]
    const delay = { typing: 40, holding: 5000, deleting: 30 }[phase]

    const timeout = globalThis.setTimeout(() => {
      if (phase === "typing") {
        if (letterCount < currentWord.length) {
          setLetterCount((count) => count + 1)
        } else {
          setCompletedInitialWord(true)
          setPhase("holding")
        }
        return
      }

      if (phase === "holding") {
        setPhase("deleting")
        return
      }

      if (letterCount > 0) {
        setLetterCount((count) => count - 1)
      } else {
        setWordIndex((index) => {
          if (words.length <= 1) {
            return index
          }

          let next = index
          while (next === index) {
            next = Math.floor(Math.random() * words.length)
          }
          return next
        })
        setPhase("typing")
      }
    }, delay)

    return () => {
      globalThis.clearTimeout(timeout)
    }
  }, [enabled, letterCount, phase, prefersReducedMotion, wordIndex, words])

  if (prefersReducedMotion) {
    return { text: words[wordIndex], completedInitialWord: true }
  }

  if (!enabled) {
    return { text: "", completedInitialWord: false }
  }

  return {
    text: words[wordIndex].slice(0, letterCount),
    completedInitialWord,
  }
}

function ProductLinks({
  reducedMotion,
  revealed,
  hoveredIndex,
  onHover,
}: Readonly<{
  reducedMotion: boolean
  revealed: boolean
  hoveredIndex: number | null
  onHover: (index: number | null) => void
}>) {
  return (
    <motion.div
      className={cn("w-full max-w-3xl", !revealed && "pointer-events-none")}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <div className="mb-3 flex items-center gap-3 px-1 text-xs font-medium tracking-[0.18em] text-foreground/80 uppercase">
        <span>Explore the stack</span>
        <span aria-hidden="true" className="h-px flex-1 bg-foreground/25" />
      </div>

      <div className="grid overflow-hidden border-y border-foreground/25 bg-black/35 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-md sm:grid-cols-2">
        {productLinks.map((product, index) => (
          <HoverCard
            key={product.href}
            openDelay={80}
            closeDelay={80}
            onOpenChange={(open) => onHover(open ? index : null)}
          >
            <HoverCardTrigger asChild>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "group relative h-auto w-full justify-start rounded-none px-5 py-4 text-left transition-[background-color,opacity] duration-300 hover:bg-foreground/[0.08] sm:px-6 sm:py-5",
                  index > 0 &&
                    "border-t border-foreground/25 sm:border-t-0 sm:border-l",
                  hoveredIndex !== null &&
                    hoveredIndex !== index &&
                    "opacity-55"
                )}
              >
                <Link href={product.href}>
                  <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-1 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  <span className="flex w-full items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-foreground/25 bg-black/35 transition-colors duration-300 group-hover:border-brand-1/70 group-hover:bg-brand-1/15">
                      <Image
                        src={product.darkLogo}
                        alt=""
                        width={80}
                        height={80}
                        className="h-5 w-auto"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-foreground">
                        {product.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-normal text-foreground/75">
                        {product.role}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-foreground/60 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-1"
                    />
                  </span>
                </Link>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-md p-1">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Skeleton className="absolute inset-0 rounded-md" />
                <video
                  src={product.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-label={`${product.label} demo`}
                  className="relative h-full w-full rounded-md object-cover"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </motion.div>
  )
}

function PartnerStrip({
  reducedMotion,
  revealed,
}: Readonly<{
  reducedMotion: boolean
  revealed: boolean
}>) {
  return (
    <motion.section
      aria-label="RantAI partners"
      style={{ background: "var(--home-partner-gradient)" }}
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 mx-auto flex h-64 items-end",
        !revealed && "pointer-events-none"
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
    >
      <div className="flex w-full items-center border-t border-foreground/20 bg-black/30 py-3 backdrop-blur-sm sm:py-4">
        <span className="shrink-0 px-5 text-xs font-medium tracking-[0.14em] text-foreground/75 uppercase sm:px-8">
          Trusted Partners
        </span>
        <LogoLoop
          className="min-w-0 flex-1"
          logos={partnerLogoItems}
          speed={55}
          logoHeight={56}
          gap={72}
          pauseOnHover
          fadeOut
          direction="left"
          scaleOnHover
          ariaLabel="Partner logos"
        />
      </div>
    </motion.section>
  )
}

function HomeBackground({
  reducedMotion,
}: Readonly<{ reducedMotion: boolean }>) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Grainient
        className="absolute inset-0"
        color1={"#5CB6F9"}
        color2="#161B1D"
        color3="#161B1D"
        timeSpeed={0.5}
      />

      <div className="absolute inset-0 bg-(--home-scrim)" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />
    </motion.div>
  )
}

export function HomeLanding() {
  const reducedMotion = useReducedMotion()
  const [typingEnabled, setTypingEnabled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hoveredProduct =
    hoveredIndex !== null ? productLinks[hoveredIndex] : null
  const headlineNoun = hoveredProduct?.label ?? "AI"
  const tagline = hoveredProduct?.tagline ?? DEFAULT_TAGLINE
  const { text: typedWord, completedInitialWord } = useTypingWords(
    typedPhrases,
    typingEnabled
  )
  const chromeRevealed = Boolean(reducedMotion || completedInitialWord)
  const [contentMounted, setContentMounted] = useState(false)

  useEffect(() => {
    const timeout = globalThis.setTimeout(
      () => {
        setTypingEnabled(true)
      },
      reducedMotion ? 0 : 1500
    )

    return () => {
      globalThis.clearTimeout(timeout)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!chromeRevealed) {
      return
    }

    const timeout = globalThis.setTimeout(
      () => {
        setContentMounted(true)
      },
      reducedMotion ? 0 : 300
    )

    return () => {
      globalThis.clearTimeout(timeout)
    }
  }, [chromeRevealed, reducedMotion])

  return (
    <div
      style={homeThemeVars}
      className="relative min-h-dvh overflow-hidden bg-background"
    >
      <HomeBackground reducedMotion={Boolean(reducedMotion)} />
      <Navbar />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-5 pt-20 pb-[140px] sm:px-8 sm:pb-[154px] lg:px-10">
        <section className="mx-auto flex w-full max-w-6xl -translate-y-[1.5vh] flex-col items-center gap-9 text-center sm:gap-10">
          <div className="flex w-full flex-col items-center gap-3">
            <motion.div
              className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground/80 uppercase"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
            >
              <span aria-hidden="true" className="h-px w-8 bg-brand-1/80" />
              <span>RantAI / Production AI Systems</span>
              <span aria-hidden="true" className="h-px w-8 bg-brand-1/80" />
            </motion.div>

            <motion.h1
              layout="position"
              className="w-full max-w-6xl text-[clamp(2.75rem,6.35vw,6rem)] leading-[0.94] tracking-[-0.055em] text-balance"
              initial={
                reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.15,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4,
                layout: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <motion.span
                className="block"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 18, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 1.25,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.45,
                }}
              >
                We&apos;re building{" "}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={headlineNoun}
                    className="inline-block"
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {headlineNoun}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
              <motion.span
                className="block"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 18, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.8,
                }}
              >
                <motion.span
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.9,
                  }}
                >
                  for
                </motion.span>{" "}
                <motion.span
                  animate={
                    typingEnabled
                      ? { opacity: 1, y: 0, scaleX: 1 }
                      : { opacity: 0, y: 10, scaleX: 0.92 }
                  }
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block origin-left font-medium underline decoration-brand-1 decoration-dashed decoration-[3px] underline-offset-4"
                >
                  <span aria-live="polite" aria-atomic="true">
                    {typedWord}
                    <span className="ml-0.5 inline-block h-[0.9em] w-[0.06em] translate-y-[0.08em] animate-pulse bg-current" />
                  </span>
                </motion.span>
              </motion.span>
            </motion.h1>

            {contentMounted && (
              <motion.p
                className="flex min-h-12 max-w-2xl items-center justify-center text-base leading-relaxed text-foreground/90 sm:text-lg"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={tagline}
                    className="block text-balance"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tagline}
                  </motion.span>
                </AnimatePresence>
              </motion.p>
            )}
          </div>

          {contentMounted && (
            <ProductLinks
              reducedMotion={Boolean(reducedMotion)}
              revealed={contentMounted}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          )}
        </section>
      </main>

      <PartnerStrip
        reducedMotion={Boolean(reducedMotion)}
        revealed={chromeRevealed}
      />
    </div>
  )
}
