import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { thumbnailDesigns } from "@/lib/db/schema";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [source] = await db
    .select()
    .from(thumbnailDesigns)
    .where(eq(thumbnailDesigns.id, id));

  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [design] = await db
    .insert(thumbnailDesigns)
    .values({
      name: `${source.name} Copy`,
      previewUrl: source.previewUrl,
      design: source.design,
    })
    .returning();

  return NextResponse.json(design, { status: 201 });
}
