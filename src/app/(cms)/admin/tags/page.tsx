import { Suspense } from "react";
import Link from "next/link";
import { asc, desc, ilike, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";

import { Button } from "@/components/ui/button";
import { TagsTable } from "./tags-table";

const DEFAULT_PAGE_SIZE = 10;

const sortableColumns = {
  name: tags.name,
  orderIndex: tags.orderIndex,
  createdAt: tags.createdAt,
  updatedAt: tags.updatedAt,
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

export default async function AdminTagsPage({
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

  const whereClause = q ? ilike(tags.name, `%${q}%`) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(tags)
      .where(whereClause)
      .orderBy(orderFn(col))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ total: count() }).from(tags).where(whereClause),
  ]);

  const pageCount = Math.ceil(Number(total) / perPage);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            Organize blog topics and keep the content taxonomy tidy.
          </p>
        </div>
        <Link href="/admin/tags/new">
          <Button>New Tag</Button>
        </Link>
      </div>
      <Suspense>
        <TagsTable data={rows} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
