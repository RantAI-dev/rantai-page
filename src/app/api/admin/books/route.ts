import { NextRequest, NextResponse } from "next/server";
import { revalidateBooks } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { parseBookInput, readJson } from "@/lib/admin-input";
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

  const input = parseBookInput(await readJson(req));
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });

  const [book] = await db.insert(books).values(input.data).returning();

  revalidateBooks();
  return NextResponse.json(book, { status: 201 });
}
