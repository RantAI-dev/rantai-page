import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getAllPostSlugs, getNextPost, getPostBySlug } from "@/lib/blog/posts"
import { siteConfig } from "@/lib/config"
import { BlogPostView } from "@/components/blog/blog-post-view"
import { JsonLd } from "@/components/shared/json-ld"

export async function generateStaticParams() {
  const paths = await getAllPostSlugs()
  return paths.map((p) => ({ slug: p.params.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  const path = `/blog/${post.slug}`
  // The post's own thumbnail; without one, the Insights preview card
  // (blog/opengraph-image) is used.
  const images = post.thumbnail
    ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }]
    : undefined

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      title: post.title,
      description: post.excerpt ?? "",
      publishedTime: post.date,
      authors: post.author ? [post.author] : [siteConfig.name],
      tags: post.tag ? [post.tag] : undefined,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? "",
      ...(images && { images: images.map((i) => i.url) }),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const next = await getNextPost(post)

  // Structured data, so search engines read the title, date and image.
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${siteConfig.url}/blog/${post.slug}`,
    image: post.thumbnail ?? `${siteConfig.url}/blog/opengraph-image`,
    author: { "@type": "Organization", name: post.author ?? siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/rant-ai.png` },
    },
  }

  return (
    <>
      <JsonLd data={article} />
      <BlogPostView post={post} next={next} />
    </>
  )
}
