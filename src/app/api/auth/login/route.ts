import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth"
import { clientIp, createRateLimiter } from "@/lib/rate-limit"

// Five failed sign-ins per IP per 15 minutes, then a pause.
const limiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 })

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers)
  const wait = limiter.retryAfter(ip)
  if (wait > 0) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(wait) } }
    )
  }

  let email: unknown, password: unknown
  try {
    ;({ email, password } = await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !adminPasswordHash) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  // Check the password even when the email is wrong, so the response time
  // doesn't reveal which emails exist.
  const emailMatches = email.trim().toLowerCase() === adminEmail.toLowerCase()
  const passwordMatches = await verifyPassword(password, adminPasswordHash)

  if (!emailMatches || !passwordMatches) {
    limiter.hit(ip)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  limiter.reset(ip)
  const token = await createToken({ email: adminEmail })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}
