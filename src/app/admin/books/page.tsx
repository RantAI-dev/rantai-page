import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminBooksPage() {
  const allBooks = await db.select().from(books).orderBy(asc(books.orderIndex));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Link href="/admin/books/new">
          <Button size="sm">New Book</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">Cover</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allBooks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No books yet.</td>
              </tr>
            )}
            {allBooks.map((book) => (
              <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-8 h-10 rounded overflow-hidden">
                    <Image src={book.imageUrl} alt={book.name} fill className="object-cover" unoptimized />
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs font-medium">{book.code}</td>
                <td className="px-4 py-3 max-w-xs truncate">{book.name}</td>
                <td className="px-4 py-3"><Badge variant="outline">{book.category}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/books/${book.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <DeleteButton id={book.id} endpoint="/api/admin/books" redirectTo="/admin/books" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
