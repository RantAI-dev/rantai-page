"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { AuthorSelect, type TeamAuthor } from "@/components/admin/author-select";
import { TagSelect, type TagOption } from "@/components/admin/tag-select";
import { normalizeBlogInput } from "@/lib/blog-input";
import type { BlogPost } from "@/lib/db/schema";

// Soft target for SEO meta descriptions; we warn past this, never block.
const EXCERPT_RECOMMENDED = 160;

type Props = {
  post?: BlogPost;
  authors: TeamAuthor[];
  tags: TagOption[];
  heading: string;
  className?: string;
  /** Prefilled thumbnail URL for new posts (e.g. from the generator). */
  initialThumbnail?: string;
};

export function BlogForm({
  post,
  authors,
  tags,
  heading,
  className,
  initialThumbnail,
}: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tag, setTag] = useState(post?.tag ?? tags[0]?.name ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? initialThumbnail ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const excerptOver = excerpt.length > EXCERPT_RECOMMENDED;

  // Keep a legacy author selectable so editing an old post never silently
  // drops its byline just because that person is no longer on the team.
  const authorOptions: TeamAuthor[] =
    author && !authors.some((member) => member.name === author)
      ? [{ name: author, role: null, imageUrl: null }, ...authors]
      : authors;

  // Keep a legacy tag selectable if a post still references a tag that was
  // since removed from the master list, so editing doesn't silently change it.
  const tagOptions: TagOption[] =
    tag && !tags.some((t) => t.name === tag)
      ? [{ name: tag, color: "slate" }, ...tags]
      : tags;

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizeBlogInput({ title, content, excerpt, tag, author, thumbnail, published })),
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
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-[calc(100vh-112px)] flex-col gap-4",
        className
      )}
    >
      {/* Sticky header — title + actions stay visible without scrolling */}
      <div className="-top-6 -mx-6 -mt-6 flex items-center justify-between gap-3 border-b bg-background px-6 py-3">
        <h1 className="truncate text-xl font-semibold">{heading}</h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup
        orientation="horizontal"
        className="h-[calc(100svh-11rem)] min-h-96 rounded-lg border"
      >
        {/* Left panel — metadata */}
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="h-full space-y-6 overflow-y-auto p-5">
            <ImageUpload label="Thumbnail" value={thumbnail} onChange={setThumbnail} folder="thumbnails" showGenerator />

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <span
                  className={cn(
                    "text-xs",
                    excerptOver ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {excerpt.length}/{EXCERPT_RECOMMENDED}
                </span>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Short summary for the blog card &amp; SEO preview. Recommended max
                {" "}{EXCERPT_RECOMMENDED} characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag *</Label>
              <TagSelect value={tag} options={tagOptions} onChange={setTag} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <AuthorSelect
                value={author}
                options={authorOptions}
                onChange={setAuthor}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel — content editor */}
        <ResizablePanel defaultSize={62} minSize={30}>
          <div
            className={cn(
              "flex min-h-0 flex-col gap-2",
              fullscreen ? "fixed inset-0 z-50 bg-background p-4" : "h-full p-5"
            )}
          >
            <div className="flex shrink-0 items-center justify-between">
              <Label>Content *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFullscreen((v) => !v)}
              >
                {fullscreen ? (
                  <>
                    <Minimize2 className="mr-2 size-4" /> Exit fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="mr-2 size-4" /> Fullscreen
                  </>
                )}
              </Button>
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              className="max-h-none min-h-0 flex-1"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </form>
  )
}
