import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import {
  getBlogInputError,
  getDatabaseErrorResponse,
  isPublishedOnlyBlogUpdate,
  normalizeBlogInput,
} from "@/lib/blog-input";
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

  try {
    if (isPublishedOnlyBlogUpdate(body)) {
      const [post] = await db
        .update(blogPosts)
        .set({ published: body.published, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();

      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
      revalidateBlogPages();
      return NextResponse.json(post);
    }

    const input = normalizeBlogInput(body);
    const inputError = getBlogInputError(input);

    if (inputError) {
      return NextResponse.json({ error: inputError }, { status: 400 });
    }

    const [post] = await db
      .update(blogPosts)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateBlogPages();
    return NextResponse.json(post);
  } catch (err) {
    const { message, status } = getDatabaseErrorResponse(err);
    return NextResponse.json({ error: message }, { status });
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
