import { Footer, type FooterCta } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SmoothScroll } from "@/components/smooth-scroll"

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
      {announcement}
      <Navbar />
      <main>{children}</main>
      <Footer cta={cta} />
    </div>
  )
}
