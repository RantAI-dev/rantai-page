import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminTeamPage() {
  const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.orderIndex));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Link href="/admin/team/new">
          <Button size="sm">New Member</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">Photo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No team members yet.</td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  {m.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={m.imageUrl} alt={m.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/team/${m.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <DeleteButton id={m.id} endpoint="/api/admin/team" redirectTo="/admin/team" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
