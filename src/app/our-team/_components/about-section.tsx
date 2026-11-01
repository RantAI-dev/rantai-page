"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"

import { Eyebrow } from "@/components/shared/eyebrow"
import { ProductTile } from "@/components/shared/product-logo"
import { SplitReveal } from "@/components/shared/split-reveal"
import { cn } from "@/lib/utils"

// "Who we are": four facts, each counted from real data and shown with a
// small picture of what it counts.

const ease = [0.22, 1, 0.36, 1] as const

function CountUp({ to }: Readonly<{ to: number }>) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const value = useMotionValue(reduce ? to : 0)
  const text = useTransform(value, (v) => Math.round(v).toString())

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(value, to, { duration: 1.4, ease })
    return () => controls.stop()
  }, [inView, reduce, to, value])

  return <motion.span ref={ref}>{text}</motion.span>
}

function People({ photos, extra }: Readonly<{ photos: string[]; extra: number }>) {
  return (
    <div className="flex">
      {photos.map((src, i) => (
        <span
          key={src}
          className="relative -ml-3 size-14 overflow-hidden rounded-full bg-neutral-800 ring-[3px] ring-neutral-100 transition-[margin] duration-500 ease-out group-hover:ml-1 first:ml-0"
          style={{ zIndex: 10 - i }}
        >
          <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" unoptimized />
        </span>
      ))}
      {extra > 0 && (
        <span className="relative -ml-3 grid size-14 place-items-center rounded-full bg-white text-[13px] font-medium text-neutral-500 ring-[3px] ring-neutral-100 transition-[margin] duration-500 ease-out group-hover:ml-1">
          +{extra}
        </span>
      )}
    </div>
  )
}

function Products() {
  const ids = ["agents", "claw", "llmops", "lake"] as const
  return (
    <div className="grid grid-cols-2 gap-2 transition-[gap] duration-500 ease-out group-hover:gap-3">
      {ids.map((id) => (
        <ProductTile key={id} id={id} className="size-14 rounded-xl" logoClassName="h-7" />
      ))}
    </div>
  )
}

function Books({ covers }: Readonly<{ covers: string[] }>) {
  const tilt = ["-rotate-[9deg] group-hover:-rotate-[14deg] group-hover:-translate-x-3", "z-10 group-hover:-translate-y-2", "rotate-[9deg] group-hover:rotate-[14deg] group-hover:translate-x-3"]
  return (
    <div className="flex items-end">
      {covers.slice(0, 3).map((src, i) => (
        <span
          key={src}
          className={cn(
            "relative -mx-2 aspect-[2/3] w-[68px] origin-bottom overflow-hidden rounded-l-[2px] rounded-r-[4px] bg-neutral-200 shadow-[0_14px_24px_-14px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out",
            tilt[i]
          )}
        >
          <Image src={src} alt="" fill sizes="68px" className="object-cover" />
        </span>
      ))}
    </div>
  )
}

/** Logos become small white cards on hover, one after another. */
function Partners({ logos }: Readonly<{ logos: string[] }>) {
  return (
    <div className="flex flex-col items-center gap-1 transition-[gap] duration-500 ease-out group-hover:gap-2">
      {logos.slice(0, 3).map((src, i) => (
        <span
          key={src}
          className="grid h-12 w-[150px] place-items-center rounded-xl ring-1 ring-transparent transition-[background-color,box-shadow,transform] duration-500 ease-out group-hover:bg-white group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.08)] group-hover:ring-black/[0.06]"
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <Image
            src={src}
            alt=""
            width={160}
            height={60}
            className="h-10 w-auto max-w-[120px] object-contain opacity-70 brightness-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        </span>
      ))}
    </div>
  )
}

export function AboutSection({
  people,
  photos,
  bookCount,
  covers,
  partnerLogos,
}: Readonly<{
  people: number
  photos: string[]
  bookCount: number
  covers: string[]
  partnerLogos: string[]
}>) {
  const reduce = useReducedMotion()
  const shown = photos.slice(0, 4)
  const facts = [
    { n: people, label: "People building", visual: <People photos={shown} extra={people - shown.length} /> },
    { n: 4, label: "Products we run", visual: <Products /> },
    { n: bookCount, label: "Books written", visual: <Books covers={covers} /> },
    { n: partnerLogos.length, label: "Teams we've built with", visual: <Partners logos={partnerLogos} /> },
  ]

  return (
    <section
      id="who-we-are"
      aria-labelledby="about-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow className="text-muted-foreground">Who we are</Eyebrow>
          <SplitReveal
            id="about-heading"
            text={"Small team.\nSerious systems."}
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
          />
        </div>
        <p className="max-w-sm text-[16px] leading-relaxed text-neutral-500 lg:pb-2">
          An AI company from Indonesia. We build the products, the systems, and
          the books, so teams can run AI in production.
        </p>
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <motion.li
            key={f.label}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease, delay: i * 0.08 }}
            className="group flex flex-col rounded-2xl bg-neutral-100 p-3"
          >
            <div className="grid h-[150px] place-items-center sm:h-[190px]">
              <div className="scale-[0.68] sm:scale-100">{f.visual}</div>
            </div>
            <div className="px-2 pt-2 pb-1 sm:px-3">
              <p className="text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.04em] text-neutral-950 tabular-nums">
                <CountUp to={f.n} />
              </p>
              <p className="mt-2 text-[14px] text-neutral-600">{f.label}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
