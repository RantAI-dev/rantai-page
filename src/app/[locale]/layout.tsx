import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { routing } from "@/i18n/routing"
import {
  baseMetadata,
  baseViewport,
  RootDocument,
} from "@/components/layout/root-document"
import { LanguageSuggestion } from "@/components/layout/language-suggestion"

// Root layout for the public site, once per language: / (English) and /id.

export const viewport = baseViewport

export const metadata: Metadata = baseMetadata

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  // Lets pages under this layout render statically.
  setRequestLocale(locale)

  return (
    <RootDocument lang={locale}>
      <NextIntlClientProvider>
        {children}
        <LanguageSuggestion />
      </NextIntlClientProvider>
    </RootDocument>
  )
}
