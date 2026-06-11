import { notFound } from "next/navigation"

import { getAllPostSlugs, getPostBySlug } from "@/lib/blog"
import { siteConfig } from "@/lib/config"
import { BlogPostView } from "@/components/blog-post-view"

export async function generateStaticParams() {
  const paths = await getAllPostSlugs()
  return paths.map((p) => ({ slug: p.params.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`
  const ogImage = post.thumbnail ?? siteConfig.ogImage

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt ?? "",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? "",
      images: [ogImage],
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

  return <BlogPostView post={post} />
}
