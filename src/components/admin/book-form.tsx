"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThumbnailUpload } from "@/components/admin/thumbnail-upload";
import type { Book } from "@/lib/db/schema";

const CATEGORIES = ["Foundation", "Architecture", "Algorithms", "AI/ML", "Data", "Business"];

export function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const isEdit = !!book;

  const [code, setCode] = useState(book?.code ?? "");
  const [name, setName] = useState(book?.name ?? "");
  const [category, setCategory] = useState(book?.category ?? "Foundation");
  const [imageUrl, setImageUrl] = useState(book?.imageUrl ?? "");
  const [url, setUrl] = useState(book?.url ?? "");
  const [orderIndex, setOrderIndex] = useState(book?.orderIndex ?? 0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("Cover image is required");
      return;
    }

    setLoading(true);

    const apiUrl = isEdit ? `/api/admin/books/${book.id}` : "/api/admin/books";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(apiUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name, category, imageUrl, url: url || null, orderIndex }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? "Book updated" : "Book created");
      router.push("/admin/books");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to save");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code *</Label>
          <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="TRPL" />
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <ThumbnailUpload value={imageUrl} onChange={setImageUrl} label="Cover Image *" folder="books" />

      <div className="space-y-2">
        <Label htmlFor="url">Book URL</Label>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderIndex">Order</Label>
        <Input
          id="orderIndex"
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Book" : "Create Book"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/books")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
