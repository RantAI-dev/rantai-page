import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TeamForm } from "@/components/admin/team-form";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));

  if (!member) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Team Member</h1>
      <TeamForm member={member} />
    </div>
  );
}
