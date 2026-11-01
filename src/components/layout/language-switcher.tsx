"use client"

import { useLocale, useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "rantai-locale-choice"

/**
 * EN · ID toggle. Links to the same page in the other language and remembers
 * the choice, so the "available in Indonesian" suggestion stops appearing.
 */
export function LanguageSwitcher({
  className,
  size = "sm",
}: Readonly<{ className?: string; size?: "sm" | "lg" }>) {
  const t = useTranslations("common.language")
  const locale = useLocale() as Locale
  const pathname = usePathname()

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "flex items-center rounded-full bg-foreground/[0.06] p-0.5",
        className
      )}
    >
      {routing.locales.map((l) => {
        const current = l === locale
        return (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            aria-current={current ? "true" : undefined}
            aria-label={current ? t(l) : t("switchTo", { language: t(l) })}
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, l)
              } catch {}
            }}
            className={cn(
              "rounded-full font-medium transition-colors",
              size === "lg" ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs",
              current
                ? "bg-background text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                : "text-foreground/55 hover:text-foreground"
            )}
          >
            {t(`short.${l}`)}
          </Link>
        )
      })}
    </nav>
  )
}

export { STORAGE_KEY as LOCALE_CHOICE_KEY }
