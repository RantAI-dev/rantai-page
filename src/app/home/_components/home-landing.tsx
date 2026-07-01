"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { MoonIcon, SunIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import type { CSSProperties } from "react"

import { LogoLoop, type LogoItem } from "@/components/LogoLoop"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { siteConfig } from "@/lib/config"
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

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
  { href: "/our-team", label: "Teams" },
] as const

const DEFAULT_TAGLINE =
  "Deploy AI agents, analytics, and automation systems that work in production."

const productLinks = [
  {
    href: "https://agents.rantai.dev/",
    label: "RantAI Agents",
    darkLogo: "/logo/RantAI Agents Dark.svg",
    lightLogo: "/logo/RantAI Agents Light.svg",
    tagline: "Deploy AI agents that handle real work, not just demos.",
    video: "/videos/rantai-agents/rag-prompt.mp4",
  },
  {
    href: "https://claw.rantai.dev/",
    label: "RantAIClaw",
    darkLogo: "/logo/RantAIClaw Dark.svg",
    lightLogo: "/logo/RantAIClaw Light.svg",
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

const emptySubscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

function useHydrated() {
  return useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot)
}

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

function ThemeIconButton() {
  const hydrated = useHydrated()
  const { resolvedTheme, setTheme } = useTheme()
  const isLight = hydrated && resolvedTheme === "light"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      {isLight ? (
        <MoonIcon aria-hidden className="size-5" />
      ) : (
        <SunIcon aria-hidden className="size-5" />
      )}
    </Button>
  )
}

function HomeNav({
  reducedMotion,
}: Readonly<{
  reducedMotion: boolean
}>) {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-30"
      initial={reducedMotion ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-7">
          <Link
            href="/home"
            className="shrink-0 transition-opacity hover:opacity-75"
            aria-label="RantAI home"
          >
            <Image
              src="/rant-ai.png"
              alt="RantAI"
              width={36}
              height={36}
              className="size-8"
              priority
            />
          </Link>

          <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className="text-foreground hover:bg-background/30"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* <ThemeIconButton /> */}
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
            <Link href={`mailto:${siteConfig.links.email}`}>Contact Us</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

function ProductLinks({
  isLight,
  reducedMotion,
  revealed,
  hoveredIndex,
  onHover,
}: Readonly<{
  isLight: boolean
  reducedMotion: boolean
  revealed: boolean
  hoveredIndex: number | null
  onHover: (index: number | null) => void
}>) {
  return (
    <motion.div
      className={cn(!revealed && "pointer-events-none")}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <div className="flex flex-wrap items-center justify-center gap-1 text-lg text-foreground">
        <span>Explore</span>
        {productLinks.map((product, index) => (
          <span key={product.href} className="flex items-center gap-1">
            <HoverCard
              openDelay={80}
              closeDelay={80}
              onOpenChange={(open) => onHover(open ? index : null)}
            >
              <HoverCardTrigger asChild>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className={cn(
                    "text-lg font-medium hover:underline hover:bg-foreground/10",
                    hoveredIndex !== null &&
                      hoveredIndex !== index &&
                      "opacity-40"
                  )}
                >
                  <Link href={product.href}>
                    <Image
                      src={isLight ? product.lightLogo : product.darkLogo}
                      alt=""
                      width={80}
                      height={80}
                      className="h-5 w-auto"
                    />
                    <span>{product.label}</span>
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
            {index < productLinks.length - 1 && <span>and</span>}
          </span>
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
      <div className="flex w-full items-center">
        <span className="shrink-0 px-8">Trusted Partners</span>
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
  isLight,
  reducedMotion,
}: Readonly<{
  isLight: boolean
  reducedMotion: boolean
}>) {
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
        color2={isLight ? "#FFFFFF" : "#161B1D"}
        color3={isLight ? "#FFFFFF" : "#161B1D"}
        timeSpeed={0.5}
      />

      <div className="absolute inset-0 bg-(--home-scrim)" />
    </motion.div>
  )
}

export function HomeLanding() {
  const hydrated = useHydrated()
  const { resolvedTheme } = useTheme()
  const isLight = hydrated && resolvedTheme === "light"
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

  const themeVars = useMemo(
    () =>
      ({
        "--home-partner-gradient": isLight
          ? "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 48%, #ffffff 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 48%, #000000 100%)",
        "--home-scrim": isLight
          ? "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 42%, rgba(255,255,255,0.88) 100%)"
          : "linear-gradient(115deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 48%, rgba(0,0,0,0.76) 100%)",
      }) as CSSProperties,
    [isLight]
  )

  return (
    <div
      style={themeVars}
      className="relative min-h-dvh overflow-hidden bg-background"
    >
      <HomeBackground
        isLight={isLight}
        reducedMotion={Boolean(reducedMotion)}
      />
      <HomeNav reducedMotion={Boolean(reducedMotion)} />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-5 pt-20 pb-[118px] sm:px-8 sm:pb-[132px] lg:px-10">
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-12 text-center w-full">
          <div className="flex flex-col items-center gap-2 w-full">
            <motion.h1
              layout="position"
              className="text-4xl leading-none tracking-tighter text-balance sm:text-5xl lg:text-6xl w-full"
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
                className="flex min-h-14 max-w-2xl items-center justify-center text-lg text-foreground/50 dark:text-foreground/80"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
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
              isLight={isLight}
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
