"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"
import type { BlogPost } from "@/lib/markdown"

type Post = Omit<BlogPost, "contentHtml">

interface Props {
  posts: Post[]
}

const tagGradients: Record<string, string> = {
  Product: "from-blue-950 via-indigo-900 to-blue-900",
  Academy: "from-emerald-950 via-teal-900 to-emerald-900",
  Company: "from-violet-950 via-purple-900 to-violet-900",
}

function Thumbnail({
  thumbnail,
  tag,
  className = "",
}: {
  thumbnail?: string
  tag: string
  className?: string
}) {
  const gradient = tagGradients[tag] ?? "from-zinc-900 via-zinc-800 to-zinc-900"

  if (thumbnail) {
    return (
      <div className={`relative aspect-video overflow-hidden ${className}`}>
        <Image
          src={thumbnail}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
      </div>
    )
  }

  return (
    <div
      className={`aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center ${className} transition-transform duration-700 ease-out group-hover:scale-[1.02]`}
    >
      <span className="select-none font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
        {tag}
      </span>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BlogMain({ posts }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q),
    )
  }, [posts, query])

  const [featured, ...rest] = filtered

  return (
    <div className="flex flex-col gap-8">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-md border border-border bg-muted/30 py-3 pl-11 pr-10 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {query
          ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${query}"`
          : `${posts.length} article${posts.length !== 1 ? "s" : ""}`}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            No articles found for &ldquo;{query}&rdquo;.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-3 font-mono text-xs uppercase tracking-wider text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          {/* Featured post — most recent */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-2 block border-b border-border pb-10"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
                <Thumbnail
                  thumbnail={featured.thumbnail}
                  tag={featured.tag}
                  className="rounded-xl"
                />

                <div className="flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {featured.tag}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDate(featured.date)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                    {featured.title}
                  </h2>

                  <p className="line-clamp-3 font-mono text-sm leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>

                  {featured.author && (
                    <p className="font-mono text-xs text-muted-foreground">
                      {featured.author}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                    Read article
                    <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Remaining posts — 2-col grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-transparent p-1 transition-colors hover:border-border hover:bg-muted/10"
                >
                  <Thumbnail
                    thumbnail={post.thumbnail}
                    tag={post.tag}
                    className="rounded-lg"
                  />

                  <div className="flex flex-col gap-3 px-1 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {post.tag}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                    </div>

                    <h3 className="text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>

                    <p className="line-clamp-2 font-mono text-xs leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>

                    {post.author && (
                      <p className="font-mono text-xs text-muted-foreground">
                        {post.author}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                      Read article
                      <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
