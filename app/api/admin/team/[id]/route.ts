import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

function revalidateTeamPages() {
  revalidatePath("/our-team");
  revalidatePath("/team");
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, role, bio, imageUrl, linkedin, github, orderIndex } = body;

  const [member] = await db
    .update(teamMembers)
    .set({ name, role, bio, imageUrl, linkedin, github, orderIndex, updatedAt: new Date() })
    .where(eq(teamMembers.id, id))
    .returning();

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTeamPages();
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidateTeamPages();
  return NextResponse.json({ ok: true });
}
