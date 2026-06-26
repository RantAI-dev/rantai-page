import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import {
  getBlogInputError,
  getDatabaseErrorResponse,
  normalizeBlogInput,
  scheduleWasInvalid,
} from "@/lib/blog-input";
import { generateUniqueSlug } from "@/lib/blog-slug";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const input = normalizeBlogInput(body);
  const inputError = getBlogInputError(input);

  if (inputError) {
    return NextResponse.json({ error: inputError }, { status: 400 });
  }

  if (scheduleWasInvalid(body)) {
    return NextResponse.json({ error: "Invalid schedule date" }, { status: 400 });
  }

  try {
    const slug = await generateUniqueSlug(input.title);
    const [post] = await db
      .insert(blogPosts)
      .values({ ...input, slug })
      .returning();

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const { message, status } = getDatabaseErrorResponse(err);
    return NextResponse.json({ error: message }, { status });
  }
}
