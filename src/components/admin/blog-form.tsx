"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import { ThumbnailUpload } from "@/components/admin/thumbnail-upload";
import { normalizeBlogInput, normalizeSlug } from "@/lib/blog-input";
import type { BlogPost } from "@/lib/db/schema";

const TAGS = ["Product", "Academy", "Company"];

type Props = {
  post?: BlogPost;
};

export function BlogForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tag, setTag] = useState(post?.tag ?? "Product");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [loading, setLoading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(normalizeSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizeBlogInput({ title, slug, content, excerpt, tag, author, thumbnail, published })),
    });

    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to save");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tag *</Label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAGS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
      </div>

      <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />

      <div className="space-y-2">
        <Label>Content *</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-3">
        <Switch id="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
