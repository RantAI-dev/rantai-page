import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tags, teamMembers } from "@/lib/db/schema";
import { BlogForm } from "@/components/admin/blog-form";

export default async function NewBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ thumbnail?: string }>
}) {
  const { thumbnail } = await searchParams;
  const [team, tagRows] = await Promise.all([
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

  return (
    <BlogForm
      authors={team}
      tags={tagRows}
      heading="New Blog Post"
      initialThumbnail={thumbnail}
    />
  );
}
