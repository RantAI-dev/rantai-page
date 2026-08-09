"use client"

import { Fragment, memo, useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import CountUp from "@/components/CountUp"
import { Separator } from "@/components/ui/separator"

const stats = [
  { value: 3, duration: 0.8, label: "Enterprise AI Platforms" },
  { value: 100, duration: 0.5, suffix: "+", label: "LLM Models Supported" },
  { value: 10, duration: 1.2, label: "Published AI Books" },
] as const

export const StatsSection = memo(function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const reduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex w-full justify-center bg-transparent px-4 pt-24 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-12 md:flex-row md:gap-0">
        {stats.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="hidden md:block"
                />
                <Separator className="block max-w-32 md:hidden" />
              </>
            )}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 26, filter: "blur(6px)" }
              }
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : undefined
              }
              transition={{
                duration: 0.65,
                delay: reduceMotion ? 0 : index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="flex w-full shrink-0 flex-col items-center justify-center gap-2 text-center md:w-75"
            >
              <p className="text-5xl font-medium tracking-tight text-white md:text-[56px]">
                {reduceMotion ? (
                  stat.value
                ) : (
                  <CountUp
                    to={stat.value}
                    duration={stat.duration}
                    delay={index * 0.08}
                    startWhen={isInView}
                  />
                )}
                {"suffix" in stat ? stat.suffix : null}
              </p>
              <p className="font-mono text-base font-light text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          </Fragment>
        ))}
      </div>
    </section>
  )
})
