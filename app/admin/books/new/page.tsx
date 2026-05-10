import { BookForm } from "@/components/admin/book-form";

export default function NewBookPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New Book</h1>
      <BookForm />
    </div>
  );
}
