import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { ArrowLeftIcon, ArrowRight, Share2 } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { prepareArticle } from "@/lib/blog/article-html"
import { sanitizeBlogHtml } from "@/lib/blog/sanitize"
import type { BlogPost, PostListItem } from "@/lib/blog/posts"
import { siteConfig } from "@/lib/config"
import { ArticleReader } from "@/components/blog/article-reader"
import { Eyebrow } from "@/components/shared/eyebrow"
import { MotionInView } from "@/components/shared/motion-in-view"
import { ShareDropdown } from "@/components/blog/share-dropdown"
import { SiteShell } from "@/components/layout/site-shell"

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "")
  const words = text.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

type BlogPostViewProps = {
  post: BlogPost
  backHref?: string
  backLabel?: string
  /** The article to suggest at the end. */
  next?: PostListItem | null
}

async function NextArticle({ post }: Readonly<{ post: PostListItem }>) {
  const t = await getTranslations("blog.article")
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-16 flex items-center gap-5 border-t border-neutral-200 pt-8 sm:gap-7"
    >
      <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:w-44">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="176px"
            className="object-cover"
          />
        )}
        <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.06]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
          {t("nextArticle")}
        </p>
        <p className="mt-2 line-clamp-2 text-[17px] leading-snug font-medium tracking-[-0.015em] text-neutral-950 sm:text-xl">
          {post.title}
        </p>
      </div>
      <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-colors duration-200 group-hover:bg-neutral-950 group-hover:text-white sm:grid">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  )
}

export async function BlogPostView({
  post,
  backHref = "/blog",
  backLabel,
  next,
}: BlogPostViewProps) {
  const t = await getTranslations("blog.article")
  // Outside /[locale] (the admin preview) this falls back to English.
  const locale = await getLocale()
  const mins = readingTime(post.contentHtml ?? "")
  // Sanitized again on read: also covers posts saved before sanitizing on
  // write, and the admin preview, which renders this same view.
  const { html, headings } = prepareArticle(
    sanitizeBlogHtml(post.contentHtml ?? ""),
    { copy: t("copy"), linkToSection: t("linkToSection") }
  )
  const date = new Date(post.date).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )

  const header = (
    <MotionInView>
      <header className="pt-14 sm:pt-20">
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground max-sm:-my-2.5 max-sm:py-2.5"
        >
          <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          {backLabel ?? t("back")}
        </Link>

        <Eyebrow className="mt-8 flex text-muted-foreground sm:mt-10">
          {post.tag}
        </Eyebrow>

        <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-xl">
            {post.excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-neutral-500">
            <time dateTime={post.date}>{date}</time>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            {t("minRead", { count: mins })}
          </p>
          <ShareDropdown
            url={`${siteConfig.url}/blog/${post.slug}`}
            title={post.title}
          >
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm text-foreground transition-colors hover:bg-neutral-200/70 sm:h-9"
            >
              <Share2 className="size-3.5" />
              {t("share")}
            </button>
          </ShareDropdown>
        </div>

        {post.thumbnail && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-muted sm:mt-10">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 820px"
              className="object-cover"
              loading="eager"
              priority
            />
          </div>
        )}
      </header>
    </MotionInView>
  )

  return (
    <SiteShell
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        label: t("cta.label"),
        subject: t("cta.subject", { title: post.title }),
        showServicesLink: true,
      }}
    >
      <article>
        <ArticleReader headings={headings} header={header}>
          <MotionInView
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="pt-10 pb-20 sm:pt-12 sm:pb-24 lg:pb-32"
          >
            <div
              // Articles are written in English; say so on other locales.
              lang={locale === "en" ? undefined : "en"}
              className="prose prose-lg max-w-none wrap-anywhere prose-neutral prose-headings:scroll-mt-24 prose-headings:font-medium prose-headings:tracking-[-0.025em] max-sm:prose-h2:text-[26px] max-sm:prose-h3:text-[21px] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70 prose-blockquote:border-l-2 prose-blockquote:border-brand-1 prose-blockquote:font-normal prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl prose-hr:border-border pointer-coarse:[&_.code-copy]:py-2 pointer-coarse:[&_.heading-anchor]:hidden max-sm:[&_table]:block max-sm:[&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {next && <NextArticle post={next} />}
          </MotionInView>
        </ArticleReader>
      </article>
    </SiteShell>
  )
}
