import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishDueScheduledPosts } from "@/lib/blog-publish";

export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
  // CRON_SECRET is configured. This also gates manual invocations.
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const published = await publishDueScheduledPosts();

  // Only bust the blog caches when something actually went live, so the daily
  // run is cheap on days with nothing scheduled.
  if (published.length > 0) {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
  }

  return NextResponse.json({ publishedCount: published.length, published });
}
