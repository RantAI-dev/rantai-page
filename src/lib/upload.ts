// Shared upload limits so the client (fail-fast validation) and the server
// (authoritative enforcement) agree on the same numbers.

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 // 2MB
export const MAX_UPLOAD_LABEL = "2MB"

export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const

// Blob storage folders, one per asset kind. The client sends a `folder` with
// each upload; the server validates it against this list and falls back to
// `uploads/` for anything unrecognized (so a bad value can't write elsewhere).
export const UPLOAD_FOLDERS = [
  "thumbnails", // blog post thumbnails
  "books", // book cover images
  "team", // team member photos
  "content", // inline images inside the blog content editor
  "assets", // reusable thumbnail building blocks (custom icons/decorations) & design previews
  "uploads", // fallback
] as const

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number]

export function resolveUploadFolder(folder: string | null | undefined): UploadFolder {
  return folder && (UPLOAD_FOLDERS as readonly string[]).includes(folder)
    ? (folder as UploadFolder)
    : "uploads"
}

// Returns an error message if the file is invalid, or null if it passes.
export function getUploadError(file: { type: string; size: number }): string | null {
  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return "File type not allowed"
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File too large (max ${MAX_UPLOAD_LABEL})`
  }
  return null
}
