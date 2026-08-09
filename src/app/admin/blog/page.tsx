import { Suspense } from "react"
import Link from "next/link"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import {
  getBlogPublicationStatus,
  type BlogPublicationStatus,
} from "@/lib/blog-date"
import { db } from "@/lib/db"
import { blogPosts, tags as tagsTable } from "@/lib/db/schema"

import { Button } from "@/components/ui/button"
import { BlogTable } from "./blog-table"

const DEFAULT_PAGE_SIZE = 10

const sortableColumns = {
  title: blogPosts.title,
  tag: blogPosts.tag,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
  scheduledFor: sql`coalesce(
    ${blogPosts.publishedAt},
    ${blogPosts.scheduledFor},
    ${blogPosts.createdAt}
  )`,
} as const

function parseSort(value: string | undefined) {
  try {
    const parsed = JSON.parse(value ?? "")
    if (
      Array.isArray(parsed) &&
      parsed[0] &&
      typeof parsed[0].id === "string"
    ) {
      const id = parsed[0].id as keyof typeof sortableColumns
      if (id in sortableColumns) {
        return { key: id, desc: Boolean(parsed[0].desc) }
      }
    }
  } catch {
    // fall through to default
  }
  return { key: "scheduledFor" as const, desc: true }
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams

  const q = params.q ?? ""
  const page = Math.max(1, Number(params.page ?? "1"))
  const perPage = Math.max(1, Number(params.perPage ?? DEFAULT_PAGE_SIZE))

  const { key: sortKey, desc: sortDesc } = parseSort(params.sort)
  const col = sortableColumns[sortKey]
  const orderFn = sortDesc ? desc : asc

  const tagFilter = params.tag ? params.tag.split(",").filter(Boolean) : []
  const statusFilter = params.publicationStatus
    ? params.publicationStatus.split(",").filter(Boolean)
    : []

  const now = new Date()
  const statusConditions = statusFilter.flatMap((status): SQL[] => {
    if (status === "published") {
      return [
        or(
          eq(blogPosts.published, true),
          and(
            eq(blogPosts.published, false),
            isNotNull(blogPosts.scheduledFor),
            lte(blogPosts.scheduledFor, now)
          )
        )!,
      ]
    }

    if (status === "scheduled") {
      return [
        and(eq(blogPosts.published, false), gt(blogPosts.scheduledFor, now))!,
      ]
    }

    if (status === "draft") {
      return [
        and(eq(blogPosts.published, false), isNull(blogPosts.scheduledFor))!,
      ]
    }

    return []
  })

  const conditions = [
    q
      ? or(ilike(blogPosts.title, `%${q}%`), ilike(blogPosts.tag, `%${q}%`))
      : undefined,
    tagFilter.length ? inArray(blogPosts.tag, tagFilter) : undefined,
    statusConditions.length ? or(...statusConditions) : undefined,
  ].filter(Boolean) as Parameters<typeof and>

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [posts, [{ total }], tagRows] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(orderFn(col), desc(blogPosts.id))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ total: count() }).from(blogPosts).where(whereClause),
    db
      .select({ name: tagsTable.name })
      .from(tagsTable)
      .orderBy(asc(tagsTable.orderIndex)),
  ])

  const postsWithStatus = posts.map((post) => ({
    ...post,
    publicationStatus: getBlogPublicationStatus(
      post,
      now
    ) as BlogPublicationStatus,
  }))
  const tags = tagRows.map((r) => r.name)
  const pageCount = Math.ceil(Number(total) / perPage)

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">
            Create, review, and publish editorial content for the RantAI site.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <Suspense>
        <BlogTable data={postsWithStatus} pageCount={pageCount} tags={tags} />
      </Suspense>
    </div>
  )
}
