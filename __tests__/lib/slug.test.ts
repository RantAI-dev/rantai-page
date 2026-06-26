import { describe, it, expect } from "vitest";
import {
  getBlogInputError,
  isPublishedOnlyBlogUpdate,
  normalizeBlogInput,
  normalizeSlug,
  scheduleWasInvalid,
} from "@/lib/blog-input";

describe("normalizeSlug", () => {
  it("lowercases the input", () => {
    expect(normalizeSlug("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(normalizeSlug("my blog post")).toBe("my-blog-post");
  });

  it("strips leading and trailing hyphens", () => {
    expect(normalizeSlug("  leading and trailing  ")).toBe("leading-and-trailing");
  });

  it("removes special characters", () => {
    expect(normalizeSlug("AI & ML: Best Practices!")).toBe("ai-ml-best-practices");
  });

  it("collapses multiple separators into one hyphen", () => {
    expect(normalizeSlug("foo---bar")).toBe("foo-bar");
  });

  it("handles empty string", () => {
    expect(normalizeSlug("")).toBe("");
  });

  it("handles numbers", () => {
    expect(normalizeSlug("Top 10 Tips")).toBe("top-10-tips");
  });

  it("normalizes Windows CRLF input", () => {
    expect(normalizeSlug("Rust Mutex\r\nConcurrency")).toBe("rust-mutex-concurrency");
  });
});

describe("normalizeBlogInput", () => {
  it("trims text fields and normalizes the slug", () => {
    expect(
      normalizeBlogInput({
        title: "  Rust Mutex  ",
        slug: " Rust Mutex?\r\nConcurrency ",
        content: " <p>Hello</p> ",
        excerpt: "  Short summary  ",
        tag: " Academy ",
        author: " RantAI ",
        thumbnail: " https://example.com/image.png ",
        published: false,
      }),
    ).toEqual({
      title: "Rust Mutex",
      slug: "rust-mutex-concurrency",
      content: "<p>Hello</p>",
      excerpt: "Short summary",
      tag: "Academy",
      author: "RantAI",
      thumbnail: "https://example.com/image.png",
      published: false,
      scheduledFor: null,
    });
  });

  it("defaults scheduledFor to null when absent", () => {
    const input = normalizeBlogInput({ title: "T", content: "C", excerpt: "E", tag: "Tag" });
    expect(input.scheduledFor).toBeNull();
  });

  it("parses an ISO schedule string into a Date", () => {
    const input = normalizeBlogInput({
      title: "T",
      content: "C",
      excerpt: "E",
      tag: "Tag",
      scheduledFor: "2026-07-01T09:00:00.000Z",
    });
    expect(input.scheduledFor).toBeInstanceOf(Date);
    expect(input.scheduledFor?.toISOString()).toBe("2026-07-01T09:00:00.000Z");
  });

  it("treats an empty schedule string as not scheduled", () => {
    const input = normalizeBlogInput({ title: "T", content: "C", excerpt: "E", tag: "Tag", scheduledFor: "  " });
    expect(input.scheduledFor).toBeNull();
  });
});

describe("scheduleWasInvalid", () => {
  it("is false when no schedule is provided", () => {
    expect(scheduleWasInvalid({ title: "T" })).toBe(false);
    expect(scheduleWasInvalid({ scheduledFor: "" })).toBe(false);
  });

  it("is false for a valid schedule string", () => {
    expect(scheduleWasInvalid({ scheduledFor: "2026-07-01T09:00" })).toBe(false);
  });

  it("is true for an unparseable schedule value", () => {
    expect(scheduleWasInvalid({ scheduledFor: "not-a-date" })).toBe(true);
  });

  it("reports empty required fields", () => {
    const input = normalizeBlogInput({
      title: " ",
      slug: "",
      content: "",
      excerpt: "",
      tag: "",
    });

    expect(getBlogInputError(input)).toBe("Missing required fields");
  });
});

describe("isPublishedOnlyBlogUpdate", () => {
  it("accepts a partial published update", () => {
    expect(isPublishedOnlyBlogUpdate({ published: false })).toBe(true);
  });

  it("rejects mixed update payloads", () => {
    expect(isPublishedOnlyBlogUpdate({ title: "Post", published: false })).toBe(false);
  });
});
