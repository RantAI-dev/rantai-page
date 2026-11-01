import { NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

import { verifyToken } from "@/lib/auth"
import { BLOG_SLUG_MAX_LENGTH } from "@/lib/blog/input"
import { routing } from "@/i18n/routing"

// Picks the language for public pages (English at /, Indonesian at /id).
const intl = createIntlMiddleware(routing)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The CMS: signed-in admins only. Not localized.
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value
    const session = token ? await verifyToken(token) : null
    if (!session) return NextResponse.redirect(new URL("/login", req.url))
    return NextResponse.next()
  }

  // Overlong article slugs can't exist: answer with the not-found page
  // without touching the database.
  const slug = pathname.match(/^(?:\/id)?\/blog\/([^/]+)$/)?.[1]
  if (slug && slug.length > BLOG_SLUG_MAX_LENGTH) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(slug, "__not_found__")
    return intl(new NextRequest(url, req))
  }

  return intl(req)
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Public pages: everything except API routes, Next/Vercel internals, the
    // CMS sign-in and files with an extension (sitemap.xml, images, ...).
    "/((?!api|_next|_vercel|admin|login|.*\\..*).*)",
  ],
}
