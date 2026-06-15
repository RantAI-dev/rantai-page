import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts, teamMembers } from "@/lib/db/schema";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [[post], team] = await Promise.all([
    db.select().from(blogPosts).where(eq(blogPosts.id, id)),
    db
      .select({
        name: teamMembers.name,
        role: teamMembers.role,
        imageUrl: teamMembers.imageUrl,
      })
      .from(teamMembers)
      .orderBy(asc(teamMembers.orderIndex)),
  ]);

  if (!post) notFound();

  return <BlogForm post={post} authors={team} heading="Edit Blog Post" />;
}
