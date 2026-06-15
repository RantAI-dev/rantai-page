import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { thumbnailDesigns } from "@/lib/db/schema"
import { ThumbnailEditor } from "@/components/admin/thumbnail/editor"

export default async function EditThumbnailDesignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [design] = await db
    .select()
    .from(thumbnailDesigns)
    .where(eq(thumbnailDesigns.id, id))

  if (!design) notFound()

  return (
    <ThumbnailEditor
      design={{
        id: design.id,
        name: design.name,
        updatedAt: design.updatedAt.toISOString(),
        design: design.design,
      }}
    />
  )
}
