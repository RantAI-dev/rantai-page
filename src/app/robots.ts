import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The CMS, its previews, sign-in and API stay out of search results.
      disallow: ["/admin", "/login", "/api"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
