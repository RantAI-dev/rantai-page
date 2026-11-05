"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A sideways-scrolling row that also drifts along as the page scrolls past
 * it, so visitors see it can be swiped. Once they touch it, it's theirs:
 * the drift stops and snapping comes back.
 */
export function ScrollDrivenRow({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  const ref = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()
  const [taken, setTaken] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const el = ref.current
    if (!el || taken || reduce) return
    // Over the middle of the pass, drift about two screens' width: roughly
    // the speed of the page scroll, enough to show there is more.
    const t = Math.min(1, Math.max(0, (p - 0.15) / 0.7))
    const distance = Math.min(
      el.scrollWidth - el.clientWidth,
      el.clientWidth * 2
    )
    el.scrollLeft = t * distance
  })

  useEffect(() => {
    const el = ref.current
    if (!el || taken) return
    const take = () => setTaken(true)
    el.addEventListener("pointerdown", take, { passive: true })
    el.addEventListener("touchstart", take, { passive: true })
    return () => {
      el.removeEventListener("pointerdown", take)
      el.removeEventListener("touchstart", take)
    }
  }, [taken])

  return (
    <ul
      ref={ref}
      className={cn(
        className,
        // Snapping would fight the drift, so it only applies once taken.
        !taken && !reduce && "snap-none"
      )}
    >
      {children}
    </ul>
  )
}
