"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"

let activeLenis: Lenis | null = null

/** Scrolls to the top, through Lenis when it is running. */
export function scrollToTop() {
  if (activeLenis) activeLenis.scrollTo(0)
  else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

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
  }, [])

  return null
}
