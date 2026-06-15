import { and, like, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { normalizeSlug } from "@/lib/blog-input";

// Derives a URL slug from the post title and guarantees uniqueness by appending
// an incrementing suffix (-2, -3, …) when the base slug is already taken.
// `excludeId` lets an edit ignore its own current slug when checking collisions.
export async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = normalizeSlug(title) || "post";

  const conditions = [like(blogPosts.slug, `${base}%`)];
  if (excludeId) conditions.push(ne(blogPosts.id, excludeId));

  const rows = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(and(...conditions));

  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}
