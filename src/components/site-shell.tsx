import { Footer, type FooterCta } from "@/components/footer"
import { Navbar } from "@/components/navbar"

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
      {announcement}
      <Navbar />
      <main>{children}</main>
      <Footer cta={cta} />
    </div>
  )
}
