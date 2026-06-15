import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { thumbnailDesigns } from "@/lib/db/schema";
import { normalizeThumbnailDesignInput } from "@/lib/thumbnail-design";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(thumbnailDesigns)
    .orderBy(desc(thumbnailDesigns.updatedAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = normalizeThumbnailDesignInput(await req.json());
  if ("error" in input) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const [design] = await db
    .insert(thumbnailDesigns)
    .values(input)
    .returning();

  return NextResponse.json(design, { status: 201 });
}
