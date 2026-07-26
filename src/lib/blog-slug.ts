import { and, like, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { BLOG_SLUG_MAX_LENGTH, normalizeSlug } from "@/lib/blog-input";

function appendSuffix(base: string, suffix: number) {
  const suffixText = `-${suffix}`;
  const availableLength = BLOG_SLUG_MAX_LENGTH - suffixText.length;
  const truncatedBase = base.slice(0, availableLength).replace(/-+$/g, "");
  return `${truncatedBase}${suffixText}`;
}

// Derives a URL slug from the post title and guarantees uniqueness by appending
// an incrementing suffix (-2, -3, …) when the base slug is already taken.
// `excludeId` lets an edit ignore its own current slug when checking collisions.
export async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = normalizeSlug(title) || "post";

  // Reserve enough prefix room for a numeric suffix while keeping every
  // generated candidate within the configured slug length.
  const collisionPrefix = base.slice(
    0,
    BLOG_SLUG_MAX_LENGTH - String(Number.MAX_SAFE_INTEGER).length - 1,
  );
  const conditions = [like(blogPosts.slug, `${collisionPrefix}%`)];
  if (excludeId) conditions.push(ne(blogPosts.id, excludeId));

  const rows = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(and(...conditions));

  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(appendSuffix(base, suffix))) suffix++;
  return appendSuffix(base, suffix);
}
