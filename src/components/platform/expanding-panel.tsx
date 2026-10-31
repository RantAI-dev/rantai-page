"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

/**
 * A dark panel that grows to the full width of the screen as it scrolls into
 * place (the side gutters and rounded corners melt away), then settles back
 * into a card as it scrolls out.
 */
export function ExpandingPanel({
  children,
  id,
  className,
  "aria-labelledby": labelledBy,
}: Readonly<{
  children: React.ReactNode
  id?: string
  className?: string
  "aria-labelledby"?: string
}>) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [gutter, setGutter] = useState(16)

  useEffect(() => {
    const q = window.matchMedia("(min-width: 640px)")
    const update = () => setGutter(q.matches ? 16 : 12)
    update()
    q.addEventListener("change", update)
    return () => q.removeEventListener("change", update)
  }, [])

  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  })
  // JS copies: mapped straight onto styles, motion may use a native scroll
  // timeline that mis-measures the sticky content inside.
  const open = useMotionValue(0)
  useEffect(() => {
    const update = () => {
      const k = Math.min(
        Math.min(1, Math.max(0, (enter.get() - 0.5) / 0.5)),
        1 - Math.min(1, Math.max(0, exit.get() / 0.5))
      )
      open.set(k * k * (3 - 2 * k))
      // Tell the navbar to go dark once the panel is (nearly) full width.
      const el = ref.current
      const dark = k > 0.9
      if (el && el.hasAttribute("data-nav-dark") !== dark) {
        el.toggleAttribute("data-nav-dark", dark)
        window.dispatchEvent(new Event("nav-theme"))
      }
    }
    update()
    const a = enter.on("change", update)
    const b = exit.on("change", update)
    return () => {
      a()
      b()
    }
  }, [enter, exit, open])

  const padding = useTransform(open, (k) =>
    reduce ? gutter : gutter * (1 - k)
  )
  const radius = useTransform(open, (k) => (reduce ? 28 : 28 * (1 - k)))

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <motion.div
        className="dark overflow-clip bg-black text-white"
        style={{ borderRadius: radius }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
