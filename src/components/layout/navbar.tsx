"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"

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
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Insights" },
  { href: "/our-team", label: "Company" },
] as const

export function Navbar() {
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
          ? "dark border-white/10 bg-black/80 text-foreground backdrop-blur-xl"
          : scrolled
            ? "border-border bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Link
            href="/"
            aria-label="RantAI home"
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

          <nav aria-label="Main navigation" className="hidden md:block">
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
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <PillLink
            href={`mailto:${siteConfig.links.email}`}
            icon="external"
            className="h-9 px-4"
          >
            Contact us
          </PillLink>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="md:hidden"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="pr-14">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Explore RantAI products and company information.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col px-4"
              >
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="border-b border-border py-5 text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
