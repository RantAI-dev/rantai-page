import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { TagForm } from "@/components/admin/tag-form";

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tag] = await db.select().from(tags).where(eq(tags.id, id));

  if (!tag) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Tag</h1>
      <TagForm tag={tag} />
    </div>
  );
}
