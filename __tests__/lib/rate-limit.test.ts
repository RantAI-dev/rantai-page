import { describe, expect, it } from "vitest"

import { clientIp, createRateLimiter } from "@/lib/rate-limit"

describe("createRateLimiter", () => {
  it("blocks after the limit until the window passes", () => {
    let t = 0
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t })
    expect(rl.retryAfter("ip")).toBe(0)
    rl.hit("ip")
    rl.hit("ip")
    expect(rl.retryAfter("ip")).toBe(1)
    t = 999
    expect(rl.retryAfter("ip")).toBe(1)
    t = 1000
    expect(rl.retryAfter("ip")).toBe(0)
  })

  it("keeps keys apart and forgets a key on reset", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000 })
    rl.hit("a")
    expect(rl.retryAfter("a")).toBeGreaterThan(0)
    expect(rl.retryAfter("b")).toBe(0)
    rl.reset("a")
    expect(rl.retryAfter("a")).toBe(0)
  })
})

describe("clientIp", () => {
  it("takes the first forwarded address", () => {
    expect(
      clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))
    ).toBe("1.2.3.4")
    expect(clientIp(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8")
    expect(clientIp(new Headers())).toBe("unknown")
  })
})
