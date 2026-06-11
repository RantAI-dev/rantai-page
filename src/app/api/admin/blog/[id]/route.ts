import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

function revalidateBlogPages() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, content, excerpt, tag, author, thumbnail, published } = body;
  const slug = typeof body.slug === "string" ? body.slug.trim().replaceAll("\r", "") : body.slug;

  try {
    const [post] = await db
      .update(blogPosts)
      .set({ title, slug, content, excerpt, tag, author, thumbnail, published, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateBlogPages();
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    const isDuplicate = message.includes("unique") || message.includes("duplicate");
    return NextResponse.json(
      { error: isDuplicate ? "A post with this slug already exists." : message },
      { status: isDuplicate ? 409 : 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidateBlogPages();
  return NextResponse.json({ ok: true });
}
