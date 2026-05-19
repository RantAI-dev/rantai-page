"use client"

import { motion } from "motion/react"

export function BlogHero() {
  return (
    <section className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-24 lg:px-0">
      <motion.h1
        className="text-6xl font-medium tracking-tight sm:text-8xl lg:text-9xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Blog.
      </motion.h1>
      <motion.p
        className="max-w-96 text-right leading-relaxed text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        Updates, releases, and insights
        <br />
        from the RantAI team.
      </motion.p>
    </section>
  )
}
