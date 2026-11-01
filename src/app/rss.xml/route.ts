import { getAllPosts } from "@/lib/blog/posts"
import { siteConfig } from "@/lib/config"

// The feed the layout advertises (<link rel="alternate" type="application/rss+xml">).

export const revalidate = 3600

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export async function GET() {
  const posts = await getAllPosts()
  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escape(post.tag)}</category>
      <description>${escape(post.excerpt ?? "")}</description>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Insights</title>
    <link>${siteConfig.url}/blog</link>
    <description>Updates, releases, and insights on building AI that works in production.</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
