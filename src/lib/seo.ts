import type { Metadata } from "next"

import { siteConfig } from "@/lib/config"

/**
 * Metadata for a public page: title, description, canonical URL and the
 * tags link previews use (Open Graph, X). The preview image comes from the
 * route's `opengraph-image.tsx`.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: {
  /** Page name; the layout adds " - RantAI". */
  title: string
  description: string
  /** Path from the site root, e.g. "/products". */
  path: string
  /** Use the title as is, without the site name (the home page). */
  absoluteTitle?: boolean
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} - ${siteConfig.name}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  }
}
