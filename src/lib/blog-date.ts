type BlogDateFields = {
  createdAt: Date | string
  published: boolean
  publishedAt?: Date | string | null
  scheduledFor?: Date | string | null
}

type BlogStatusFields = Pick<BlogDateFields, "published" | "scheduledFor">

type ExistingPublicationFields = {
  published: boolean
  publishedAt?: Date | string | null
  scheduledFor?: Date | string | null
  createdAt: Date | string
}

export type BlogPublicationStatus = "published" | "scheduled" | "draft"

function validDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getBlogPublicationStatus(
  post: BlogStatusFields,
  now = new Date()
): BlogPublicationStatus {
  const scheduledDate = validDate(post.scheduledFor)

  if (post.published || (scheduledDate && scheduledDate <= now)) {
    return "published"
  }

  return scheduledDate ? "scheduled" : "draft"
}

/**
 * Returns the date readers should see for a post.
 *
 * Published posts use their persisted publication time. Scheduled posts use
 * their intended go-live time. The created date is only a compatibility
 * fallback for published rows created before `publishedAt` existed.
 */
export function getBlogPostingDate(post: BlogDateFields): Date | null {
  const publishedDate = validDate(post.publishedAt)
  if (publishedDate) return publishedDate

  const scheduledDate = validDate(post.scheduledFor)
  if (scheduledDate) return scheduledDate
  return post.published ? validDate(post.createdAt) : null
}

/**
 * Resolves the timestamp for a full post update without moving the publication
 * date when an already-published legacy row is merely edited.
 */
export function getPublishedAtForUpdate(
  existing: ExistingPublicationFields,
  nextPublished: boolean,
  now = new Date()
): Date | null {
  if (!nextPublished) return null
  if (!existing.published) return now

  return getBlogPostingDate(existing) ?? now
}
