import { describe, expect, it } from "vitest"

import {
  getBlogPostingDate,
  getBlogPublicationStatus,
  getPublishedAtForUpdate,
} from "@/lib/blog-date"

describe("getBlogPostingDate", () => {
  it("uses the scheduled date for a scheduled post", () => {
    const postingDate = getBlogPostingDate({
      createdAt: new Date("2026-08-09T08:00:00.000Z"),
      published: false,
      scheduledFor: new Date("2026-08-10T02:00:00.000Z"),
    })

    expect(postingDate?.toISOString()).toBe("2026-08-10T02:00:00.000Z")
  })

  it("uses the created date for a post published immediately", () => {
    const postingDate = getBlogPostingDate({
      createdAt: "2026-08-09T08:00:00.000Z",
      published: true,
      scheduledFor: null,
    })

    expect(postingDate?.toISOString()).toBe("2026-08-09T08:00:00.000Z")
  })

  it("uses the persisted publication time instead of the creation time", () => {
    const postingDate = getBlogPostingDate({
      createdAt: "2026-08-01T08:00:00.000Z",
      published: true,
      publishedAt: "2026-08-09T10:30:00.000Z",
      scheduledFor: null,
    })

    expect(postingDate?.toISOString()).toBe("2026-08-09T10:30:00.000Z")
  })

  it("prefers the actual publication time over a stale schedule", () => {
    const postingDate = getBlogPostingDate({
      createdAt: "2026-08-01T08:00:00.000Z",
      published: true,
      publishedAt: "2026-08-09T10:30:00.000Z",
      scheduledFor: "2026-08-10T02:00:00.000Z",
    })

    expect(postingDate?.toISOString()).toBe("2026-08-09T10:30:00.000Z")
  })

  it("returns no posting date for a draft", () => {
    expect(
      getBlogPostingDate({
        createdAt: "2026-08-09T08:00:00.000Z",
        published: false,
        scheduledFor: null,
      })
    ).toBeNull()
  })
})

describe("getBlogPublicationStatus", () => {
  const now = new Date("2026-08-09T08:00:00.000Z")

  it("distinguishes published, scheduled, and draft posts", () => {
    expect(getBlogPublicationStatus({ published: true }, now)).toBe("published")
    expect(
      getBlogPublicationStatus(
        { published: false, scheduledFor: "2026-08-10T08:00:00.000Z" },
        now
      )
    ).toBe("scheduled")
    expect(
      getBlogPublicationStatus({ published: false, scheduledFor: null }, now)
    ).toBe("draft")
  })

  it("treats a due scheduled post as published before the cron updates its flag", () => {
    expect(
      getBlogPublicationStatus(
        { published: false, scheduledFor: "2026-08-08T08:00:00.000Z" },
        now
      )
    ).toBe("published")
  })
})

describe("getPublishedAtForUpdate", () => {
  const now = new Date("2026-08-09T12:00:00.000Z")

  it("sets the current time when a draft is published", () => {
    expect(
      getPublishedAtForUpdate(
        {
          published: false,
          publishedAt: null,
          scheduledFor: null,
          createdAt: "2026-08-01T08:00:00.000Z",
        },
        true,
        now
      )
    ).toEqual(now)
  })

  it("preserves the publication time when published content is edited", () => {
    expect(
      getPublishedAtForUpdate(
        {
          published: true,
          publishedAt: "2026-08-05T09:00:00.000Z",
          scheduledFor: null,
          createdAt: "2026-08-01T08:00:00.000Z",
        },
        true,
        now
      )?.toISOString()
    ).toBe("2026-08-05T09:00:00.000Z")
  })

  it("preserves the legacy fallback date when an old published row is edited", () => {
    expect(
      getPublishedAtForUpdate(
        {
          published: true,
          publishedAt: null,
          scheduledFor: "2026-08-04T09:00:00.000Z",
          createdAt: "2026-08-01T08:00:00.000Z",
        },
        true,
        now
      )?.toISOString()
    ).toBe("2026-08-04T09:00:00.000Z")
  })

  it("clears the publication time when a post moves to draft", () => {
    expect(
      getPublishedAtForUpdate(
        {
          published: true,
          publishedAt: "2026-08-05T09:00:00.000Z",
          scheduledFor: null,
          createdAt: "2026-08-01T08:00:00.000Z",
        },
        false,
        now
      )
    ).toBeNull()
  })
})
