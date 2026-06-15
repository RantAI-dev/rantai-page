import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

interface ReorderItem {
  id: string;
  orderIndex: number;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const items: ReorderItem[] = body?.items;

  if (
    !Array.isArray(items) ||
    items.some((it) => typeof it?.id !== "string" || typeof it?.orderIndex !== "number")
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await Promise.all(
    items.map((it) =>
      db.update(tags).set({ orderIndex: it.orderIndex }).where(eq(tags.id, it.id)),
    ),
  );

  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}
