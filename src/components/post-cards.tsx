import Image from "next/image"
import Link from "next/link"

import type { PostListItem } from "@/lib/blog"
import { cn } from "@/lib/utils"

type PostCardData = Pick<PostListItem, "slug" | "title" | "tag" | "thumbnail" | "excerpt" | "date">

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function TagLabel({ tag, className }: Readonly<{ tag: string; className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium tracking-[0.08em] uppercase backdrop-blur-md",
        className
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 10 10" className="size-2 text-brand-1">
        <path d="M0 0h10v10z" fill="currentColor" />
      </svg>
      {tag}
    </span>
  )
}

export function FeaturedPostCard({
  post,
  showExcerpt = false,
  className,
}: Readonly<{ post: PostCardData; showExcerpt?: boolean; className?: string }>) {
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
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(92,182,249,0.45),transparent_60%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative">
        <TagLabel tag={post.tag} className="bg-white/15 text-white" />
        <h3 className="mt-4 max-w-xl text-2xl leading-tight font-medium tracking-[-0.025em] text-balance sm:text-[32px]">
          {post.title}
        </h3>
        {showExcerpt && (
          <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 text-xs font-medium tracking-[0.08em] text-white/50 uppercase">
          {formatDate(post.date)}
        </p>
      </div>
    </Link>
  )
}

export function PostCard({
  post,
  showExcerpt = false,
  fallbackGradient = "from-neutral-800 to-neutral-950",
}: Readonly<{ post: PostCardData; showExcerpt?: boolean; fallbackGradient?: string }>) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl bg-muted p-4 transition-colors hover:bg-neutral-200/70 sm:p-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", fallbackGradient)} />
        )}
        <TagLabel tag={post.tag} className="absolute top-3 left-3 bg-black/60 text-white" />
      </div>
      <h3 className="mt-4 px-1 text-[17px] leading-snug font-medium tracking-[-0.015em] text-foreground">
        {post.title}
      </h3>
      {showExcerpt && (
        <p className="mt-2 line-clamp-2 px-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}
      <p className="mt-auto px-1 pt-4 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {formatDate(post.date)}
      </p>
    </Link>
  )
}
