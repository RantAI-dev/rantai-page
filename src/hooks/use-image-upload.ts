import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL, type UploadFolder } from "@/lib/upload";

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
  /** Blob storage folder for uploaded files. Defaults to "uploads". */
  folder?: UploadFolder;
}

// Photos/covers are raster-only here by design (SVG excluded), but share the
// app-wide size cap from @/lib/upload so client and server stay in sync.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useImageUpload({ onUpload, folder }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Upload failed");
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) throw new Error("Upload response missing URL");

      setError(null);
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          const message = "File type not allowed";
          setError(message);
          toast.error(message);
          return;
        }

        if (file.size > MAX_UPLOAD_BYTES) {
          const message = `File too large (max ${MAX_UPLOAD_LABEL})`;
          setError(message);
          toast.error(message);
          return;
        }

        setFileName(file.name);
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        previewRef.current = localUrl;

        try {
          const uploadedUrl = await uploadImage(file);
          onUpload?.(uploadedUrl);
        } catch {
          URL.revokeObjectURL(localUrl);
          setPreviewUrl(null);
          setFileName(null);
          previewRef.current = null;
          return;
        }
      }
    },
    [onUpload, folder]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading,
    error,
  };
}
