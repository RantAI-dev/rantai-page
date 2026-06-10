"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, XIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ThumbnailUpload({ value, onChange, label = "Thumbnail" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

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

      {/* Preview */}
      {value && (
        <div className="relative w-full max-w-sm">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={value}
              alt="Thumbnail preview"
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
      )}

      {/* Upload button */}
      <div className="flex items-center gap-3">
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
        <span className="text-xs text-muted-foreground">atau</span>
        <Input
          placeholder="Paste URL langsung"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
