import { NextRequest, NextResponse } from "next/server";
import { revalidateTeam } from "@/lib/revalidate";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { parseTeamInput, readJson } from "@/lib/admin-input";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = parseTeamInput(await readJson(req));
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });

  const [member] = await db
    .update(teamMembers)
    .set({ ...input.data, updatedAt: new Date() })
    .where(eq(teamMembers.id, id))
    .returning();

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTeam();
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidateTeam();
  return NextResponse.json({ ok: true });
}
