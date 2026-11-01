import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

import type { PostListItem } from "@/lib/blog/posts"
import { cn } from "@/lib/utils"

type PostCardData = Pick<
  PostListItem,
  "slug" | "title" | "tag" | "thumbnail" | "excerpt" | "date"
>

/** "Oct 27, 2026" in English, "27 Okt 2026" in Indonesian. */
export function formatPostDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )
}

// Dot colour per tag colour preset (see lib/tag-colors).
const TAG_DOT: Record<string, string> = {
  blue: "#3b82f6",
  emerald: "#10b981",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#71717a",
}

export function tagDot(color?: string | null) {
  return (color && TAG_DOT[color]) || "#5cb6f9"
}

function TagLabel({
  tag,
  className,
}: Readonly<{ tag: string; className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium tracking-[0.08em] uppercase backdrop-blur-md",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 10 10"
        className="size-2 text-brand-1"
      >
        <path d="M0 0h10v10z" fill="currentColor" />
      </svg>
      {tag}
    </span>
  )
}

/** Tag dot, tag and date on one quiet line. */
function Meta({
  post,
  tagColor,
  className,
}: Readonly<{ post: PostCardData; tagColor?: string; className?: string }>) {
  const locale = useLocale()
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[13px] text-neutral-500",
        className
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ background: tagDot(tagColor) }}
      />
      <span className="font-medium text-neutral-700">{post.tag}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
    </p>
  )
}

function Thumb({
  post,
  sizes,
  fallbackGradient,
  className,
  priority,
}: Readonly<{
  post: PostCardData
  sizes: string
  fallbackGradient: string
  className?: string
  priority?: boolean
}>) {
  return (
    <div className={cn("relative overflow-hidden bg-neutral-100", className)}>
      {post.thumbnail ? (
        <Image
          src={post.thumbnail}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className={cn("absolute inset-0 bg-gradient-to-br", fallbackGradient)}
        />
      )}
      {/* A soft veil on hover, instead of zooming the image */}
      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.06]" />
    </div>
  )
}

/** Homepage feature: the image fills the card, the title sits on it. */
export function FeaturedPostCard({
  post,
  showExcerpt = false,
  className,
}: Readonly<{
  post: PostCardData
  showExcerpt?: boolean
  className?: string
}>) {
  const locale = useLocale()
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-6 text-white sm:p-8",
        className
      )}
    >
      {post.thumbnail ? (
        <Image
          src={post.thumbnail}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(92,182,249,0.45),transparent_60%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative">
        <TagLabel tag={post.tag} className="bg-white/15 text-white" />
        <h3 className="mt-4 line-clamp-2 max-w-xl text-2xl leading-tight font-medium tracking-[-0.025em] text-balance sm:text-[32px]">
          {post.title}
        </h3>
        {showExcerpt && (
          <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 text-xs font-medium tracking-[0.08em] text-white/50 uppercase">
          {formatPostDate(post.date, locale)}
        </p>
      </div>
    </Link>
  )
}

/** Insights feature: image left, the story right. */
export function FeaturedPostSplit({
  post,
  tagColor,
  fallbackGradient = "from-neutral-800 to-neutral-950",
}: Readonly<{
  post: PostCardData
  tagColor?: string
  fallbackGradient?: string
}>) {
  const t = useTranslations("blog.card")
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-14"
    >
      <Thumb
        post={post}
        priority
        sizes="(max-width: 1024px) 100vw, 55vw"
        fallbackGradient={fallbackGradient}
        className="aspect-[16/10] rounded-2xl"
      />
      <div>
        <Meta post={post} tagColor={tagColor} />
        <h2 className="mt-4 line-clamp-2 text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance text-neutral-950">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-2 max-w-lg text-[16px] leading-relaxed text-neutral-500">
          {post.excerpt}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 text-[15px] font-medium text-neutral-950">
          {t("readArticle")}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  )
}

/**
 * Compact card: image, a quiet meta line, a two-line title. With `rowOnMobile`
 * it becomes a row on phones (small thumbnail beside the text) so a long list
 * stays scannable; from `sm` up it is the same card.
 */
export function PostCard({
  post,
  tagColor,
  fallbackGradient = "from-neutral-800 to-neutral-950",
  rowOnMobile = false,
}: Readonly<{
  post: PostCardData
  tagColor?: string
  fallbackGradient?: string
  rowOnMobile?: boolean
}>) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col",
        rowOnMobile && "max-sm:flex-row max-sm:items-center max-sm:gap-4"
      )}
    >
      <Thumb
        post={post}
        sizes={
          rowOnMobile
            ? "(max-width: 640px) 120px, (max-width: 1024px) 50vw, 33vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        fallbackGradient={fallbackGradient}
        className={cn(
          "aspect-[16/10] rounded-xl",
          rowOnMobile && "max-sm:aspect-[4/3] max-sm:w-28 max-sm:shrink-0"
        )}
      />
      <div className={cn(rowOnMobile && "max-sm:min-w-0 max-sm:flex-1")}>
        <Meta
          post={post}
          tagColor={tagColor}
          className={cn(
            "mt-4",
            rowOnMobile && "max-sm:mt-0 max-sm:text-[12px]"
          )}
        />
        <h3
          className={cn(
            "mt-2 line-clamp-2 text-[17px] leading-snug font-medium tracking-[-0.015em] text-neutral-950 decoration-neutral-300 underline-offset-4 group-hover:underline",
            rowOnMobile && "max-sm:mt-1.5 max-sm:text-[16px]"
          )}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
