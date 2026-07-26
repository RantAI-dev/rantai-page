import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { BLOG_SLUG_MAX_LENGTH } from "@/lib/blog-input";

export async function proxy(req: NextRequest) {
  const blogSlug = req.nextUrl.pathname.match(/^\/blog\/([^/]+)$/)?.[1];
  if (blogSlug) {
    if (blogSlug.length > BLOG_SLUG_MAX_LENGTH) {
      const notFoundUrl = req.nextUrl.clone();
      notFoundUrl.pathname = "/blog/__not_found__";
      return NextResponse.rewrite(notFoundUrl);
    }
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/blog/:slug"],
};
