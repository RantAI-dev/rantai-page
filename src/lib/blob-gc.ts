import { del, list } from "@vercel/blob";

import { db } from "@/lib/db";
import { blogPosts, books, teamMembers, thumbnailDesigns } from "@/lib/db/schema";
import { UPLOAD_FOLDERS } from "@/lib/upload";

// GC only sweeps folders whose lifecycle is fully owned by the app's upload
// system (and thus the DB). Anything outside these prefixes — e.g. videos/ and
// other assets uploaded manually and referenced from source code, not the DB —
// is never touched, since the DB scan can't see those references.
const MANAGED_PREFIXES = UPLOAD_FOLDERS.map((folder) => `${folder}/`);

function isManaged(pathname: string): boolean {
  return MANAGED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Matches any Vercel Blob URL, e.g. inside blog content HTML (<img src="...">).
const BLOB_URL_RE =
  /https?:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"')]+/gi;

// New uploads aren't referenced by the DB until the user submits the form, so
// anything younger than this window is left alone to avoid deleting in-flight files.
const DEFAULT_GRACE_MS = 24 * 60 * 60 * 1000; // 24h

// Delete in batches; del() accepts an array but we cap it to stay well within limits.
const DELETE_BATCH = 100;

/**
 * Every blob URL still referenced anywhere in the database. Over-inclusion is
 * safe (a referenced file is never deleted); the danger is under-inclusion, so
 * we scan every column that can hold an upload, plus blob URLs embedded in
 * blog content HTML.
 */
export async function collectReferencedUrls(): Promise<Set<string>> {
  const refs = new Set<string>();
  const add = (value: string | null | undefined) => {
    if (value) refs.add(value);
  };
  const addFromHtml = (html: string | null | undefined) => {
    if (!html) return;
    const matches = html.match(BLOB_URL_RE);
    if (matches) for (const url of matches) refs.add(url);
  };

  const [posts, bookRows, team, designs] = await Promise.all([
    db.select({ thumbnail: blogPosts.thumbnail, content: blogPosts.content }).from(blogPosts),
    db.select({ imageUrl: books.imageUrl }).from(books),
    db.select({ imageUrl: teamMembers.imageUrl }).from(teamMembers),
    db
      .select({ previewUrl: thumbnailDesigns.previewUrl, design: thumbnailDesigns.design })
      .from(thumbnailDesigns),
  ]);

  for (const p of posts) {
    add(p.thumbnail);
    addFromHtml(p.content);
  }
  for (const b of bookRows) add(b.imageUrl);
  for (const t of team) add(t.imageUrl);
  for (const d of designs) {
    add(d.previewUrl);
    add(d.design?.assetUrl);
    add(d.design?.customDecoUrl);
  }

  return refs;
}

export interface BlobGcResult {
  scanned: number;
  referenced: number;
  orphaned: number;
  deleted: number;
  skippedUnmanaged: number;
  skippedRecent: number;
  dryRun: boolean;
  orphanUrls: string[];
}

type BlobClass = "unmanaged" | "referenced" | "recent" | "orphan";

function classifyBlob(
  blob: { url: string; pathname: string; uploadedAt: Date },
  referenced: Set<string>,
  referencedPaths: Set<string>,
  cutoff: number,
): BlobClass {
  if (!isManaged(blob.pathname)) return "unmanaged";
  if (referenced.has(blob.url) || referencedPaths.has(blob.pathname)) return "referenced";
  if (blob.uploadedAt.getTime() > cutoff) return "recent";
  return "orphan";
}

/**
 * Lists every blob and deletes those not referenced by the DB and older than the
 * grace window. Pass `dryRun` to report what would be deleted without deleting.
 */
export async function runBlobGc({
  dryRun = false,
  graceMs = DEFAULT_GRACE_MS,
}: { dryRun?: boolean; graceMs?: number } = {}): Promise<BlobGcResult> {
  const referenced = await collectReferencedUrls();
  // Also index referenced pathnames as a fallback match, in case a stored URL
  // ever differs from the listed `url` by query string or trailing bits.
  const referencedPaths = new Set<string>();
  for (const url of referenced) {
    try {
      referencedPaths.add(new URL(url).pathname);
    } catch {
      // non-URL value (e.g. a built-in asset path) — ignore
    }
  }

  const cutoff = Date.now() - graceMs;
  const orphanUrls: string[] = [];
  let scanned = 0;
  let skippedUnmanaged = 0;
  let skippedRecent = 0;
  let cursor: string | undefined;

  do {
    const res = await list({ cursor, limit: 1000 });
    for (const blob of res.blobs) {
      scanned++;
      switch (classifyBlob(blob, referenced, referencedPaths, cutoff)) {
        case "unmanaged":
          skippedUnmanaged++;
          break;
        case "recent":
          skippedRecent++;
          break;
        case "orphan":
          orphanUrls.push(blob.url);
          break;
        // "referenced" — keep, no counter
      }
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);

  let deleted = 0;
  if (!dryRun && orphanUrls.length > 0) {
    for (let i = 0; i < orphanUrls.length; i += DELETE_BATCH) {
      const chunk = orphanUrls.slice(i, i + DELETE_BATCH);
      await del(chunk);
      deleted += chunk.length;
    }
  }

  return {
    scanned,
    referenced: referenced.size,
    orphaned: orphanUrls.length,
    deleted,
    skippedUnmanaged,
    skippedRecent,
    dryRun,
    orphanUrls,
  };
}
