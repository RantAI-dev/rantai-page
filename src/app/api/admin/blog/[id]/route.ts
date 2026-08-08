import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import {
  getBlogInputError,
  getDatabaseErrorResponse,
  isPublishedOnlyBlogUpdate,
  normalizeBlogInput,
  scheduleWasInvalid,
} from "@/lib/blog-input"
import { generateUniqueSlug } from "@/lib/blog-slug"
import { getPublishedAtForUpdate } from "@/lib/blog-date"
import { eq } from "drizzle-orm"

function revalidateBlogPages(...slugs: string[]) {
  revalidatePath("/blog")
  revalidatePath("/blog/[slug]", "page")
  for (const slug of slugs) {
    revalidatePath(`/blog/${slug}`)
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id))
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(post)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  try {
    if (isPublishedOnlyBlogUpdate(body)) {
      const [existingPost] = await db
        .select({
          published: blogPosts.published,
          publishedAt: blogPosts.publishedAt,
          scheduledFor: blogPosts.scheduledFor,
          createdAt: blogPosts.createdAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.id, id))

      if (!existingPost)
        return NextResponse.json({ error: "Not found" }, { status: 404 })

      const now = new Date()
      const [post] = await db
        .update(blogPosts)
        .set({
          published: body.published,
          publishedAt: getPublishedAtForUpdate(
            existingPost,
            body.published,
            now
          ),
          scheduledFor: null,
          updatedAt: now,
        })
        .where(eq(blogPosts.id, id))
        .returning()

      revalidateBlogPages()
      return NextResponse.json(post)
    }

    const input = normalizeBlogInput(body)
    const inputError = getBlogInputError(input)

    if (inputError) {
      return NextResponse.json({ error: inputError }, { status: 400 })
    }

    if (scheduleWasInvalid(body)) {
      return NextResponse.json(
        { error: "Invalid schedule date" },
        { status: 400 }
      )
    }

    const [existingPost] = await db
      .select({
        title: blogPosts.title,
        slug: blogPosts.slug,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        scheduledFor: blogPosts.scheduledFor,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))

    if (!existingPost) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Keep the current URL for metadata-only edits, but derive a new unique
    // slug when the title changes. The old URL intentionally becomes a 404.
    const nextSlug =
      input.title === existingPost.title
        ? existingPost.slug
        : await generateUniqueSlug(input.title, id)
    const { slug: _ignoredSlug, ...updatable } = input
    void _ignoredSlug
    const now = new Date()
    const [post] = await db
      .update(blogPosts)
      .set({
        ...updatable,
        slug: nextSlug,
        publishedAt: getPublishedAtForUpdate(
          existingPost,
          input.published,
          now
        ),
        scheduledFor: input.published ? null : input.scheduledFor,
        updatedAt: now,
      })
      .where(eq(blogPosts.id, id))
      .returning()

    revalidateBlogPages(existingPost.slug, post.slug)
    return NextResponse.json(post)
  } catch (err) {
    const { message, status } = getDatabaseErrorResponse(err)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  revalidateBlogPages()
  return NextResponse.json({ ok: true })
}
