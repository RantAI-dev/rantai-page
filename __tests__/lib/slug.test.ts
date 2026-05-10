import { describe, it, expect } from "vitest";

// Pure function copied from components/admin/blog-form.tsx
function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("generateSlug", () => {
  it("lowercases the input", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("my blog post")).toBe("my-blog-post");
  });

  it("strips leading and trailing hyphens", () => {
    expect(generateSlug("  leading and trailing  ")).toBe("leading-and-trailing");
  });

  it("removes special characters", () => {
    expect(generateSlug("AI & ML: Best Practices!")).toBe("ai-ml-best-practices");
  });

  it("collapses multiple separators into one hyphen", () => {
    expect(generateSlug("foo---bar")).toBe("foo-bar");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("handles numbers", () => {
    expect(generateSlug("Top 10 Tips")).toBe("top-10-tips");
  });
});
