import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { languageAlternates, localizedPath } from "@/i18n/paths"
import { routing, type Locale } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"

const ogLocale: Record<Locale, string> = { en: "en_US", id: "id_ID" }

/**
 * Metadata for a public page in one language: title, description, canonical
 * URL, hreflang alternates and the tags link previews use (Open Graph, X).
 * Text comes from messages/<locale>/metadata.json under `page`; the preview
 * image comes from the route's `opengraph-image.tsx`.
 */
export async function pageMetadata({
  locale,
  page,
  path,
  absoluteTitle,
}: {
  locale: Locale
  /** Key in metadata.json, e.g. "products". */
  page: string
  /** Path from the site root in English, e.g. "/products". */
  path: string
  /** Use the title as is, without the site name (the home page). */
  absoluteTitle?: boolean
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" })
  const title = t(`${page}.title`)
  const description = t(`${page}.description`)
  const fullTitle = absoluteTitle ? title : `${title} - ${siteConfig.name}`
  const url = localizedPath(locale, path)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale[l]),
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
