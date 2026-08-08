import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { BlogPostView } from "@/components/blog-post-view";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getBlogPostingDate } from "@/lib/blog-date";
import type { BlogPost } from "@/lib/blog";

function mapPostToPreview(post: typeof blogPosts.$inferSelect): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: (getBlogPostingDate(post) ?? post.createdAt).toISOString(),
    tag: post.tag,
    excerpt: post.excerpt,
    author: post.author ?? undefined,
    thumbnail: post.thumbnail ?? undefined,
    contentHtml: post.content,
  };
}

export default async function AdminBlogPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));

  if (!post) notFound();

  return (
    <BlogPostView
      post={mapPostToPreview(post)}
      backHref="/admin/blog"
      backLabel="Back to Admin Blog"
    />
  );
}
