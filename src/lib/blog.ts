import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  author?: string;
  thumbnail?: string;
  contentHtml?: string;
}

export type PostListItem = Omit<BlogPost, "contentHtml">;

export interface PostsPage {
  posts: PostListItem[];
  // Opaque cursor for the next page, or null when there are no more posts.
  nextCursor: string | null;
}

// Default number of posts fetched per page / "Load more" click.
export const POSTS_PER_PAGE = 12;

function toListItem(p: typeof blogPosts.$inferSelect): PostListItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.createdAt.toISOString().split("T")[0],
    tag: p.tag,
    excerpt: p.excerpt,
    author: p.author ?? undefined,
    thumbnail: p.thumbnail ?? undefined,
  };
}

// Cursor packs (createdAt, id) so paging stays stable even when new posts are
// inserted between requests. `id` is the tiebreaker for posts sharing a timestamp.
function encodeCursor(createdAt: Date, id: string): string {
  return `${createdAt.toISOString()}__${id}`;
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } | null {
  const idx = cursor.lastIndexOf("__");
  if (idx === -1) return null;
  const createdAt = new Date(cursor.slice(0, idx));
  const id = cursor.slice(idx + 2);
  if (Number.isNaN(createdAt.getTime()) || !id) return null;
  return { createdAt, id };
}

export async function getPosts({
  cursor,
  query,
  limit = POSTS_PER_PAGE,
}: {
  cursor?: string;
  query?: string;
  limit?: number;
} = {}): Promise<PostsPage> {
  const conditions = [eq(blogPosts.published, true)];

  const decoded = cursor ? decodeCursor(cursor) : null;
  if (decoded) {
    // Keyset pagination: rows strictly "after" the cursor in (createdAt desc, id desc) order.
    conditions.push(
      or(
        lt(blogPosts.createdAt, decoded.createdAt),
        and(eq(blogPosts.createdAt, decoded.createdAt), lt(blogPosts.id, decoded.id)),
      )!,
    );
  }

  const q = query?.trim();
  if (q) {
    const term = `%${q}%`;
    conditions.push(
      or(
        ilike(blogPosts.title, term),
        ilike(blogPosts.excerpt, term),
        ilike(blogPosts.tag, term),
      )!,
    );
  }

  // Fetch one extra row to detect whether a further page exists.
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(...conditions))
    .orderBy(desc(blogPosts.createdAt), desc(blogPosts.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];

  return {
    posts: page.map(toListItem),
    nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  if (!post || !post.published) return null;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.createdAt.toISOString().split("T")[0],
    tag: post.tag,
    excerpt: post.excerpt,
    author: post.author ?? undefined,
    thumbnail: post.thumbnail ?? undefined,
    contentHtml: post.content,
  };
}

export async function getAllPostSlugs(): Promise<{ params: { slug: string } }[]> {
  const posts = await db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.published, true));
  return posts.map((p) => ({ params: { slug: p.slug } }));
}
