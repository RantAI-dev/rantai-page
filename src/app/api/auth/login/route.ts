import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !adminPasswordHash) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  if (email !== adminEmail) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await verifyPassword(password, adminPasswordHash)

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = await createToken({ email })

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
