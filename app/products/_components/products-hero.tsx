"use client"

import { motion } from "motion/react"

export function ProductsHero() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-8 py-24 sm:flex-row sm:items-end sm:justify-between lg:px-0">
      <motion.h1
        className="text-6xl font-medium tracking-tight sm:text-8xl lg:text-9xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Products.
      </motion.h1>
      <motion.p
        className="max-w-xs font-mono leading-relaxed text-muted-foreground sm:text-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        Built for the enterprise.
        <br />
        Deployed in days, not months.
      </motion.p>
    </section>
  )
}
