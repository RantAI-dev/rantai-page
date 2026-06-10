import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, content, excerpt, tag, author, thumbnail, published } = body;

  if (!title || !slug || !content || !excerpt || !tag) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [post] = await db
    .insert(blogPosts)
    .values({ title, slug, content, excerpt, tag, author, thumbnail, published: published ?? true })
    .returning();

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  return NextResponse.json(post, { status: 201 });
}
