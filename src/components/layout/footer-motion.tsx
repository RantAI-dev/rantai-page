"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUp } from "lucide-react"

import { FooterAscii } from "@/components/effects/footer-ascii"
import { scrollToTop } from "@/components/layout/smooth-scroll"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

/* ------------------------------------------------------------------ */
/*  CTA card: black panel over a slow ASCII wave                      */
/* ------------------------------------------------------------------ */

export function FooterCtaCard({
  children,
  labelledBy,
}: Readonly<{ children: React.ReactNode; labelledBy: string }>) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="dark relative isolate overflow-hidden rounded-[28px] bg-black text-white"
    >
      <FooterAscii className="-z-10" />
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Fade-up reveal with an index-based delay                          */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  index = 0,
  className,
}: Readonly<{
  children: React.ReactNode
  index?: number
  className?: string
}>) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className, "max-md:filter-none!")}
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Wordmark: letters rise in; near the cursor they lift and darken,   */
/*  so moving across the word sends a soft wave through it             */
/* ------------------------------------------------------------------ */

const letterClass = "inline-block bg-linear-to-b bg-clip-text text-transparent"

export function FooterWordmark({
  text,
  className,
}: Readonly<{ text: string; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const letters = Array.from(text)

  useEffect(() => {
    const root = ref.current
    if (!root || reduce) return
    const waves = [...root.querySelectorAll<HTMLElement>("[data-wave]")]
    const inks = [...root.querySelectorAll<HTMLElement>("[data-wave-ink]")]
    const current = waves.map(() => 0)
    let pointerX: number | null = null
    let frame = 0

    const tick = () => {
      let moving = false
      const reach = root.clientWidth * 0.18
      waves.forEach((el, i) => {
        let goal = 0
        if (pointerX !== null) {
          const r = el.getBoundingClientRect()
          const k = Math.max(
            0,
            1 - Math.abs(pointerX - (r.left + r.width / 2)) / reach
          )
          goal = k * k * (3 - 2 * k)
        }
        // Ease toward the goal so the wave follows the cursor smoothly.
        current[i] += (goal - current[i]) * 0.12
        if (Math.abs(goal - current[i]) > 0.002) moving = true
        el.style.transform = `translateY(${-8 * current[i]}%)`
        inks[i].style.opacity = String(current[i])
      })
      frame = moving ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      pointerX = e.clientX
      kick()
    }
    const leave = () => {
      pointerX = null
      kick()
    }
    root.addEventListener("pointermove", move)
    root.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener("pointermove", move)
      root.removeEventListener("pointerleave", leave)
    }
  }, [reduce])

  // Overscroll reveal: the wordmark is cropped by the panel's bottom edge.
  // If the visitor keeps scrolling down once the page has ended, the panel
  // stretches (with growing resistance) to show the whole word, and the
  // footer lifts by the same amount so the new space stays in view. When
  // they stop, it settles back.
  useEffect(() => {
    const root = ref.current
    const panel = root?.parentElement
    const footer = root?.closest("footer")
    if (!root || !panel || !footer || reduce) return

    let pull = 0 // raw input since the pull started
    let shown = 0 // pixels currently revealed
    let room = 0 // pixels needed to show the whole word
    let frame = 0
    let release: ReturnType<typeof setTimeout> | undefined
    let touchY: number | null = null

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - shown - 4

    const measure = () => {
      const word = root.firstElementChild?.getBoundingClientRect()
      const edge = panel.getBoundingClientRect().bottom
      room = word ? Math.max(0, word.bottom - edge) + 40 : 0
    }

    const apply = () => {
      root.style.marginBottom = shown ? `calc(-0.2em + ${shown}px)` : ""
      // How far through the reveal we are, 0 to 1; darkens the "reward" layer.
      // The rubber band only creeps toward its end, so reach full solid
      // colour by about three quarters of the way instead.
      const progress = room ? shown / room : 0
      const solid = Math.min(1, Math.max(0, (progress - 0.1) / 0.65))
      root.style.setProperty("--pull", String(solid))
      footer.style.transform = shown ? `translateY(${-shown}px)` : ""
    }

    const tick = () => {
      // Rubber band: easy at first, then harder the further it goes.
      const goal = room * (1 - Math.exp(-pull / (room * 1.4)))
      shown += (goal - shown) * 0.18
      if (Math.abs(goal - shown) < 0.4) shown = goal
      apply()
      frame = shown !== goal ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    /** Returns true when this input was used for the pull. */
    const take = (delta: number) => {
      if (pull === 0) {
        if (delta <= 0 || !atBottom()) return false
        measure()
        if (!room) return false
      }
      pull = Math.max(0, pull + delta)
      clearTimeout(release)
      release = setTimeout(() => {
        pull = 0
        kick()
      }, 180)
      kick()
      return true
    }

    // Capture phase, so the smooth scroller never sees a wheel we used.
    const onWheel = (e: WheelEvent) => {
      if (take(e.deltaY)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY
      if (touchY === null || y === undefined) return
      const used = take(touchY - y)
      touchY = y
      if (used && e.cancelable) e.preventDefault()
    }
    const onTouchEnd = () => {
      touchY = null
      clearTimeout(release)
      pull = 0
      kick()
    }

    window.addEventListener("wheel", onWheel, { capture: true, passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(release)
      window.removeEventListener("wheel", onWheel, { capture: true })
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      root.style.marginBottom = ""
      root.style.removeProperty("--pull")
      footer.style.transform = ""
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative select-none", className)}
    >
      <motion.p
        className="flex justify-center"
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.06 }}
      >
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            variants={{
              hidden: { y: "45%", opacity: 0 },
              shown: {
                y: "0%",
                opacity: 1,
                transition: { duration: 1.1, ease },
              },
            }}
          >
            <span data-wave className="relative inline-block">
              <span
                className={cn(
                  letterClass,
                  "from-foreground/[0.08] to-transparent"
                )}
              >
                {char}
              </span>
              {/* Solid dark copy that takes over as the visitor pulls past the
                  end; fully pulled, the word reads as one flat colour */}
              <span
                className="absolute inset-0 inline-block text-foreground"
                style={{ opacity: "var(--pull, 0)" }}
              >
                {char}
              </span>
              {/* Darker copy, faded in as the cursor comes near */}
              <span
                data-wave-ink
                className={cn(
                  letterClass,
                  "absolute inset-0 from-foreground/[0.42] to-foreground/[0.06]"
                )}
                style={{ opacity: 0 }}
              >
                {char}
              </span>
            </span>
          </motion.span>
        ))}
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Back to top                                                       */
/* ------------------------------------------------------------------ */

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 rounded-full transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-1"
    >
      Back to top
      <span className="grid size-7 place-items-center rounded-full border border-border transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
        <ArrowUp
          aria-hidden="true"
          className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </span>
    </button>
  )
}
