import { NextRequest, NextResponse } from "next/server";
import { revalidateBooks } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { parseBookInput, readJson } from "@/lib/admin-input";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = parseBookInput(await readJson(req));
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });

  const [book] = await db
    .update(books)
    .set({ ...input.data, updatedAt: new Date() })
    .where(eq(books.id, id))
    .returning();

  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateBooks();
  return NextResponse.json(book);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(books).where(eq(books.id, id));
  revalidateBooks();
  return NextResponse.json({ ok: true });
}
