import { ThumbnailGenerator } from "@/components/admin/thumbnail/generator"

export default function ThumbnailPage() {
  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Thumbnail Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate blog cover thumbnails. Upload to get a URL you can paste into
          any blog post.
        </p>
      </div>
      <ThumbnailGenerator />
    </div>
  )
}
