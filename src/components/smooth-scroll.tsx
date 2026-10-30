"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: { offset: -80 },
    })

    return () => lenis.destroy()
  }, [])

  return null
}
