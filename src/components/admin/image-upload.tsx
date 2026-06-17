"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { ThumbnailGeneratorDialog } from "@/components/admin/thumbnail/generator-dialog";
import { getUploadError, type UploadFolder } from "@/lib/upload";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Blob storage folder for uploads. Defaults to "thumbnails". */
  folder?: UploadFolder;
  /** Show the "Create with generator" action in the empty state. */
  showGenerator?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "thumbnails",
  showGenerator = false,
}: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Derive empty-state copy from the label, e.g. "Cover Image *" -> "cover image".
  const noun = label.replace(/\s*\*$/, "").toLowerCase();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = getUploadError(file);
    if (validationError) {
      toast.error(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Upload failed");
    }

    // reset input so same file can be re-uploaded if needed
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value ? (
        /* Preview */
        <div className="relative w-full">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={value}
              alt={`${noun} preview`}
              fill
              className="object-cover"
              loading="eager"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
          >
            <XIcon className="size-3" />
          </button>
        </div>
      ) : (
        /* Empty state */
        <Empty className="w-full border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No {noun} yet</EmptyTitle>
            <EmptyDescription>
              {showGenerator
                ? `Upload an image or generate one to use as the ${noun}.`
                : `Upload an image to use as the ${noun}.`}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                <UploadIcon className="mr-2 size-4" />
                {uploading ? "Uploading…" : "Upload Image"}
              </Button>
              {showGenerator && (
                <ThumbnailGeneratorDialog
                  folder={folder}
                  onUse={(url) => {
                    onChange(url);
                    toast.success("Thumbnail attached");
                  }}
                />
              )}
            </div>
          </EmptyContent>
        </Empty>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
