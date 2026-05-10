import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

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

export async function getAllPosts(): Promise<Omit<BlogPost, "contentHtml">[]> {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.createdAt));

  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.createdAt.toISOString().split("T")[0],
    tag: p.tag,
    excerpt: p.excerpt,
    author: p.author ?? undefined,
    thumbnail: p.thumbnail ?? undefined,
  }));
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
