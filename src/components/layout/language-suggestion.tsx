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
          className="fixed bottom-4 left-4 z-[90] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl bg-white py-2.5 pr-2 pl-3.5 text-neutral-950 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07] sm:bottom-6 sm:left-6"
        >
          <Languages className="size-4 shrink-0 text-neutral-500" aria-hidden />
          <p className="text-[14px]">Tersedia dalam Bahasa Indonesia</p>
          <Link
            href={pathname}
            locale="id"
            hrefLang="id"
            onClick={() => remember("id")}
            className="shrink-0 rounded-full bg-neutral-950 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Lihat
          </Link>
          <button
            type="button"
            onClick={() => remember("en")}
            aria-label="Tutup, tetap dalam bahasa Inggris"
            className="grid size-8 shrink-0 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X className="size-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
