"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import type { PostListItem, PostsPage } from "@/lib/blog"
import { gradientForColor } from "@/lib/tag-colors"

type Post = PostListItem

interface Props {
  // First page rendered on the server for fast initial paint & SEO.
  initialPosts: Post[]
  // Cursor for the page after `initialPosts`, or null if there are no more.
  initialCursor: string | null
  // Map of tag name → color preset key, used to resolve thumbnail gradients.
  tagColors?: Record<string, string>
}

async function fetchPosts(params: { cursor?: string; q?: string }): Promise<PostsPage> {
  const search = new URLSearchParams()
  if (params.cursor) search.set("cursor", params.cursor)
  if (params.q) search.set("q", params.q)
  const res = await fetch(`/api/blog?${search.toString()}`)
  if (!res.ok) throw new Error("Failed to load posts")
  return res.json()
}

function Thumbnail({
  thumbnail,
  tag,
  gradient,
  className = "",
}: {
  thumbnail?: string
  tag: string
  gradient: string
  className?: string
}) {
  if (thumbnail) {
    return (
      <div className={`relative aspect-video overflow-hidden ${className}`}>
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
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
      <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase select-none">
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

export function BlogMain({ initialPosts, initialCursor, tagColors }: Props) {
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searching, setSearching] = useState(false)

  const trimmedQuery = query.trim()
  const isSearching = trimmedQuery.length > 0

  // Re-query the server (debounced) whenever the search term changes. Skips the
  // first render so the server-provided initial page isn't re-fetched on mount.
  const didMount = useRef(false)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const q = query.trim()
    setSearching(true)
    const handle = setTimeout(async () => {
      try {
        const page = await fetchPosts({ q })
        setPosts(page.posts)
        setCursor(page.nextCursor)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(handle)
  }, [query])

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const page = await fetchPosts({ cursor, q: trimmedQuery || undefined })
      setPosts((prev) => [...prev, ...page.posts])
      setCursor(page.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }, [cursor, loadingMore, trimmedQuery])

  // Featured layout only makes sense for the default chronological feed.
  const featured = isSearching ? undefined : posts[0]
  const rest = isSearching ? posts : posts.slice(1)

  return (
    <div className="flex flex-col gap-8">
      {/* Search bar */}
      <div className="relative">
        {searching ? (
          <Loader2Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
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

      {/* Results count — `+` denotes more pages available beyond what's loaded. */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {(() => {
          const more = cursor ? "+" : ""
          const noun = posts.length === 1 ? "" : "s"
          return isSearching
            ? `${posts.length}${more} result${noun} for "${trimmedQuery}"`
            : `${posts.length}${more} article${noun}`
        })()}
      </p>

      {/* Empty state */}
      {!searching && posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {isSearching
              ? `No articles found for “${trimmedQuery}”.`
              : "No articles published yet."}
          </p>
          {isSearching && (
            <button
              onClick={() => setQuery("")}
              className="mt-3 font-mono text-xs uppercase tracking-wider text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Clear search
            </button>
          )}
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
                  gradient={gradientForColor(tagColors?.[featured.tag])}
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
                    gradient={gradientForColor(tagColors?.[post.tag])}
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

          {/* Load more */}
          {cursor && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
