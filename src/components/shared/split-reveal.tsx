"use client"

import { Fragment } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

type Tag = "h1" | "h2" | "h3" | "p" | "span"

const ease = [0.22, 1, 0.36, 1] as const

const unitVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(10px)" },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
  exit: {
    opacity: 0,
    y: "-0.3em",
    filter: "blur(10px)",
    transition: { duration: 0.35, ease },
  },
}

export function SplitReveal({
  text,
  as = "h2",
  by = "word",
  trigger = "view",
  play = true,
  delay = 0,
  stagger,
  className,
  id,
}: Readonly<{
  text: string
  as?: Tag
  by?: "word" | "char"
  trigger?: "view" | "mount"
  play?: boolean
  delay?: number
  stagger?: number
  className?: string
  id?: string
}>) {
  const reduce = Boolean(useReducedMotion())
  const MotionTag = motion[as] as typeof motion.h2
  const step = stagger ?? (by === "char" ? 0.018 : 0.06)
  const containerVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: step, delayChildren: delay } },
    exit: { transition: { staggerChildren: step / 2 } },
  }
  // A "\n" in the text forces a line break from the sm breakpoint up.
  const lines = text.split("\n").map((line) => line.trim().split(" "))
  const label = text.replace(/\s*\n\s*/g, " ")

  return (
    <MotionTag
      id={id}
      aria-label={label}
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      exit={reduce ? undefined : "exit"}
      {...(trigger === "mount"
        ? { animate: play ? "shown" : "hidden" }
        : { whileInView: "shown", viewport: { once: true, amount: 0.4 } })}
    >
      {lines.map((words, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && (
            <>
              {" "}
              <br className="hidden sm:block" />
            </>
          )}
          {words.map((word, wordIndex) => (
            <Fragment key={`${word}-${wordIndex}`}>
              <span
                aria-hidden="true"
                className="inline-block whitespace-nowrap"
              >
                {by === "word" ? (
                  <motion.span className="inline-block" variants={unitVariants}>
                    {word}
                  </motion.span>
                ) : (
                  Array.from(word).map((char, charIndex) => (
                    <motion.span
                      key={`${char}-${charIndex}`}
                      className="inline-block"
                      variants={unitVariants}
                    >
                      {char}
                    </motion.span>
                  ))
                )}
              </span>
              {wordIndex < words.length - 1 && " "}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </MotionTag>
  )
}
