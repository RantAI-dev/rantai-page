import { NextRequest, NextResponse } from "next/server"
import { revalidatePosts } from "@/lib/revalidate"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import {
  getBlogInputError,
  getDatabaseErrorResponse,
  normalizeBlogInput,
  scheduleWasInvalid,
} from "@/lib/blog/input"
import { generateUniqueSlug } from "@/lib/blog/slug"
import { desc } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
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

  try {
    const slug = await generateUniqueSlug(input.title)
    const now = new Date()
    const scheduledFor = input.published ? null : input.scheduledFor
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...input,
        slug,
        scheduledFor,
        publishedAt: input.published ? now : null,
      })
      .returning()

    revalidatePosts(post.slug)
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    const { message, status } = getDatabaseErrorResponse(err)
    return NextResponse.json({ error: message }, { status })
  }
}
