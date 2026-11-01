/**
 * A small fixed-window counter kept in memory, keyed by e.g. client IP.
 *
 * On serverless hosts each instance has its own memory, so this slows an
 * attacker down rather than giving an exact global limit. For a hard limit,
 * add a rate-limit rule in the Vercel Firewall as well.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number
  windowMs: number
  now?: () => number
}) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  function entry(key: string) {
    const t = now()
    let e = hits.get(key)
    if (!e || e.resetAt <= t) {
      e = { count: 0, resetAt: t + windowMs }
      hits.set(key, e)
    }
    // Keep the map from growing without bound.
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k)
    }
    return e
  }

  return {
    /** Seconds until the key may try again, or 0 if it may try now. */
    retryAfter(key: string) {
      const e = entry(key)
      return e.count >= limit ? Math.ceil((e.resetAt - now()) / 1000) : 0
    },
    /** Counts one attempt (call it for failures). */
    hit(key: string) {
      entry(key).count++
    },
    /** Forgets the key (call it after a success). */
    reset(key: string) {
      hits.delete(key)
    },
  }
}

/** The client's IP as seen through the platform proxy. */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  )
}
