import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { code, name, category, imageUrl, url, orderIndex } = body;

  const [book] = await db
    .update(books)
    .set({ code, name, category, imageUrl, url, orderIndex, updatedAt: new Date() })
    .where(eq(books.id, id))
    .returning();

  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/academy");
  return NextResponse.json(book);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(books).where(eq(books.id, id));
  revalidatePath("/academy");
  return NextResponse.json({ ok: true });
}
