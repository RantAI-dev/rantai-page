import { desc } from "drizzle-orm"

import { db } from "@/lib/db"
import { thumbnailDesigns } from "@/lib/db/schema"
import {
  ThumbnailLibrary,
  type ThumbnailDesignListItem,
} from "@/components/admin/thumbnail/library"

export default async function ThumbnailPage() {
  const designs = await db
    .select({
      id: thumbnailDesigns.id,
      name: thumbnailDesigns.name,
      previewUrl: thumbnailDesigns.previewUrl,
      createdAt: thumbnailDesigns.createdAt,
      updatedAt: thumbnailDesigns.updatedAt,
    })
    .from(thumbnailDesigns)
    .orderBy(desc(thumbnailDesigns.updatedAt))

  const items: ThumbnailDesignListItem[] = designs.map((design) => ({
    ...design,
    createdAt: design.createdAt.toISOString(),
    updatedAt: design.updatedAt.toISOString(),
  }))

  return <ThumbnailLibrary designs={items} />
}
