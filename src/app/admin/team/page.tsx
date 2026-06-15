import { Suspense } from "react";
import Link from "next/link";
import { asc, desc, ilike, or, count, and, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

import { Button } from "@/components/ui/button";
import { TeamTable } from "./team-table";

const DEFAULT_PAGE_SIZE = 10;

const sortableColumns = {
  name: teamMembers.name,
  role: teamMembers.role,
  orderIndex: teamMembers.orderIndex,
  createdAt: teamMembers.createdAt,
  updatedAt: teamMembers.updatedAt,
} as const;

function parseSort(value: string | undefined) {
  try {
    const parsed = JSON.parse(value ?? "");
    if (Array.isArray(parsed) && parsed[0] && typeof parsed[0].id === "string") {
      const id = parsed[0].id as keyof typeof sortableColumns;
      if (id in sortableColumns) {
        return { key: id, desc: Boolean(parsed[0].desc) };
      }
    }
  } catch {
    // fall through to default
  }
  return { key: "orderIndex" as const, desc: false };
}

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? "1"));
  const perPage = Math.max(1, Number(params.perPage ?? DEFAULT_PAGE_SIZE));

  const { key: sortKey, desc: sortDesc } = parseSort(params.sort);
  const col = sortableColumns[sortKey];
  const orderFn = sortDesc ? desc : asc;

  const roleFilter = params.role ? params.role.split(",").filter(Boolean) : [];

  const conditions = [
    q ? or(ilike(teamMembers.name, `%${q}%`), ilike(teamMembers.role, `%${q}%`)) : undefined,
    roleFilter.length ? inArray(teamMembers.role, roleFilter) : undefined,
  ].filter(Boolean) as Parameters<typeof and>;

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [members, [{ total }], uniqueRoleRows] = await Promise.all([
    db
      .select()
      .from(teamMembers)
      .where(whereClause)
      .orderBy(orderFn(col))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ total: count() }).from(teamMembers).where(whereClause),
    db.selectDistinct({ role: teamMembers.role }).from(teamMembers).orderBy(asc(teamMembers.role)),
  ]);

  const roles = uniqueRoleRows.map((r) => r.role);
  const pageCount = Math.ceil(Number(total) / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Link href="/admin/team/new">
          <Button>New Member</Button>
        </Link>
      </div>
      <Suspense>
        <TeamTable data={members} pageCount={pageCount} roles={roles} />
      </Suspense>
    </div>
  );
}
