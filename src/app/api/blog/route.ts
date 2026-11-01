import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/blog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const page = await getPosts({ cursor, query: q, tag });
  return NextResponse.json(page);
}
