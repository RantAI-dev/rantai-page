import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts, tags, teamMembers } from "@/lib/db/schema";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [[post], team, tagRows] = await Promise.all([
    db.select().from(blogPosts).where(eq(blogPosts.id, id)),
    db
      .select({
        name: teamMembers.name,
        role: teamMembers.role,
        imageUrl: teamMembers.imageUrl,
      })
      .from(teamMembers)
      .orderBy(asc(teamMembers.orderIndex)),
    db.select({ name: tags.name, color: tags.color }).from(tags).orderBy(asc(tags.orderIndex)),
  ]);

  if (!post) notFound();

  return <BlogForm post={post} authors={team} tags={tagRows} heading="Edit Blog Post" />;
}
