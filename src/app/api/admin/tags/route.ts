import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getDatabaseErrorResponse } from "@/lib/blog-input";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(tags).orderBy(asc(tags.orderIndex));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const color = typeof body.color === "string" ? body.color : "slate";
  const orderIndex = typeof body.orderIndex === "number" ? body.orderIndex : 0;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const [tag] = await db.insert(tags).values({ name, color, orderIndex }).returning();
    revalidatePath("/blog");
    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    const { status } = getDatabaseErrorResponse(err);
    const error = status === 409 ? "A tag with this name already exists." : "Database error";
    return NextResponse.json({ error }, { status });
  }
}
