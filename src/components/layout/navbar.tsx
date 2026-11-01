"use client"

import Image from "next/image"
import { MenuIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Link, usePathname } from "@/i18n/navigation"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

import { PillLink } from "@/components/shared/pill-link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/academy", key: "academy" },
  { href: "/blog", key: "insights" },
  { href: "/our-team", key: "company" },
] as const

export function Navbar() {
  const t = useTranslations("common.nav")
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [overDark, setOverDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
      // Go dark while a full-bleed dark section sits under the bar.
      const under = [
        ...document.querySelectorAll<HTMLElement>("[data-nav-dark]"),
      ].some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= 64 && r.bottom >= 32
      })
      setOverDark(under)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("nav-theme", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("nav-theme", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500",
        overDark
          ? "dark border-white/10 bg-black text-foreground md:bg-black/80 md:backdrop-blur-xl"
          : scrolled
            ? "border-border bg-background md:bg-background/85 md:backdrop-blur-xl"
            : "border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Link
            href="/"
            aria-label={t("home")}
            className="flex shrink-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-75"
          >
            <Image
              src="/rant-ai.png"
              alt=""
              width={36}
              height={36}
              className={cn(
                "size-7 transition-[filter] duration-500",
                overDark && "brightness-0 invert"
              )}
              priority
            />
            <span className="text-[19px] font-semibold tracking-[-0.03em]">
              RantAI
            </span>
          </Link>

          <nav aria-label={t("main")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="rounded-full px-3.5 py-2 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:flex" />
          <PillLink
            href={`mailto:${siteConfig.links.email}`}
            icon="external"
            className="h-10 px-4 lg:h-9"
          >
            {t("contactUs")}
          </PillLink>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("open")}
                className="-mr-2 size-10 lg:hidden"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              closeLabel={t("close")}
              className="[&>[data-slot=sheet-close]]:top-2 [&>[data-slot=sheet-close]]:right-2 [&>[data-slot=sheet-close]]:size-10"
            >
              <SheetHeader className="pr-14">
                <SheetTitle>{t("sheetTitle")}</SheetTitle>
                <SheetDescription>{t("sheetDescription")}</SheetDescription>
              </SheetHeader>
              <nav
                aria-label={t("mobile")}
                className="flex flex-1 flex-col px-4"
              >
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-14 items-center border-b border-border text-lg font-medium"
                    >
                      {t(item.key)}
                    </Link>
                  </SheetClose>
                ))}
                <LanguageSwitcher size="lg" className="mt-8 self-start" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
