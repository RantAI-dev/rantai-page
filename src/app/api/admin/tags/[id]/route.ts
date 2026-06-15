import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts, tags } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getDatabaseErrorResponse } from "@/lib/blog-input";

function revalidateBlogPages() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const color = typeof body.color === "string" ? body.color : "slate";
  const orderIndex = typeof body.orderIndex === "number" ? body.orderIndex : 0;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [existing] = await db.select().from(tags).where(eq(tags.id, id));
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const [tag] = await db
      .update(tags)
      .set({ name, color, orderIndex, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();

    // Tag is stored on posts by name, so a rename must cascade to keep
    // existing posts pointing at the same (renamed) tag.
    if (existing.name !== name) {
      await db.update(blogPosts).set({ tag: name }).where(eq(blogPosts.tag, existing.name));
    }

    revalidateBlogPages();
    return NextResponse.json(tag);
  } catch (err) {
    const { status } = getDatabaseErrorResponse(err);
    const error = status === 409 ? "A tag with this name already exists." : "Database error";
    return NextResponse.json({ error }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(tags).where(eq(tags.id, id));
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ inUse }] = await db
    .select({ inUse: count() })
    .from(blogPosts)
    .where(eq(blogPosts.tag, existing.name));

  if (Number(inUse) > 0) {
    return NextResponse.json(
      { error: `Tag is used by ${inUse} post${Number(inUse) === 1 ? "" : "s"}.` },
      { status: 409 },
    );
  }

  await db.delete(tags).where(eq(tags.id, id));
  revalidateBlogPages();
  return NextResponse.json({ ok: true });
}
