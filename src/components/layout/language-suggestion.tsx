"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Languages, X } from "lucide-react"
import { useLocale } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { LOCALE_CHOICE_KEY } from "@/components/layout/language-switcher"

/**
 * Offers the Indonesian site to visitors whose browser prefers Indonesian,
 * instead of redirecting them (redirecting by language confuses search
 * engines and visitors who chose English on purpose). Shown once: picking a
 * language or closing it is remembered. Written in Indonesian, since that is
 * who sees it.
 */
export function LanguageSuggestion() {
  const locale = useLocale()
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (locale !== "en") return
    let chosen: string | null = null
    try {
      chosen = localStorage.getItem(LOCALE_CHOICE_KEY)
    } catch {}
    if (chosen) return
    const prefersIndonesian = (navigator.languages ?? [navigator.language])
      .slice(0, 3)
      .some((l) => /^(id|in)\b/i.test(l))
    if (!prefersIndonesian) return
    const t = setTimeout(() => setOpen(true), 1500)
    return () => clearTimeout(t)
  }, [locale])

  const remember = (choice: string) => {
    try {
      localStorage.setItem(LOCALE_CHOICE_KEY, choice)
    } catch {}
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          lang="id"
          aria-label="Pilihan bahasa"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[90] flex items-center gap-1.5 rounded-2xl bg-white py-2 pr-1 pl-3.5 text-neutral-950 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07] sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-[calc(100vw-2rem)] sm:gap-3 sm:py-2.5 sm:pr-2 sm:pl-3.5"
        >
          <Languages
            className="size-4 shrink-0 text-neutral-500 max-sm:hidden"
            aria-hidden
          />
          <p className="min-w-0 flex-1 text-[13.5px] sm:flex-initial sm:text-[14px]">
            Tersedia dalam Bahasa Indonesia
          </p>
          <Link
            href={pathname}
            locale="id"
            hrefLang="id"
            onClick={() => remember("id")}
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-neutral-950 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 sm:h-auto sm:px-3.5 sm:py-1.5"
          >
            Lihat
          </Link>
          <button
            type="button"
            onClick={() => remember("en")}
            aria-label="Tutup, tetap dalam bahasa Inggris"
            className="grid size-10 shrink-0 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 sm:size-8"
          >
            <X className="size-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
