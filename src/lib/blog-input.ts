export type BlogInputBody = {
  title?: unknown;
  slug?: unknown;
  content?: unknown;
  excerpt?: unknown;
  tag?: unknown;
  author?: unknown;
  thumbnail?: unknown;
  published?: unknown;
};

export type NormalizedBlogInput = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tag: string;
  author: string | null;
  thumbnail: string | null;
  published: boolean;
};

const REQUIRED_FIELDS = ["title", "slug", "content", "excerpt", "tag"] as const;

function requiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\r\n?/g, "\n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeBlogInput(body: BlogInputBody): NormalizedBlogInput {
  return {
    title: requiredText(body.title),
    slug: normalizeSlug(requiredText(body.slug)),
    content: requiredText(body.content),
    excerpt: requiredText(body.excerpt),
    tag: requiredText(body.tag),
    author: nullableText(body.author),
    thumbnail: nullableText(body.thumbnail),
    published: typeof body.published === "boolean" ? body.published : true,
  };
}

export function getBlogInputError(input: NormalizedBlogInput) {
  const missingFields = REQUIRED_FIELDS.filter((field) => !input[field]);

  if (missingFields.length > 0) {
    return "Missing required fields";
  }

  return null;
}

export function isPublishedOnlyBlogUpdate(body: BlogInputBody) {
  const keys = Object.keys(body);
  return keys.length === 1 && keys[0] === "published" && typeof body.published === "boolean";
}

export function getDatabaseErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Database error";
  const normalizedMessage = message.toLowerCase();
  const isDuplicate = normalizedMessage.includes("unique") || normalizedMessage.includes("duplicate");

  return {
    message: isDuplicate ? "A post with this slug already exists." : "Database error",
    status: isDuplicate ? 409 : 500,
  };
}
