import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog/posts"
import { siteConfig } from "@/lib/config"
import { languageAlternates } from "@/i18n/paths"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/products", "/services", "/academy", "/blog", "/our-team"]
  const posts = await getAllPosts()
  const latest = posts[0]?.date

  return [
    // Each page once, with its Indonesian version as an hreflang alternate.
    ...pages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path || "/")).map(([l, p]) => [
            l,
            `${siteConfig.url}${p === "/" ? "" : p}`,
          ])
        ),
      },
      lastModified: path === "/blog" && latest ? new Date(latest) : undefined,
      changeFrequency:
        path === "/blog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
