import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(teamMembers).orderBy(asc(teamMembers.orderIndex));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, role, bio, imageUrl, linkedin, github, orderIndex } = body;

  if (!name || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [member] = await db
    .insert(teamMembers)
    .values({ name, role, bio, imageUrl, linkedin, github, orderIndex: orderIndex ?? 0 })
    .returning();

  return NextResponse.json(member, { status: 201 });
}
