"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"

import { FeaturedPostCard, PostCard } from "@/components/post-cards"
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          {searching ? (
            <Loader2Icon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : (
            <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search insights"
            aria-label="Search insights"
            className="h-12 w-full rounded-full border border-border bg-muted py-3 pr-11 pl-12 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:bg-background focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* `+` denotes more pages available beyond what's loaded. */}
        <p className="font-label text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          {(() => {
            const more = cursor ? "+" : ""
            const noun = posts.length === 1 ? "" : "s"
            return isSearching
              ? `${posts.length}${more} result${noun} for "${trimmedQuery}"`
              : `${posts.length}${more} article${noun}`
          })()}
        </p>
      </div>

      {!searching && posts.length === 0 ? (
        <div className="rounded-2xl bg-muted py-20 text-center">
          <p className="text-lg text-muted-foreground">
            {isSearching
              ? `No articles found for “${trimmedQuery}”.`
              : "No articles published yet."}
          </p>
          {isSearching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 inline-flex h-11 items-center rounded-full border border-foreground/25 px-5 text-sm font-medium transition-colors hover:border-foreground/70"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {featured && (
            <FeaturedPostCard post={featured} showExcerpt className="min-h-[460px] lg:min-h-[520px]" />
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  showExcerpt
                  fallbackGradient={gradientForColor(tagColors?.[post.tag])}
                />
              ))}
            </div>
          )}

          {cursor && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-foreground/25 px-7 text-[15px] font-medium text-foreground transition-colors hover:border-foreground/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
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
