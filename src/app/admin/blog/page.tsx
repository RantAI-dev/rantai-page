import { Suspense } from "react";
import Link from "next/link";
import { asc, desc, ilike, or, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { blogColumns } from "./columns";

const PAGE_SIZE = 10;

const sortableColumns = {
  title: blogPosts.title,
  tag: blogPosts.tag,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
} as const;

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const sortKey = (params.sort ?? "createdAt") as keyof typeof sortableColumns;
  const order = params.order === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page ?? "1"));

  const col = sortableColumns[sortKey] ?? blogPosts.createdAt;
  const orderFn = order === "asc" ? asc : desc;
  const whereClause = q
    ? or(ilike(blogPosts.title, `%${q}%`), ilike(blogPosts.tag, `%${q}%`))
    : undefined;

  const [posts, [{ total }]] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(orderFn(col))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(blogPosts).where(whereClause),
  ]);

  const pageCount = Math.ceil(Number(total) / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button size="sm">New Post</Button>
        </Link>
      </div>
      <Suspense>
        <DataTable
          columns={blogColumns}
          data={posts}
          pageCount={pageCount}
          searchPlaceholder="Search by title or tag..."
        />
      </Suspense>
    </div>
  );
}
