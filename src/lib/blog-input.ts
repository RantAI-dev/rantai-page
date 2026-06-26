export type BlogInputBody = {
  title?: unknown;
  slug?: unknown;
  content?: unknown;
  excerpt?: unknown;
  tag?: unknown;
  author?: unknown;
  thumbnail?: unknown;
  published?: unknown;
  scheduledFor?: unknown;
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
  // null = not scheduled. A Date in the future means the post stays hidden until
  // then; a Date in the past is treated as "publish now" by the visibility rules.
  scheduledFor: Date | null;
};

// Slug is intentionally omitted: it is generated server-side from the title
// (see generateUniqueSlug) so it is always present and unique, never user input.
const REQUIRED_FIELDS = ["title", "content", "excerpt", "tag"] as const;

function requiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

// Accepts a Date, an ISO string, or a datetime-local string ("2026-07-01T09:00").
// Empty / absent → null (not scheduled). An unparseable value also collapses to
// null here; callers that need to reject bad input use scheduleWasInvalid().
function nullableDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") {
    if (!value.trim()) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

// True when a non-empty schedule value was supplied but could not be parsed,
// so the route can return a 400 instead of silently dropping the schedule.
export function scheduleWasInvalid(body: BlogInputBody): boolean {
  const raw = body.scheduledFor;
  if (raw == null) return false;
  if (typeof raw === "string" && !raw.trim()) return false;
  return nullableDate(raw) === null;
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
    scheduledFor: nullableDate(body.scheduledFor),
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

// Postgres unique_violation. Drizzle wraps the driver error, so the real
// code/message lives on the `cause` chain rather than the top-level error.
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown) {
  let current: unknown = err;

  for (let depth = 0; current && depth < 5; depth++) {
    const candidate = current as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === UNIQUE_VIOLATION) return true;

    if (typeof candidate.message === "string") {
      const message = candidate.message.toLowerCase();
      if (message.includes("unique") || message.includes("duplicate")) return true;
    }

    current = candidate.cause;
  }

  return false;
}

export function getDatabaseErrorResponse(err: unknown) {
  const isDuplicate = isUniqueViolation(err);

  return {
    message: isDuplicate ? "A post with this slug already exists." : "Database error",
    status: isDuplicate ? 409 : 500,
  };
}
