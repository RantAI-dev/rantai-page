"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  FeaturedPostSplit,
  PostCard,
  tagDot,
} from "@/components/blog/post-cards"
import type { PostListItem, PostsPage } from "@/lib/blog/posts"
import { gradientForColor } from "@/lib/blog/tag-colors"
import { cn } from "@/lib/utils"
import { FilterChips } from "@/components/shared/filter-chips"
import { searchField } from "@/components/shared/search-field"

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

export function BlogMain({
  initialPosts,
  initialCursor,
  tagColors,
  tags = [],
}: Props) {
  const t = useTranslations("blog.list")
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
    const handle = setTimeout(
      async () => {
        try {
          const page = await fetchPosts({ q, tag: tag ?? undefined })
          setPosts(page.posts)
          setCursor(page.nextCursor)
        } finally {
          setSearching(false)
        }
      },
      q ? 300 : 0
    )

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

  return (
    <div className="flex flex-col gap-10">
      {/* Same toolbar as the Academy library: search and count on one row,
          topic chips under it */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            {searching ? (
              <Loader2Icon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : (
              <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className={searchField}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("clearSearch")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          {/* `+` denotes more pages available beyond what's loaded. */}
          <p className="shrink-0 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase tabular-nums max-sm:hidden">
            {(() => {
              const more = cursor ? "+" : ""
              return isSearching
                ? t("results", { count: posts.length, more })
                : t("articles", { count: posts.length, more })
            })()}
          </p>
        </div>
        {/* Phones: the topic filter and the count share a line */}
        <div className="flex items-center gap-4">
          {showTags && (
            <FilterChips
              className="max-sm:min-w-0 max-sm:flex-1"
              label={t("filterLabel")}
              value={tag ?? ""}
              onChange={(v) => setTag(v || null)}
              options={[
                { value: "", label: t("all") },
                ...tags.map((name) => ({
                  value: name,
                  tone: tagDot(tagColors?.[name]),
                })),
              ]}
            />
          )}
          <p className="shrink-0 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase tabular-nums sm:hidden">
            {(() => {
              const more = cursor ? "+" : ""
              return isSearching
                ? t("results", { count: posts.length, more })
                : t("articles", { count: posts.length, more })
            })()}
          </p>
        </div>
      </div>

      {!searching && posts.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 py-14 text-center sm:py-20">
          <p className="text-lg text-neutral-500">
            {isSearching
              ? t("emptySearch", { query: trimmedQuery })
              : t("empty")}
          </p>
          {isSearching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium ring-1 ring-black/10 transition-colors hover:ring-black/30"
            >
              {t("clearSearch")}
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-10 transition-opacity duration-200 sm:gap-14 lg:gap-20",
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
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  tagColor={tagColors?.[post.tag]}
                  fallbackGradient={gradientForColor(tagColors?.[post.tag])}
                  rowOnMobile
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
                    {t("loading")}
                  </>
                ) : (
                  t("loadMore")
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
