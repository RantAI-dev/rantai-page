import { Suspense } from "react";
import Link from "next/link";
import { asc, desc, ilike, or, count, eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

import { Button } from "@/components/ui/button";
import { BlogTable } from "./blog-table";

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
  const filterTag = params.tag ?? "";
  const filterStatus = params.status ?? "";
  const sortKey = (params.sort ?? "createdAt") as keyof typeof sortableColumns;
  const order = params.order === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page ?? "1"));

  const col = sortableColumns[sortKey] ?? blogPosts.createdAt;
  const orderFn = order === "asc" ? asc : desc;

  const conditions = [
    q ? or(ilike(blogPosts.title, `%${q}%`), ilike(blogPosts.tag, `%${q}%`)) : undefined,
    filterTag ? eq(blogPosts.tag, filterTag) : undefined,
    filterStatus === "published" ? eq(blogPosts.published, true) : undefined,
    filterStatus === "draft" ? eq(blogPosts.published, false) : undefined,
  ].filter(Boolean) as Parameters<typeof and>;

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [posts, [{ total }], uniqueTagRows] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(orderFn(col))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(blogPosts).where(whereClause),
    db.selectDistinct({ tag: blogPosts.tag }).from(blogPosts).orderBy(asc(blogPosts.tag)),
  ]);

  const tags = uniqueTagRows.map((r) => r.tag);
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
        <BlogTable
          data={posts}
          pageCount={pageCount}
          tags={tags}
          initialTag={filterTag}
          initialStatus={filterStatus}
        />
      </Suspense>
    </div>
  );
}
