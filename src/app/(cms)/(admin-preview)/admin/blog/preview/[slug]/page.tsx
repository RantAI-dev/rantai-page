import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { eq } from "drizzle-orm";

import { BlogPostView } from "@/components/blog/blog-post-view";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getBlogPostingDate } from "@/lib/blog/date";
import type { BlogPost } from "@/lib/blog/posts";

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

  // The article view is shared with the public site and reads its text from
  // the (English) messages, so the preview needs the provider too.
  return (
    <NextIntlClientProvider>
      <BlogPostView
        post={mapPostToPreview(post)}
        backHref="/admin/blog"
        backLabel="Back to Admin Blog"
      />
    </NextIntlClientProvider>
  );
}
