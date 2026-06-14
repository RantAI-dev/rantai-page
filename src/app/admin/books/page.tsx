import { Suspense } from "react";
import Link from "next/link";
import { asc, desc, ilike, or, count, and, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";

import { Button } from "@/components/ui/button";
import { BooksTable } from "./books-table";

const DEFAULT_PAGE_SIZE = 10;

const sortableColumns = {
  code: books.code,
  name: books.name,
  category: books.category,
  orderIndex: books.orderIndex,
  createdAt: books.createdAt,
  updatedAt: books.updatedAt,
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

export default async function AdminBooksPage({
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

  const categoryFilter = params.category
    ? params.category.split(",").filter(Boolean)
    : [];

  const conditions = [
    q ? or(ilike(books.code, `%${q}%`), ilike(books.name, `%${q}%`)) : undefined,
    categoryFilter.length ? inArray(books.category, categoryFilter) : undefined,
  ].filter(Boolean) as Parameters<typeof and>;

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ total }], uniqueCategoryRows] = await Promise.all([
    db
      .select()
      .from(books)
      .where(whereClause)
      .orderBy(orderFn(col))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ total: count() }).from(books).where(whereClause),
    db.selectDistinct({ category: books.category }).from(books).orderBy(asc(books.category)),
  ]);

  const categories = uniqueCategoryRows.map((r) => r.category);
  const pageCount = Math.ceil(Number(total) / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Link href="/admin/books/new">
          <Button size="sm">New Book</Button>
        </Link>
      </div>
      <Suspense>
        <BooksTable data={rows} pageCount={pageCount} categories={categories} />
      </Suspense>
    </div>
  );
}
