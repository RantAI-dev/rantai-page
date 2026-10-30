"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"

const ease = [0.22, 1, 0.36, 1] as const
const curtain = [0.76, 0, 0.24, 1] as const
const HOLD_MS = 1500
const STORAGE_KEY = "rantai-intro"

const pixels = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 2 },
] as const

export function PageIntro({
  onReveal,
  onDone,
}: Readonly<{ onReveal: () => void; onDone: () => void }>) {
  const [lifting, setLifting] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1"
    } catch {}

    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReveal()
      onDone()
      return
    }

    const timeout = window.setTimeout(() => {
      setLifting(true)
      onReveal()
    }, HOLD_MS)
    return () => window.clearTimeout(timeout)
  }, [onReveal, onDone])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex animate-[intro-failsafe_0.3s_ease_4s_forwards] items-center justify-center overflow-hidden rounded-b-[32px] bg-black text-white"
      initial={{ y: 0 }}
      animate={{ y: lifting ? "-100%" : 0 }}
      transition={{ duration: 0.9, ease: curtain }}
      onAnimationComplete={() => {
        if (!lifting) return
        try {
          sessionStorage.setItem(STORAGE_KEY, "1")
        } catch {}
        onDone()
      }}
    >
      <motion.div
        className="flex items-center gap-5 sm:gap-7"
        animate={lifting ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="relative size-10 sm:size-14">
          {pixels.map((pixel, index) => (
            <motion.span
              key={index}
              className="absolute size-1/3 bg-brand-1"
              style={{ left: `${pixel.x * 33.333}%`, top: `${pixel.y * 33.333}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.15 + index * 0.12 }}
            />
          ))}
        </div>
        <span className="flex overflow-hidden text-[clamp(3rem,9vw,7rem)] leading-none font-medium tracking-[-0.05em]">
          {Array.from("RantAI").map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease, delay: 0.35 + index * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </motion.div>

      <motion.span
        className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 overflow-hidden bg-white/15"
        animate={lifting ? { opacity: 0 } : { opacity: 1 }}
      >
        <motion.span
          className="absolute inset-0 origin-left bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: HOLD_MS / 1000, ease: "easeInOut" }}
        />
      </motion.span>
    </motion.div>
  )
}
