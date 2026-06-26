import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { and, eq, isNotNull, lte } from "drizzle-orm";

export type PublishedScheduledPost = { id: string; slug: string; title: string };

// Publishes every post whose scheduled time has arrived. Idempotent: only posts
// that are still unpublished and have a due `scheduledFor` are touched, so it is
// safe to run on any cadence (and to re-run after a failed revalidation).
//
// Visibility itself is already self-healing (see livePostCondition in blog.ts);
// this exists so the persisted `published` flag and the statically-cached blog
// pages reflect reality once a scheduled time passes.
export async function publishDueScheduledPosts(
  now = new Date(),
): Promise<PublishedScheduledPost[]> {
  const published = await db
    .update(blogPosts)
    .set({ published: true, updatedAt: now })
    .where(
      and(
        eq(blogPosts.published, false),
        isNotNull(blogPosts.scheduledFor),
        lte(blogPosts.scheduledFor, now),
      ),
    )
    .returning({ id: blogPosts.id, slug: blogPosts.slug, title: blogPosts.title });

  return published;
}
