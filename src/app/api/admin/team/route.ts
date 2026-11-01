import { NextRequest, NextResponse } from "next/server";
import { revalidateTeam } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { parseTeamInput, readJson } from "@/lib/admin-input";
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

  const input = parseTeamInput(await readJson(req));
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });

  const [member] = await db.insert(teamMembers).values(input.data).returning();

  revalidateTeam();
  return NextResponse.json(member, { status: 201 });
}
