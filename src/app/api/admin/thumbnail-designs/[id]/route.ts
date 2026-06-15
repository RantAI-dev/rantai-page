import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { thumbnailDesigns } from "@/lib/db/schema";
import { normalizeThumbnailDesignInput } from "@/lib/thumbnail-design";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [design] = await db
    .select()
    .from(thumbnailDesigns)
    .where(eq(thumbnailDesigns.id, id));

  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(design);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = normalizeThumbnailDesignInput(await req.json());
  if ("error" in input) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const { id } = await params;
  const [design] = await db
    .update(thumbnailDesigns)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(thumbnailDesigns.id, id))
    .returning();

  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(design);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(thumbnailDesigns).where(eq(thumbnailDesigns.id, id));
  return NextResponse.json({ ok: true });
}
