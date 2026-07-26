"use client"

import { motion } from "motion/react"

export function AcademyHero() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-6 py-16 sm:px-8 sm:py-20 md:flex-row md:items-end md:justify-between md:gap-12 lg:px-0 lg:py-24">
      <motion.h1
        className="text-6xl font-medium tracking-tight sm:text-8xl lg:text-9xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Academy.
      </motion.h1>
      <motion.p
        className="max-w-96 text-left leading-relaxed text-muted-foreground md:text-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        Books, classes, and resources
        <br />
        built for scientists and engineers.
      </motion.p>
    </section>
  )
}
