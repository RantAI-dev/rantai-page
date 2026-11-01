import { Footer, type FooterCta } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { SmoothScroll } from "@/components/layout/smooth-scroll"

export function SiteShell({
  children,
  announcement,
  cta,
}: Readonly<{
  children: React.ReactNode
  announcement?: React.ReactNode
  cta?: FooterCta
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SmoothScroll />
      {/* Keyboard and screen-reader users can jump past the navigation */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-neutral-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      {announcement && <aside aria-label="Announcement">{announcement}</aside>}
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer cta={cta} />
    </div>
  )
}
