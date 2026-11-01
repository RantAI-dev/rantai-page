"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"

import { FeaturedPostSplit, PostCard, tagDot } from "@/components/post-cards"
import type { PostListItem, PostsPage } from "@/lib/blog"
import { gradientForColor } from "@/lib/tag-colors"
import { cn } from "@/lib/utils"

type Post = PostListItem

interface Props {
  // First page rendered on the server for fast initial paint & SEO.
  initialPosts: Post[]
  // Cursor for the page after `initialPosts`, or null if there are no more.
  initialCursor: string | null
  // Map of tag name → color preset key, used to resolve thumbnail gradients.
  tagColors?: Record<string, string>
  // Tags in use, most used first. Chips show when there are two or more.
  tags?: string[]
}

async function fetchPosts(params: {
  cursor?: string
  q?: string
  tag?: string
}): Promise<PostsPage> {
  const search = new URLSearchParams()
  if (params.cursor) search.set("cursor", params.cursor)
  if (params.q) search.set("q", params.q)
  if (params.tag) search.set("tag", params.tag)
  const res = await fetch(`/api/blog?${search.toString()}`)
  if (!res.ok) throw new Error("Failed to load posts")
  return res.json()
}

export function BlogMain({ initialPosts, initialCursor, tagColors, tags = [] }: Props) {
  const [query, setQuery] = useState("")
  const [tag, setTag] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searching, setSearching] = useState(false)

  const trimmedQuery = query.trim()
  const isSearching = trimmedQuery.length > 0

  // Re-query the server (debounced) whenever the search or tag changes. Skips the
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
        const page = await fetchPosts({ q, tag: tag ?? undefined })
        setPosts(page.posts)
        setCursor(page.nextCursor)
      } finally {
        setSearching(false)
      }
    }, q ? 300 : 0)

    return () => clearTimeout(handle)
  }, [query, tag])

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const page = await fetchPosts({
        cursor,
        q: trimmedQuery || undefined,
        tag: tag ?? undefined,
      })
      setPosts((prev) => [...prev, ...page.posts])
      setCursor(page.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }, [cursor, loadingMore, trimmedQuery, tag])

  // Featured layout only makes sense for the default chronological feed.
  const featured = isSearching ? undefined : posts[0]
  const rest = isSearching ? posts : posts.slice(1)

  const showTags = tags.length > 1
  const chips: { label: string; value: string | null }[] = [
    { label: "All", value: null },
    ...tags.map((t) => ({ label: t, value: t })),
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {showTags ? (
          <div
            role="tablist"
            aria-label="Filter by topic"
            className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((c) => {
              const on = tag === c.value
              return (
                <button
                  key={c.label}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTag(c.value)}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium whitespace-nowrap transition-colors duration-200",
                    on
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950"
                  )}
                >
                  {c.value && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: tagDot(tagColors?.[c.value]) }}
                    />
                  )}
                  {c.label}
                </button>
              )
            })}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-4">
          {/* `+` denotes more pages available beyond what's loaded. */}
          <p className="hidden shrink-0 text-[13px] text-neutral-500 tabular-nums sm:block">
            {(() => {
              const more = cursor ? "+" : ""
              const noun = posts.length === 1 ? "" : "s"
              return isSearching
                ? `${posts.length}${more} result${noun}`
                : `${posts.length}${more} article${noun}`
            })()}
          </p>
          <div className="relative w-full lg:w-72">
            {searching ? (
              <Loader2Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 animate-spin text-neutral-400" />
            ) : (
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400" />
            )}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights"
              aria-label="Search insights"
              className="h-10 w-full rounded-full bg-neutral-100 py-2 pr-10 pl-10 text-[14px] text-neutral-950 transition-colors placeholder:text-neutral-400 focus:bg-white focus:ring-1 focus:ring-neutral-300 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-neutral-400 transition-colors hover:text-neutral-950"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {!searching && posts.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 py-20 text-center">
          <p className="text-lg text-neutral-500">
            {isSearching
              ? `No articles found for “${trimmedQuery}”.`
              : "No articles published yet."}
          </p>
          {isSearching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium ring-1 ring-black/10 transition-colors hover:ring-black/30"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-14 transition-opacity duration-200 lg:gap-20",
            searching && "opacity-50"
          )}
        >
          {featured && (
            <FeaturedPostSplit
              post={featured}
              tagColor={tagColors?.[featured.tag]}
              fallbackGradient={gradientForColor(tagColors?.[featured.tag])}
            />
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  tagColor={tagColors?.[post.tag]}
                  fallbackGradient={gradientForColor(tagColors?.[post.tag])}
                />
              ))}
            </div>
          )}

          {cursor && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-100 px-6 text-[14px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200/70 disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>
      )}
    </div>
  )
}
