"use client"

import { animate, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const
const open = [0.76, 0, 0.24, 1] as const
const HOLD_MS = 1350
const OPEN_S = 1.25
const STORAGE_KEY = "rantai-intro"

/**
 * First-visit intro. The screen is black except for a small window in the
 * middle that already shows the real hero behind it, with the wordmark on
 * top. The window then opens up until it matches the hero card, the
 * wordmark parts, and the hero copy comes in.
 */
export function PageIntro({
  target,
  onReveal,
  onDone,
}: Readonly<{
  target: React.RefObject<HTMLElement | null>
  onReveal: () => void
  onDone: () => void
}>) {
  const holeRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    const hole = holeRef.current
    const card = target.current
    let seen = false
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1"
    } catch {}
    const box = card?.getBoundingClientRect()
    const skip =
      seen ||
      !hole ||
      !box ||
      box.top < -1 || // page restored mid-scroll: the hero is not in view
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (skip || !hole || !box) {
      onReveal()
      onDone()
      return
    }

    // Hold the page still while the intro plays.
    const block = (e: Event) => e.preventDefault()
    const opts = { capture: true, passive: false } as const
    window.addEventListener("wheel", block, opts)
    window.addEventListener("touchmove", block, opts)
    const release = () => {
      window.removeEventListener("wheel", block, opts)
      window.removeEventListener("touchmove", block, opts)
    }

    const vw = window.innerWidth
    const w = vw < 640 ? vw * 0.72 : Math.min(vw * 0.44, 560)
    const h = w * 0.62
    // Centre the window on the product ring, so it opens on the screens
    // rather than on the dark lower half of the hero.
    const cy = box.top + box.height * (vw < 640 ? 0.3 : 0.42)
    const from = { left: (vw - w) / 2, top: cy - h / 2, width: w, height: h }
    overlayRef.current?.style.setProperty("--intro-y", `${cy}px`)
    const radius = parseFloat(getComputedStyle(card!).borderTopLeftRadius) || 28
    // The window opens from nothing in the middle before it holds.
    const cx = from.left + from.width / 2
    const cyMid = from.top + from.height / 2
    Object.assign(hole.style, {
      left: `${cx}px`,
      top: `${cyMid}px`,
      width: "0px",
      height: "0px",
      borderRadius: "20px",
    })
    animate(
      hole,
      {
        left: [`${cx}px`, `${from.left}px`],
        top: [`${cyMid}px`, `${from.top}px`],
        width: ["0px", `${from.width}px`],
        height: ["0px", `${from.height}px`],
      },
      { duration: 0.6, ease: [0.65, 0, 0.35, 1] }
    )

    let cancelled = false
    const timer = window.setTimeout(() => {
      setOpening(true)
      onReveal()
      animate(
        hole,
        {
          left: [`${from.left}px`, `${box.left}px`],
          top: [`${from.top}px`, `${box.top}px`],
          width: [`${from.width}px`, `${box.width}px`],
          height: [`${from.height}px`, `${box.height}px`],
          borderRadius: ["20px", `${radius}px`],
        },
        { duration: OPEN_S, ease: open }
      )
        // The cover over the navbar and announcement fades away instead of
        // vanishing, so the top of the page eases in.
        .then(() =>
          overlayRef.current
            ? animate(
                overlayRef.current,
                { opacity: [1, 0] },
                { duration: 0.6, ease: "easeOut" }
              )
            : undefined
        )
        .then(() => {
          if (cancelled) return
          try {
            sessionStorage.setItem(STORAGE_KEY, "1")
          } catch {}
          release()
          onDone()
        })
    }, HOLD_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      release()
    }
  }, [target, onReveal, onDone])

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[100] animate-[intro-failsafe_0.3s_ease_5s_forwards] overflow-hidden"
    >
      {/* The window: transparent, with a huge page-coloured shadow that covers
          everything around it. Before it is sized (server render) it sits at
          0×0 in the corner, and the shadow alone already covers the page. */}
      <div
        ref={holeRef}
        className="absolute top-0 left-0 shadow-[0_0_0_200vmax_var(--background)]"
      />

      {/* Wordmark over the window; it lifts away as the window opens */}
      <div className="pointer-events-none absolute inset-x-0 top-(--intro-y,50%) flex -translate-y-1/2 justify-center">
        <span className="overflow-hidden pb-[0.08em] text-[clamp(3.25rem,10vw,9rem)] leading-none font-semibold tracking-[-0.055em] text-white">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={
              opening
                ? { y: "0%", scale: 1.12, opacity: 0, filter: "blur(12px)" }
                : { y: "0%", scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={
              opening
                ? { duration: OPEN_S * 0.6, ease }
                : { duration: 0.7, ease, delay: 0.1 }
            }
          >
            RantAI
          </motion.span>
        </span>
      </div>
    </div>
  )
}
