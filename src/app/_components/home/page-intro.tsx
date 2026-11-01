"use client"

import { animate, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const
const open = [0.76, 0, 0.24, 1] as const
// Kept short: the hero copy (the page's main content) waits for the window.
const HOLD_MS = 700
const OPEN_S = 0.9
const STORAGE_KEY = "rantai-intro"

type Box = { left: number; top: number; width: number; height: number }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpBox = (a: Box, b: Box, t: number): Box => ({
  left: lerp(a.left, b.left, t),
  top: lerp(a.top, b.top, t),
  width: lerp(a.width, b.width, t),
  height: lerp(a.height, b.height, t),
})

/**
 * Cuts a rounded window out of the cover. A clip-path repaints without
 * moving layout, so the intro does not count as layout shift (animating
 * left/top/width/height did).
 */
function cutWindow(el: HTMLElement, b: Box, radius: number) {
  const W = window.innerWidth
  const H = window.innerHeight
  const { left: x, top: y, width: w, height: h } = b
  const r = Math.max(0, Math.min(radius, w / 2, h / 2))
  const hole =
    w < 0.5 || h < 0.5
      ? ""
      : ` M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r}` +
        ` V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
        ` H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
        ` V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`
  el.style.clipPath = `path(evenodd, "M0 0 H${W} V${H} H0 Z${hole}")`
}

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
    const from: Box = { left: (vw - w) / 2, top: cy - h / 2, width: w, height: h }
    const to: Box = { left: box.left, top: box.top, width: box.width, height: box.height }
    overlayRef.current?.style.setProperty("--intro-y", `${cy}px`)
    const radius = parseFloat(getComputedStyle(card!).borderTopLeftRadius) || 28
    // The window opens from nothing in the middle before it holds.
    const seed: Box = {
      left: from.left + from.width / 2,
      top: from.top + from.height / 2,
      width: 0,
      height: 0,
    }
    animate(0, 1, {
      duration: 0.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (t) => cutWindow(hole, lerpBox(seed, from, t), 20),
    })

    let cancelled = false
    const timer = window.setTimeout(() => {
      setOpening(true)
      onReveal()
      animate(0, 1, {
        duration: OPEN_S,
        ease: open,
        onUpdate: (t) =>
          cutWindow(hole, lerpBox(from, to, t), lerp(20, radius, t)),
      })
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
      {/* The cover: page-coloured, with the window cut out of it. Before the
          first cut (server render) it covers the whole screen. */}
      <div ref={holeRef} className="absolute inset-0 bg-background" />

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
