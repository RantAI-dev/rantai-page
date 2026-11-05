"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

type Item = { q: string; a: string }

/**
 * Common questions, as a quiet accordion: the title on the left, the
 * questions on the right (stacked on phones). One answer opens at a time.
 * Text comes from `contact.faq`. `ask` adds a link to the contact page.
 */
export function Faq({
  ask = true,
  className,
}: Readonly<{ ask?: boolean; className?: string }>) {
  const t = useTranslations("contact.faq")
  const items = t.raw("items") as Item[]
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()
  const id = useId()

  return (
    <section
      id="faq"
      aria-labelledby={`${id}-title`}
      className={cn(
        "mx-auto grid max-w-[1440px] scroll-mt-20 gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-14 lg:py-32 xl:gap-24",
        className
      )}
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
        <SplitReveal
          as="h2"
          id={`${id}-title`}
          text={t("title")}
          className="mt-5 text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1] font-medium tracking-[-0.045em] whitespace-pre-line text-neutral-950"
        />
        {ask && (
          <p className="mt-6 text-[15px] text-neutral-500 max-lg:hidden">
            {t("more")}{" "}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1 font-medium text-neutral-900"
            >
              {t("ask")}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        )}
      </div>

      <div>
        <ul className="border-t border-neutral-200">
          {items.map((item, i) => {
            const on = open === i
            return (
              <li key={item.q} className="border-b border-neutral-200">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={on}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.01em] text-neutral-950 sm:py-6 sm:text-[19px]"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full transition-[background-color,color,rotate] duration-300",
                        on
                          ? "rotate-45 bg-neutral-950 text-white"
                          : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`${id}-a${i}`}
                      role="region"
                      aria-labelledby={`${id}-q${i}`}
                      className="overflow-hidden"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <p className="max-w-2xl pr-12 pb-6 text-[15px] leading-relaxed text-pretty text-neutral-600 sm:text-[16px]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
        {ask && (
          <p className="mt-8 text-[15px] text-neutral-500 lg:hidden">
            {t("more")}{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-medium text-neutral-900"
            >
              {t("ask")}
              <ArrowRight className="size-3.5" />
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
