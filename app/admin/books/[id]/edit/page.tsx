import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BookForm } from "@/components/admin/book-form";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book] = await db.select().from(books).where(eq(books.id, id));

  if (!book) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Book</h1>
      <BookForm book={book} />
    </div>
  );
}
