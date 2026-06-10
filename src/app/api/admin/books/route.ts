import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(books).orderBy(asc(books.orderIndex));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { code, name, category, imageUrl, url, orderIndex } = body;

  if (!code || !name || !category || !imageUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [book] = await db
    .insert(books)
    .values({ code, name, category, imageUrl, url, orderIndex: orderIndex ?? 0 })
    .returning();

  revalidatePath("/academy");
  return NextResponse.json(book, { status: 201 });
}
