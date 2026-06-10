import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon } from "lucide-react"

import { getAllPostSlugs, getPostBySlug } from "@/lib/blog"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareDropdown } from "@/components/share-dropdown"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/config"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

function GridPattern() {
  const size = 32
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="grid-blog-post"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-blog-post)" />
    </svg>
  )
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "")
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const mins = readingTime(post.contentHtml ?? "")

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* Article header */}
        <MotionInView>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="group mb-10 inline-flex items-center font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="mr-2 size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blog
            </Link>

            {/* Title */}
            <h1 className="text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            {/* Author — above the image */}
            {/* {post.author && (
              <div className="mt-8 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center border border-border bg-muted text-sm font-bold">
                  {post.author.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{post.author}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Author
                  </span>
                </div>
              </div>
            )} */}

            {/* Meta row */}
            <div className="my-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {post.tag}
                </Badge>
                <Badge variant="outline">
                  <CalendarIcon />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>
                <Badge variant="outline">
                  <ClockIcon />
                  {mins} min read
                </Badge>
              </div>
              <ShareDropdown url={`${siteConfig.url}/blog/${slug}`} title={post.title}>
                <Button variant="outline" size="xs" className="text-muted-foreground">
                  <Share2 />
                  Share
                </Button>
              </ShareDropdown>
            </div>


            {/* Cover image */}
            {post.thumbnail && (
              <div className="relative my-10 aspect-video w-full overflow-hidden border border-border">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="eager"
                  priority
                />
              </div>
            )}
          </div>
        </MotionInView>

        {/* Article body */}
        <MotionInView
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          <OutlineSection className="px-8 py-16">
            <div className="mx-auto max-w-3xl">
              <div
                className="prose max-w-none prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70 prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-img:border prose-img:border-border prose-hr:border-border"
                dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
              />
            </div>
          </OutlineSection>
        </MotionInView>

        {/* CTA */}
        <MotionInView>
          <OutlineSection>
            <div className="relative flex items-center justify-center overflow-hidden px-6 py-24 lg:min-h-[400px] lg:py-0">
              <GridPattern />
              <div className="relative z-10 flex max-w-[640px] flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    Want to learn more?
                  </h2>
                  <p className="text-sm text-white/60">
                    Connect with our team to discuss how AI can transform your
                    enterprise.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="group flex items-center justify-between border bg-foreground px-4 py-4 text-background transition-colors duration-300"
                >
                  <span className="font-mono font-medium tracking-wider uppercase">
                    Contact Us
                  </span>
                  <ArrowRightIcon className="ml-3 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
