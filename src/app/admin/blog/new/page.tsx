import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { BlogForm } from "@/components/admin/blog-form";

export default async function NewBlogPage() {
  const team = await db
    .select({
      name: teamMembers.name,
      role: teamMembers.role,
      imageUrl: teamMembers.imageUrl,
    })
    .from(teamMembers)
    .orderBy(asc(teamMembers.orderIndex));

  return <BlogForm authors={team} heading="New Blog Post" />;
}
