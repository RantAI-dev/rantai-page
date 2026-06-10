import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Blog Post</h1>
      <BlogForm post={post} />
    </div>
  );
}
