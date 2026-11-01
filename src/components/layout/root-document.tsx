import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "@/app/globals.css"
import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// The <html> shell shared by the two root layouts: the public site
// (app/[locale]) and the CMS (app/(cms)).

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

/** Metadata both root layouts start from. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "RantAI",
    "AI Products",
    "Enterprise AI",
    "AI Engineering",
    "Indonesia",
  ],
  authors: [{ name: "RantAI", url: "https://www.rantai.dev" }],
  creator: "RantAI",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: { title: "RantAI" },
  alternates: {
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
}

/** Viewport settings both root layouts export. */
export const baseViewport: Viewport = { themeColor: META_THEME_COLORS.light }

export function RootDocument({
  lang,
  children,
}: Readonly<{ lang: string; children: React.ReactNode }>) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", geist.variable)}
    >
      <body>
        <NuqsAdapter>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
