"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"
import { useDesktopMotion } from "@/hooks/use-desktop-motion"

let activeLenis: Lenis | null = null

/** Smoothly scrolls to `y`, through Lenis when it is running. */
export function smoothScrollTo(y: number, duration = 0.9) {
  if (activeLenis) activeLenis.scrollTo(y, { duration })
  else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" })
  }
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
