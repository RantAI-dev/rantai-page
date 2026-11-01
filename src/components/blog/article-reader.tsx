"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "motion/react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import type { ArticleHeading } from "@/lib/blog/article-html"
import { smoothScrollTo } from "@/components/layout/smooth-scroll"
import { cn } from "@/lib/utils"

// Space kept above a heading when we land on it (fixed navbar + breathing room).
const OFFSET = 96

function TocList({
  headings,
  active,
  indicator,
  roomy,
}: Readonly<{
  headings: ArticleHeading[]
  active: string | null
  indicator?: boolean
  /** Taller rows, for the tap-friendly dropdown on phones and tablets. */
  roomy?: boolean
}>) {
  return (
    <ul className="relative space-y-0.5 border-l border-neutral-200">
      {headings.map((h) => {
        const on = h.id === active
        return (
          <li key={h.id} className="relative">
            {indicator && on && (
              <motion.span
                layoutId="toc-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
                className="absolute top-0 bottom-0 -left-px w-[2px] rounded-full bg-neutral-950"
              />
            )}
            <a
              href={`#${h.id}`}
              data-toc
              aria-current={on ? "location" : undefined}
              className={cn(
                "block pr-2 leading-snug transition-colors duration-200",
                roomy ? "py-2.5 text-[14.5px]" : "py-1.5 text-[13.5px]",
                h.level === 3 ? "pl-7" : "pl-4",
                on
                  ? "text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-950"
              )}
            >
              <span className="line-clamp-2">{h.text}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The reading frame around an article: a progress bar along the top, a
 * table of contents that follows the section you're on, heading links that
 * update the URL, and copy buttons on code blocks.
 */
export function ArticleReader({
  headings,
  header,
  children,
}: Readonly<{
  headings: ArticleHeading[]
  header: React.ReactNode
  children: React.ReactNode
}>) {
  const t = useTranslations("blog.article")
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ["start 30%", "end end"],
  })

  // The section being read: the last heading that has passed the top area.
  useEffect(() => {
    if (headings.length === 0) return
    const update = () => {
      let current: string | null = null
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (el && el.getBoundingClientRect().top <= OFFSET + 40) current = h.id
      }
      // At the very end the last headings can't reach the top: pick the last.
      const body = bodyRef.current?.getBoundingClientRect()
      if (body && body.bottom <= window.innerHeight + 4) {
        current = headings[headings.length - 1].id
      }
      setActive(current ?? headings[0].id)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [headings])

  // Opening /blog/post#section: land on that heading once images settle.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const el = id ? document.getElementById(id) : null
    if (!el || !rootRef.current?.contains(el)) return
    const timer = setTimeout(() => {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - OFFSET,
        behavior: "instant",
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Clicks inside the article: section links and copy buttons.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const timers = new Set<ReturnType<typeof setTimeout>>()

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const link = target.closest<HTMLAnchorElement>(
        "a.heading-anchor, a[data-toc]"
      )
      if (link) {
        const id = decodeURIComponent(link.hash.slice(1))
        const el = document.getElementById(id)
        if (!el) return
        e.preventDefault()
        e.stopPropagation() // Lenis would handle it again without the URL
        smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - OFFSET)
        window.history.replaceState(window.history.state, "", `#${id}`)
        link.closest("details")?.removeAttribute("open")
        return
      }

      const copy = target.closest<HTMLButtonElement>("button[data-copy]")
      if (copy) {
        const code =
          copy.closest(".code-frame")?.querySelector("pre")?.innerText ?? ""
        void navigator.clipboard?.writeText(code).then(() => {
          copy.textContent = t("copied")
          copy.setAttribute("data-copied", "")
          const timer = setTimeout(() => {
            copy.textContent = t("copy")
            copy.removeAttribute("data-copied")
            timers.delete(timer)
          }, 1600)
          timers.add(timer)
        })
      }
    }

    root.addEventListener("click", onClick)
    return () => {
      root.removeEventListener("click", onClick)
      timers.forEach(clearTimeout)
    }
  }, [t])

  const hasToc = headings.length > 1

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-brand-1"
      />
      <div
        ref={rootRef}
        className={cn(
          "mx-auto grid max-w-[1120px] px-5 sm:px-8",
          hasToc && "lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-x-20"
        )}
      >
        <div className="min-w-0">{header}</div>
        {hasToc && <div className="hidden lg:block" />}

        <div ref={bodyRef} className="min-w-0">
          {hasToc && (
            <details className="group mt-8 rounded-xl bg-neutral-100 sm:mt-10 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-medium [&::-webkit-details-marker]:hidden">
                {t("onThisPage")}
                <ChevronDown className="size-4 text-neutral-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-2 pb-3">
                <TocList headings={headings} active={active} roomy />
              </div>
            </details>
          )}
          {children}
        </div>

        {hasToc && (
          <div className="hidden lg:block">
            <nav aria-label={t("onThisPage")} className="sticky top-28 pt-12">
              <p className="mb-4 text-[12px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
                {t("onThisPage")}
              </p>
              <div className="max-h-[calc(100svh-14rem)] overflow-y-auto [scrollbar-width:none]">
                <TocList headings={headings} active={active} indicator />
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
