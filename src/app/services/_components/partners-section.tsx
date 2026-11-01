"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import type { PartnerItem } from "@/lib/partners"

// Proof: the teams we have built with, as a clean grid of logos.

const ease = [0.22, 1, 0.36, 1] as const

/** Partner logos are white artwork: shown black on light, white on dark. */
function Logo({
  partner,
  className,
  onDark,
}: Readonly<{ partner: PartnerItem; className?: string; onDark?: boolean }>) {
  return (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={240}
      height={160}
      className={cn(
        "w-auto object-contain brightness-0",
        onDark && "invert",
        className
      )}
    />
  )
}

/** Partner tiles: logos on light tiles, the work on hover, then a seat for the next team. */
function CleanGrid({ partners }: Readonly<{ partners: PartnerItem[] }>) {
  const reduce = useReducedMotion()
  const mail = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Partnering with RantAI")}`
  return (
    <div className="mt-14">
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {partners.map((p, i) => (
          <motion.li
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease, delay: i * 0.08 }}
            className="group relative grid aspect-[16/9] place-items-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/[0.05] transition-colors duration-300 hover:bg-white hover:ring-black/10"
          >
            <Logo
              partner={p}
              className="h-28 opacity-80 transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-95 group-hover:opacity-100"
            />
            {/* What we built slides up on hover */}
            <span className="absolute inset-x-0 bottom-0 translate-y-full px-5 pb-4 text-center text-[13px] text-neutral-500 transition-transform duration-500 ease-out group-hover:translate-y-0">
              {p.showcase.name}
            </span>
          </motion.li>
        ))}
        <motion.li
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease, delay: partners.length * 0.08 }}
          className="aspect-[16/9]"
        >
          <a
            href={mail}
            className="group flex size-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            <span className="grid size-10 place-items-center rounded-full border border-current text-xl leading-none transition-transform duration-300 group-hover:rotate-90">
              +
            </span>
            <span className="text-[14px] font-medium">Your team next</span>
          </a>
        </motion.li>
      </ul>
      {/* Empty seats, fading away */}
      <div
        aria-hidden="true"
        className="mt-2 grid grid-cols-2 gap-2 [mask-image:linear-gradient(to_bottom,black,transparent)] lg:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "aspect-[16/7] rounded-xl bg-neutral-100",
              i > 1 && "hidden lg:block"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function PartnersSection({
  partners,
  eyebrow = "Partners",
}: Readonly<{ partners: PartnerItem[]; eyebrow?: string }>) {
  return (
    <section
      id="proof"
      aria-labelledby="partners-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow className="text-muted-foreground">{eyebrow}</Eyebrow>
          <SplitReveal
            id="partners-heading"
            text={"Teams we've\nbuilt with."}
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
          />
        </div>
        <p className="max-w-sm text-[16px] leading-relaxed text-neutral-500 lg:pb-2">
          From research labs to investment firms, we build the systems they run
          on, on their own infrastructure.
        </p>
      </div>
      <CleanGrid partners={partners} />
    </section>
  )
}
