import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { getBlogPostingDate } from "@/lib/blog/date"
import { and, desc, eq, ilike, lt, lte, or, sql, type SQL } from "drizzle-orm"

const postingDateExpression = sql<Date>`coalesce(
  ${blogPosts.publishedAt},
  ${blogPosts.scheduledFor},
  ${blogPosts.createdAt}
)`

// A post is publicly visible ("live") when it has been published, OR when it was
// scheduled for a time that has now passed. The scheduled half makes visibility
// self-healing: a post appears at its scheduled time even if the publish cron
// (see blog-publish.ts) hasn't yet flipped its `published` flag.
function livePostCondition(now = new Date()): SQL {
  return or(eq(blogPosts.published, true), lte(blogPosts.scheduledFor, now))!
}

function isPostLive(
  p: typeof blogPosts.$inferSelect,
  now = new Date()
): boolean {
  return p.published || (p.scheduledFor != null && p.scheduledFor <= now)
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  tag: string
  excerpt: string
  author?: string
  thumbnail?: string
  contentHtml?: string
}

export type PostListItem = Omit<BlogPost, "contentHtml">

export interface PostsPage {
  posts: PostListItem[]
  // Opaque cursor for the next page, or null when there are no more posts.
  nextCursor: string | null
}

// Default number of posts fetched per page / "Load more" click.
export const POSTS_PER_PAGE = 12

function toListItem(p: typeof blogPosts.$inferSelect): PostListItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: getBlogPostingDate(p)!.toISOString(),
    tag: p.tag,
    excerpt: p.excerpt,
    author: p.author ?? undefined,
    thumbnail: p.thumbnail ?? undefined,
  }
}

// Cursor packs (posting date, id) so paging stays stable even when new posts are
// published between requests. `id` is the tiebreaker for matching timestamps.
function encodeCursor(postingDate: Date, id: string): string {
  return `${postingDate.toISOString()}__${id}`
}

function decodeCursor(
  cursor: string
): { postingDate: Date; id: string } | null {
  const idx = cursor.lastIndexOf("__")
  if (idx === -1) return null
  const postingDate = new Date(cursor.slice(0, idx))
  const id = cursor.slice(idx + 2)
  if (Number.isNaN(postingDate.getTime()) || !id) return null
  return { postingDate, id }
}

export async function getPosts({
  cursor,
  query,
  tag,
  limit = POSTS_PER_PAGE,
}: {
  cursor?: string
  query?: string
  tag?: string
  limit?: number
} = {}): Promise<PostsPage> {
  const conditions = [livePostCondition()]
  if (tag) conditions.push(eq(blogPosts.tag, tag))

  const decoded = cursor ? decodeCursor(cursor) : null
  if (decoded) {
    // Keyset pagination: rows strictly after the cursor in
    // (posting date desc, id desc) order.
    conditions.push(
      or(
        lt(postingDateExpression, decoded.postingDate),
        and(
          eq(postingDateExpression, decoded.postingDate),
          lt(blogPosts.id, decoded.id)
        )
      )!
    )
  }

  const q = query?.trim()
  if (q) {
    const term = `%${q}%`
    conditions.push(
      or(
        ilike(blogPosts.title, term),
        ilike(blogPosts.excerpt, term),
        ilike(blogPosts.tag, term)
      )!
    )
  }

  // Fetch one extra row to detect whether a further page exists.
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(...conditions))
    .orderBy(desc(postingDateExpression), desc(blogPosts.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const last = page[page.length - 1]

  return {
    posts: page.map(toListItem),
    nextCursor:
      hasMore && last
        ? encodeCursor(getBlogPostingDate(last) ?? last.createdAt, last.id)
        : null,
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
  if (!post || !isPostLive(post)) return null

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: getBlogPostingDate(post)!.toISOString(),
    tag: post.tag,
    excerpt: post.excerpt,
    author: post.author ?? undefined,
    thumbnail: post.thumbnail ?? undefined,
    contentHtml: post.content,
  }
}

export async function getAllPostSlugs(): Promise<
  { params: { slug: string } }[]
> {
  const posts = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(livePostCondition())
  return posts.map((p) => ({ params: { slug: p.slug } }))
}

/** Tags used by live posts, most used first. */
export async function getPostTags(): Promise<string[]> {
  const rows = await db
    .select({ tag: blogPosts.tag, n: sql<number>`count(*)` })
    .from(blogPosts)
    .where(livePostCondition())
    .groupBy(blogPosts.tag)
    .orderBy(desc(sql`count(*)`), blogPosts.tag)
  return rows.map((r) => r.tag).filter(Boolean)
}

/** The post to read after this one: the next older post, else the newest. */
export async function getNextPost(
  post: Pick<BlogPost, "id" | "date">
): Promise<PostListItem | null> {
  const date = new Date(post.date)
  const [older] = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        livePostCondition(),
        or(
          lt(postingDateExpression, date),
          and(eq(postingDateExpression, date), lt(blogPosts.id, post.id))
        )
      )
    )
    .orderBy(desc(postingDateExpression), desc(blogPosts.id))
    .limit(1)
  if (older) return toListItem(older)

  const [newest] = await db
    .select()
    .from(blogPosts)
    .where(livePostCondition())
    .orderBy(desc(postingDateExpression), desc(blogPosts.id))
    .limit(1)
  return newest && newest.id !== post.id ? toListItem(newest) : null
}
