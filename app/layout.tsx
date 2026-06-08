import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { META_THEME_COLORS, siteConfig } from "@/lib/config";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
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
  authors: [
    {
      name: "RantAI",
      url: "https://www.rantai.dev",
    },
  ],
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
  appleWebApp: {
    title: "RantAI",
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <meta name="theme-color" content={META_THEME_COLORS.dark} />
        <meta name="apple-mobile-web-app-title" content="RantAI" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
