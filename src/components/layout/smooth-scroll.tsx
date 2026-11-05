"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"
import { useDesktopMotion } from "@/hooks/use-desktop-motion"

let activeLenis: Lenis | null = null

let glide = 0

/**
 * Without Lenis (phones), glides there frame by frame: native smooth
 * scrolling is not reliable everywhere. A touch or wheel stops it.
 */
function glideTo(y: number, duration: number) {
  cancelAnimationFrame(glide)
  const from = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  const to = Math.max(0, Math.min(max, y))
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce || Math.abs(to - from) < 2) {
    window.scrollTo(0, to)
    return
  }
  const stop = () => {
    cancelAnimationFrame(glide)
    window.removeEventListener("touchstart", stop)
    window.removeEventListener("wheel", stop)
  }
  window.addEventListener("touchstart", stop, { passive: true })
  window.addEventListener("wheel", stop, { passive: true })
  const start = performance.now()
  const ms = duration * 1000
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / ms)
    // A soft ease in and out, so the middle of a long trip doesn't rush
    const k = (1 - Math.cos(Math.PI * t)) / 2
    window.scrollTo(0, from + (to - from) * k)
    if (t < 1) glide = requestAnimationFrame(tick)
    else stop()
  }
  glide = requestAnimationFrame(tick)
}

/** Smoothly scrolls to `y`, through Lenis when it is running. */
export function smoothScrollTo(y: number, duration = 0.9) {
  if (activeLenis) activeLenis.scrollTo(y, { duration })
  else glideTo(y, duration)
}

/** Scrolls to the top, through Lenis when it is running. */
export function scrollToTop() {
  if (activeLenis) activeLenis.scrollTo(0)
  else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }
}

export function SmoothScroll() {
  const desktopMotion = useDesktopMotion()

  useEffect(() => {
    if (!desktopMotion) return

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: { offset: -80 },
    })
    activeLenis = lenis

    return () => {
      lenis.destroy()
      if (activeLenis === lenis) activeLenis = null
    }
  }, [desktopMotion])

  return null
}
